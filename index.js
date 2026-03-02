const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
const port = 8080;
let lastQr = null;

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        executablePath: '/usr/bin/chromium-browser', // مسار أوبنتو سيرفر
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    lastQr = qr;
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ البوت متصل وجاهز للعمل على VM!');
});

client.on('message_create', async (msg) => {
    try {
        if (msg.fromMe) return;
        const text = msg.body.trim();
        const menu = `🏥 *مستشفى العيون - القائمة الرئيسية*\n\n1️⃣ تعليمات تعقيم غرفة العمليات\n2️⃣ تعليمات استقبال مريض ليزر\n3️⃣ جداول المناوبات\n\n_أرسل الرقم المطلوب فقط_`;

        if (text === '1') await client.sendMessage(msg.from, '🔹 *تعليمات تعقيم الغرفة (تجريبي)*');
        else if (text === '2') await client.sendMessage(msg.from, '🔹 *تعليمات استقبال مريض ليزر (تجريبي)*');
        else if (text === '3') await client.sendMessage(msg.from, '🔹 *جداول المناوبات (تجريبي)*');
        else await client.sendMessage(msg.from, menu); // الرد بالقائمة على أي كلمة أخرى
    } catch (err) { console.error('Error:', err.message); }
});

app.get('/', (req, res) => {
    if (lastQr) {
        const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(lastQr)}&size=300x300`;
        res.send(`<center><h1>امسح الرمز</h1><img src="${qrImage}"></center>`);
    } else { res.send('<center><h1>✅ البوت متصل</h1></center>'); }
});

app.listen(port, '0.0.0.0', () => console.log(`QR Server on port ${port}`));
client.initialize();
