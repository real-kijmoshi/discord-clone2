const express = require("express");
const router = express.Router();
const { User } = require("../db");
const { sendVerificationEmail } = require("../utils/email");

// Constants
const MINUTE = 1000 * 60;
const TEN_MINUTES = 10 * MINUTE;

// In-memory storage for verification codes
const codes = new Map();

// Periodically clean up expired codes
setInterval(() => {
    const now = Date.now();
    codes.forEach((value, code) => {
        if (value.expires < now) {
            console.log(`Deleted code ${code} for ${value.email}`);
            codes.delete(code);
        }
    });
}, MINUTE);

// Generate a new unique verification code
const generateCode = () => {
    let code;
    do {
        code = 
            Math.floor(Math.random() * 1000000).toString().padStart(6, "0") +
            Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
    } while (codes.has(code));
    return code;
};

// Create a new verification code and send the verification email
const verify = async (email) => {
    
    const code = generateCode();
    codes.set(code, {
        email,
        expires: Date.now() + TEN_MINUTES
    });

    const user = await User.findOne({ "auth.email": email });
    if (user) {
        sendVerificationEmail(email, code, user.username);
    }
};

// Route to verify the code
router.get("/verify/:code", async (req, res) => {
    const { code } = req.params;

    if (!codes.has(code)) {
        return res.send("Invalid or expired code");
    }

    const { email } = codes.get(code);
    codes.delete(code);

    const user = await User.findOne({ "auth.email": email });
    if (!user) {
        return res.send("User not found");
    }

    user.emailVerified = true;
    await user.save();
    res.send("Email verified ✅");
});

// Export the router and verify function
module.exports = router;
module.exports.verify = verify;

verify("spamn28@gmail.com");