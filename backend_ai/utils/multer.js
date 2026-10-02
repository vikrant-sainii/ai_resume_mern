let multer = require('multer');

// Memory storage for serverless deployment compatibility (e.g. Vercel)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF allowed"), false);
};

exports.upload = multer({ storage, fileFilter });