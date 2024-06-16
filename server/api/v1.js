const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../utils/auth');
const { User } = require('../db');
const email = require('../utils/email');

require('dotenv').config();

const router = express.Router();

const codes = new Map();

const newCode = (email) => {
    let code;
    do {
        code = Math.floor(Math.random() * 1000000).toString().padStart(6, '0') + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    } while (codes.has(code));

    codes.set(code, email);
    return code;
}


router.use((req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        req.user = null;
        return next();
    }
    
    jwt.verify(token, process.env.JWT, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token', ok: false });
        }
        req.user = decoded;
        next();
    });
});

router.get("/verify/:code", async (req, res) => {
    const code = req.params.code;
    
    if (!codes.has(code)) {
        return res.send('Invalid code');
    }

    const userEmail = codes.get(code);
    codes.delete(code);

    const user = await User.findOne({ 'auth.email': userEmail });
    if (!user) {
        return res.send('User not found');
    }

    user.emailVerified = true;
    await user.save();

    res.send('Email verified');

});



// _____________________________
// Auth protected routes
// _____________________________


const authProteced = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized', ok: false });
    }
    next();
}

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        return res.status(400).json({ message: 'Missing fields', ok: false });
    }

    const authenticated = await auth.authenticate(username, password);
    if (!authenticated) {
        return res.status(401).json({ message: 'Invalid credentials', ok: false });
    }

    const user = await User.findOne({
        username
    });

    const token = jwt.sign({
        username: user.username,
        snowflake: user.snowflake,
        random: Math.floor(Math.random() * 1000)
    }, process.env.JWT);

    res.json({ token });
})

router.post('/register', async (req, res) => {
    const { username, password, email: userEmail } = req.body;
    if(!username || !password || !userEmail) {
        return res.status(400).json({ message: 'Missing fields', ok: false });
    }

    //find by mail or username
    const user = await User.findOne({
        $or: [
            { username },
            { email: userEmail }
        ]
    });

    console.log(password)

    if (user?.auth.email == userEmail) {
        return res.status(400).json({ message: 'Email already in use', ok: false });
    } else if (user) {
        return res.status(400).json({ message: 'Username already in use', ok: false });
    }

    const code = newCode(userEmail);
    email.sender.addToQueue(userEmail, 'Verify your email', 
        email.
        presets.
        verify.
        replaceAll("{{url}}", `${process.env.URL}/api/v1/verify/${code}`).
        replace("{{user}}", username));

    const registered = await auth.register(username, password, userEmail);
    if (!registered) {
        return res.status(500).json({ message: 'Failed to register', ok: false });
    }


    res.json({ message: 'Registered' });
});

router.get("/whoami", authProteced, (req, res) => {
    res.json(req.user);
});


module.exports = router;