const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const exceljs = require('exceljs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Run on the last day of the month at 23:59
// '59 23 28-31 * *' needs checking if it's the last day
cron.schedule('59 23 28-31 * *', async () => {
    const today = new Date();
    const cleanDate = new Date(today);
    cleanDate.setDate(today.getDate() + 1); // Check if tomorrow is the 1st

    if (cleanDate.getDate() === 1) {
        console.log('Running Monthly Attendance Report...');
        await generateAndSendReports();
    }
});

// For testing purposes, uncomment this to run every minute
// cron.schedule('* * * * *', generateAndSendReports);

async function generateAndSendReports() {
    try {
        const users = await User.find({ role: 'employee' });
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();

        for (const user of users) {
            const attendance = await Attendance.find({
                user: user._id,
                date: { $gte: startOfMonth, $lte: endOfMonth }
            });

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Attendance');

            worksheet.columns = [
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Clock In', key: 'clockIn', width: 20 },
                { header: 'Clock Out', key: 'clockOut', width: 20 },
                { header: 'Status', key: 'status', width: 10 }
            ];

            attendance.forEach(record => {
                worksheet.addRow({
                    date: record.date.toLocaleDateString(),
                    clockIn: record.clockIn ? record.clockIn.toLocaleTimeString() : '-',
                    clockOut: record.clockOut ? record.clockOut.toLocaleTimeString() : '-',
                    status: record.status
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Monthly Attendance Report',
                text: 'Please find attached your attendance report for this month.',
                attachments: [
                    {
                        filename: `Attendance_Report_${user.name}.xlsx`,
                        content: buffer,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
            console.log(`Report sent to ${user.email}`);
        }
    } catch (error) {
        console.error('Error generating reports:', error);
    }
}

module.exports = { generateAndSendReports }; // Export for manual trigger if needed
