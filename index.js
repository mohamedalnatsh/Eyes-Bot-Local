const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// إعداد البوت ليعمل في بيئة السيرفر (Render)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'
    }
});

// إظهار رمز QR في السجلات (Logs)
client.on('qr', (qr) => {
    console.log('يرجى مسح رمز QR أدناه للربط:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ تم الاتصال بنجاح! بوت مستشفى العيون جاهز للعمل.');
});

// منطق الرد على الرسائل
client.on('message', async msg => {
    const text = msg.body.toLowerCase();

    if (text === 'بداية' || text === 'قائمة') {
        await msg.reply(
            "🏥 *مرحباً بك في نظام دعم مستشفى العيون*\n\n" +
            "أرسل الرقم المطلوب:\n" +
            "1. إجراءات التشغيل (SOPs)\n" +
            "2. جداول المناوبات اليومية\n" +
            "3. تعليمات العمليات"
        );
    } 
    else if (text === '1') {
        await msg.reply("📋 *إجراءات التشغيل:* \n- تعقيم (ارسل 'تعقيم')\n- استقبال (ارسل 'ليزر')");
    } 
    else if (text === '2') {
        await msg.reply("📅 *المناوبات:* د. أحمد (مناوب العمليات) - م. سارة (مشرف التمريض)");
    }
    else if (text === 'تعقيم') {
        await msg.reply("🧴 *خطوات التعقيم:* \n1. تطهير الأسطح بـ.. \n2. تشغيل جهاز.. \n3. توثيق السجل.");
    }
});

client.initialize();