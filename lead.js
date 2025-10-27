const mongoose = require('mongoose');

// Define the schema for a Lead
const LeadSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Leads must be unique
        trim: true,
        lowercase: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Export the model
module.exports = mongoose.model('Lead', LeadSchema);
