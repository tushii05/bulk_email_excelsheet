// const express = require('express');
// const multer = require('multer');
// const ExcelJS = require('exceljs');
// const nodemailer = require('nodemailer');
// const path = require('path');
// const fs = require('fs');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();
// const port = 5000;

// const upload = multer({ dest: 'uploads/' });

// app.use(express.static(path.join(__dirname, '/public')));
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });

// const htmlFilePath = path.join(__dirname, 'index.html');
// const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         const filePath = req.file.path;
//         // console.log(filePath, 'filePath')
//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.readFile(filePath);
//         const worksheet = workbook.getWorksheet(1);
//         // console.log(worksheet, 'worksheet')
//         const data = [];
//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber !== 1) {
//                 data.push({
//                     email: row.getCell(4).value,
//                     name: row.getCell(1).value,
//                 });
//             }
//         });

//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: 587,
//             secure: false,
//             requireTLS: true,
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASS,
//             },
//         });


//         for (const item of data) {
//             // console.log(item.email.text); return;

//             await transporter.sendMail({
//                 from: `"Agnito Technologies" <${process.env.SMTP_USER}>`,
//                 to: item.email.text,
//                 subject: `Unlock Growth Opportunities: Tailored Website and App Solutions for Your Restaurant"`,
//                 text: `<html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Email Template</title>
//     <style>
//         body {
//             margin: 0;
//             padding: 0;
//             font-family: Arial, sans-serif;
//             background-color: #f4f4f4;
//             color: #333;
//         }

//         .container {
//             max-width: 600px;
//             margin: 20px auto;
//             padding: 20px;
//             background-color: #fff;
//             border-radius: 10px;
//             box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//         }

//         .header {
//             background-color: #007bff;
//             color: #fff;
//             text-align: center;
//             padding: 1px;
//             border-top-left-radius: 10px;
//             border-top-right-radius: 10px;
//         }

//         .content {
//             padding: 20px;
//             line-height: 1.6;
//         }

//         .footer {
//             text-align: center;
//             color: #777;
//             font-size: 14px;
//         }

//         .footer a {
//             color: #09e309;
//             text-decoration: none;
//         }
//     </style>
// </head>

// <body>

//     <div class="container">
//         <div class="header">
//             <h2>Welcome to Agnito Technologies</h2>
//         </div>
//         <div class="content">
//             <p>Dear [Restaurant Owner's Name],</p>
//             <p>I hope this email finds you well. My name is Nitin and I am reaching out to you on behalf of Agnito
//                 Technologies Private Limited, a leading provider of website and app development services tailored
//                 specifically for restaurants like yours.</p>
//             <p>In today's digital age, having a strong online presence is crucial for the success of any business,
//                 especially in the highly competitive restaurant industry. We understand the challenges you face in
//                 attracting new customers, enhancing customer experience, and streamlining your operations. That's why we
//                 offer comprehensive solutions to help you leverage the power of technology to achieve your business
//                 goals.</p>
//             <p>Thank you for considering Agnito Technologies Private Limited as your partner in success. I look forward
//                 to the possibility of working together to take your restaurant to new heights.</p>
//             <p>Warm regards,<br>
//                 Nitin Singh<br>
//                 Business Development Manager<br>
//                 Agnito Technologies Pvt. Ltd.</p>
//             <p><strong>Registered Office:</strong><br>
//                 E-2/59 Arera Colony, Bhopal<br>
//                 Madhya Pradesh- 462016<br>
//                 INDIA<br>
//                 Contact: +91-8770927226<br>
//                 Skype: nitinchouhan7<br>
//                 <a href="http://www.agnitotechnologies.com/">http://www.agnitotechnologies.com/</a>
//             </p>
//         </div>
//         <div class="footer">
//             <p>© 2024 Agnito Technologies Pvt. Ltd. All rights reserved.</p>
//         </div>
//     </div>

// </body>

// </html>`
//             });
//             console.log(`Email sent to ${item.email.text}: Subject - "Your Subject Here"`);

//         }

//         res.status(200).send('Emails sent successfully');
//     } catch (error) {
//         console.error('Error processing file or sending emails:', error);
//         res.status(500).send('Error processing file or sending emails');
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });



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
