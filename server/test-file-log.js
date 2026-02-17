const mongoose = require('mongoose');
const fs = require('fs');
const dns = require('dns');
require('dotenv').config();

const logFile = 'debug_log.txt';
fs.writeFileSync(logFile, 'Starting...\n');

const log = (msg) => {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
};

try { dns.setServers(['8.8.8.8', '8.8.4.4']); } catch (e) { }

const run = async () => {
    try {
        log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
        log('Connected.');

        const schema = new mongoose.Schema({ name: String });
        schema.pre('save', function (next) {
            log('Pre-save hook.');
            next();
        });
        const Test = mongoose.model('TestFileLog', schema);

        const doc = new Test({ name: 'Foo' });
        log('Saving...');
        await doc.save();
        log('Saved.');

        process.exit(0);
    } catch (err) {
        log('ERROR: ' + err.stack);
        process.exit(1);
    }
};

run();
