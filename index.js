const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 8080;

let lastQr = null;

const client = new Client({
    authStrategy: new LocalAuth(),
    // حل مشكلة الـ WebCache لتجنب أخطاء TypeError
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-js/main/dist/wppconnect-wa.js'
    },
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
        executablePath: '/usr/bin/chromium-browser' 
    }
});

client.on('qr', (qr) => {
    lastQr = qr;
    qrcode.generate(qr, {small: true});
    console.log('يرجى مسح رمز QR من المتصفح أو من هنا.');
});

client.on('ready', () => {
    lastQr = null;
    console.log('✅ تم الاتصال بنجاح! البوت جاهز للعمل.');
});

// إعداد صفحة الويب لعرض الـ QR
app.get('/', (req, res) => {
    if (lastQr) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(lastQr)}&size=300x300`;
        res.send(`
            <center>
                <h1 style="font-family: Arial, sans-serif; color: #25D366;">Scan QR for Eyes-Bot</h1>
                <img src="${qrImage}" style="border: 10px solid #f0f0f0; border-radius: 10px;">
                <p style="color: #666;">يرجى مسح الرمز باستخدام تطبيق واتساب</p>
            </center>
        `);
    } else {
        res.send(`
            <center>
                <h1 style="font-family: Arial, sans-serif; color: #25D366;">✅ Bot is Connected!</h1>
                <p style="color: #666;">البوت يعمل الآن في الخلفية.</p>
            </center>
        `);
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Web Server is running on http://192.168.52.136:${port}`);
});

client.initialize();
