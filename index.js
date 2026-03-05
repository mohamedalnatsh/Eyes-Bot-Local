const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js'); 
const qrcode = require('qrcode-terminal');
const express = require('express');
const path = require('path');   
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
        executablePath: '/usr/bin/chromium-browser' 
    }
});

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
        await msg.reply("📋 *إجراءات التشغيل:* \n- تعقيم (ارسل 'تعقيم')\n- استقبال (ارسل 'استقبال')");
    } 
    else if (text === '2') {
        await msg.reply("📅 *المناوبات:* \n- م.رشيد(الأحد 72 ساعة)\n- م.ط.د.ع.ا.م.ي شرين (أي يوم أي ساعة)\n- م.أحمد (السبت 24 ساعة)");
    }
    else if (text === '3'){
        await msg.reply("*تعليمات العمليات* \n- تنظيف الشسمو \n- طرد البشر من الغرفة \n- أغلاق الأجهزة الألكترونية");        
    }
    else if (text === 'أستقبال') {
        await msg.reply("🧴 *خطوات الأستقبال:* \n1. أبتسام عشان محترمين \n2. ما نثقل دمنا على الناس .. \n3. ما بنتأخر في الدوام لانو عنا أهل يسئلو علينا");
    }
    else if (text === 'تعقيم') {
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
});

app.listen(8080, '0.0.0.0');
client.initialize();



