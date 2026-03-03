const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js'
    },
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        executablePath: '/usr/bin/chromium-browser' // المسار الصحيح للسيرفر المحلي
    }
});

let lastQr = null;

client.on('qr', (qr) => {
    lastQr = qr;
    qrcode.generate(qr, {small: true});
    console.log('يرجى مسح الرمز الجديد للربط');
});

client.on('ready', () => {
    lastQr = null;
    console.log('✅ تم الاتصال بنجاح! البوت يرد الآن.');
});

client.on('message', async msg => {
    const text = msg.body.trim().toLowerCase();
    console.log('رسالة واصلة: ' + text);

    if (text === '1') {
        await msg.reply("📋 *إجراءات التشغيل:* \n- تعقيم \n- استقبال");
    } else if (text === '2') {
        await msg.reply("📅 *المناوبات:* د. أحمد - م. سارة");
    } else {
        // الرد التلقائي الشامل على أي رسالة
        await msg.reply(
            "🏥 *نظام دعم مستشفى العيون*\n\n" +
            "أرسل الرقم المطلوب:\n" +
            "1. إجراءات التشغيل\n" +
            "2. جداول المناوبات"
        );
    }
});

app.get('/', (req, res) => {
    if (lastQr) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(lastQr)}&size=300x300`;
        res.send(`<center><h1>Scan QR</h1><img src="${qrImage}"></center>`);
    } else {
        res.send('<center><h1 style="color:green;">✅ Bot is Connected!</h1></center>');
    }
});

app.listen(8080, '0.0.0.0');
client.initialize();
