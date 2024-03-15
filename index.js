const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 5000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '/public')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const emailTemplateFilePath = path.join(__dirname, 'index.html');
const emailTemplateContent = fs.readFileSync(emailTemplateFilePath, 'utf-8');

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const data = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                data.push({
                    email: row.getCell(4).value,
                    name: row.getCell(1).value,
                });
            }
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        for (const item of data) {
            if (!item.email || typeof item.email.text !== 'string' || item.email.text.trim() === '') {
                console.log(`Skipping sending email to ${item.name} because email address is empty or null`);
                continue;
            }
            await transporter.sendMail({
                from: `"Agnito Technologies" <${process.env.SMTP_USER}>`,
                to: item.email.text,
                subject: 'Unlock Growth Opportunities: Tailored Website and App Solutions for Your Restaurant',
                html: emailTemplateContent.replace('[Restaurant Owner\'s Name]', item.name),
            });
            console.log(`Email sent to ${item.email.text}: Subject - "Unlock Growth Opportunities: Tailored Website and App Solutions for Your Restaurant"`);
        }

        res.status(200).send('Emails sent successfully');
    } catch (error) {
        console.error('Error processing file or sending emails:', error);
        res.status(500).send('Error processing file or sending emails');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
