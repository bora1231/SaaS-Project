require('dotenv').config({ path: '.env' });
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Lead = require('./models/lead');
const { sendVerificationEmail } = require('./emailService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

const MONGODB_URI = process.env.MONGODB_URI;

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('❌ Mongoose connection ERROR:', error.message);
});

db.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB Atlas');
});

async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB Atlas!');

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../client', 'index.html'));
        });

        app.post('/signup', async (req, res) => {
            const { fullName, email } = req.body;

            if (!fullName || !email) {
                return res.status(400).json({ msg: 'Full name and email are required.' });
            }
            
            if (db.readyState !== 1) { 
                console.error('SERVER ERROR during sign-up process: Database was unexpectedly disconnected.');
                return res.status(503).json({ msg: 'Service unavailable. Database connection failed.' });
            }

            try {
                const newLead = new Lead({ fullName: fullName, email: email }); 
                await newLead.save();

                console.log('[SUCCESS] Successfully captured lead data:', newLead);

                try {
                    await sendVerificationEmail(email, fullName);
                } catch (emailError) {
                    console.warn('[EMAIL-WARNING] Failed to send verification email:', emailError.message);
                }

                res.status(200).json({ msg: 'Signup successful. Redirecting...', name: fullName });

            } catch (error) {
                console.error('SERVER ERROR during sign-up process:', error);

                if (error.code === 11000) {
                    return res.status(409).json({ msg: 'This email is already registered.' });
                }

                res.status(500).json({ msg: 'Server Error during sign-up process.' });
            }
        });

        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error('FATAL ERROR: Could not connect to MongoDB Atlas. Check URI, IP Whitelist, and Password.', error.message);
        process.exit(1);
    }
}

startServer();
