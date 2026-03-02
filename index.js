const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express'); // أضفنا هذا المكتبة

const app = express();
const port = 8080;
let lastQr = null;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser' 
    }
});

client.on('qr', (qr) => {
    lastQr = qr; // حفظ الرمز لإظهاره في المتصفح
    qrcode.generate(qr, {small: true});
    console.log('يرجى مسح رمز QR من المتصفح أو هنا.');
});

// إعداد صفحة الويب لعرض الـ QR
app.get('/', (req, res) => {
    if (lastQr) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(lastQr)}&size=300x300`;
        res.send(`<center><h1>Scan QR for Eyes-Bot</h1><img src="${qrImage}"></center>`);
    } else {
        res.send('<center><h1>✅ Bot is Connected!</h1></center>');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Web Server is running on http://192.168.52.136:${port}`);
});

client.initialize();
