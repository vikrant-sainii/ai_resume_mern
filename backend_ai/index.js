require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const path = require('path');

require('./conn');
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Allow all origins dynamically (reflect requesting origin) for seamless cross-origin requests
        callback(null, true);
    }
}));

const UserRoutes = require('./Routes/user');
const ResumeRoutes = require('./Routes/resume');

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "AI Resume Backend is running smoothly." });
});

app.use('/api/user', UserRoutes);
app.use('/api/resume', ResumeRoutes);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log("Backend is running on port", PORT);
    });
}

module.exports = app;