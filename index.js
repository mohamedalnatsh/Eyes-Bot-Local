const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js'); 
const qrcode = require('qrcode-terminal');
const express = require('express');
const path = require('path');   
const app = express();
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
            '--single-process', // هذا الخيار يحل مشكلة الـ memlock
            '--disable-gpu'
        ],
    }
});
const { exec } = require('child_process');

function checkInternetAndStart() {
    console.log("Checking internet connection...");
    // محاولة عمل ping لـ Google للتأكد من وجود نت
    exec('ping -c 1 google.com', (error) => {
        if (error) {
            console.log("No internet yet, retrying in 10 seconds...");
            setTimeout(checkInternetAndStart, 10000); // إعادة المحاولة بعد 10 ثواني
        } else {
            console.log("Internet connected! Starting the bot...");
            client.initialize(); // تشغيل البوت فقط عند وجود نت
        }
    });
}

// استبدل سطر client.initialize() القديم بهذا الاستدعاء:
checkInternetAndStart();

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ البوت جاهز الآن!');
});

client.on('message', async msg => {
    const text = msg.body.trim().toLowerCase();
    
    if (text === 'بداية' || text === 'قائمة') {
        await msg.reply(
            "🏥 *مرحباً بك في نظام دعم مستشفى العيون*\n\n" +
            "أرسل الرقم المطلوب:\n" +
            "1. إجراءات التشغيل SOPs\n" +
            "2. جداول المناوبات اليومية\n" +
            "3. تعليمات العمليات\n" +
            "4. جدول دوام الأمن PDF\n"
        );
    } 
    else if (text === '1') {
        await msg.reply("📋 *إجراءات التشغيل:* \n- تعقيم (ارسل '*تعقيم*'أو'*تع*')\n- استقبال (ارسل '*استقبال*'أو'*اس*')");
    }
    else if (text === '2') {
        await msg.reply("📅 *المناوبات:* \n- م.رشيد(الأحد 24 ساعة)\n- م.شرين (الأثنين 24 ساعة)\n- م.أحمد (السبت 24 ساعة)");
    }
    else if (text === '3'){
        await msg.reply("🪚*تعليمات العمليات* \n- انتظار تحميل نظام التشغيل.\n- التأكد من توصيل الكهرباء.\n- أغلاق الأجهزة الألكترونية");        
    }
    else if (text === 'أستقبال' || text === 'استقبال'|| text ==='خطوات الأستقبال'|| text ==='اس') {
        await msg.reply("🧴 *خطوات الأستقبال:* \n1.التوقيع على الإقرارات \n2. الترحيب بلمرضى .. \n3. أرشاد المراجعين");
    }
    else if (text === 'تعقيم'|| text === 'تعليمات التعقيم' || text ==='خطوات التعقيم'|| text === 'أجراءات التعقيم'|| text ==='تع') {
        await msg.reply("🧴 *خطوات التعقيم:* \n1. تطهير الأسطح بـ.. \n2. تشغيل جهاز.. \n3. توثيق السجل.");
    }
    else if (text === '4') {
        try {
            const media = MessageMedia.fromFilePath('./security.pdf');
            await client.sendMessage(msg.from, media, { caption: '📄 تفضل، هذا هو جدول دوام الأمن المعتمد.' });
        } catch (error) {
            console.error('خطأ في إرسال الملف:', error);
            await msg.reply("⚠️ عذراً، حدث خطأ أثناء محاولة إرسال ملف الجدول.");
        }
    }
    else {
        await msg.reply(
            "🏥 *مرحباً بك في نظام دعم مستشفى العيون*\n\n" +
            "1. إجراءات التشغيل (SOPs)\n" +
            "2. جداول المناوبات اليومية\n" +
            "3. تعليمات العمليات\n" +
            "4. جدول دوام الأمن (PDF)\n\n" +
            "*الرجاء إرسال رقم الخيار المطلوب.*"
        );
    }
});

app.listen(8080, '0.0.0.0');
client.initialize();









