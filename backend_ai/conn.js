const mongoose = require('mongoose');

let rawURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'Add your own Connection URL';
const MONGODB_URI = rawURI.replace(/<([^>]+)>/g, '$1');

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }
    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("Database Connected Successfully");
    } catch (err) {
        console.log("Database Connection Error:", err);
    }
};

connectDB();

module.exports = connectDB;