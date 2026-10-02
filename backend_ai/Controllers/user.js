const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        let userExist = await UserModel.findOne({ email: email });
        if (!userExist) {
            userExist = new UserModel({
                name: name || email.split('@')[0],
                email: email,
                photoUrl: photoUrl || ""
            });
            await userExist.save();
        }

        return res.status(200).json({
            message: "User logged in successfully",
            user: userExist
        });
    } catch (err) {
        console.error("User registration error:", err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};