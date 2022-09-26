const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")
const { createToken } = require('./verifyToken')

//Register User
router.post("/register", async (req, res) => {

    const { firstName,
        lastName,
        email,
        gender,
        dob,
        password,
        district } = req.body.data;
    const emailExist = await User.findOne({ email });

    if (emailExist) {
        return res.status(400).json({ message: "Email already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let isAdmin = false;
    if (email === "admin@survey.com") isAdmin = true;

    const user = new User({
        firstName,
        lastName,
        email,
        gender,
        dob,
        password: hashedPassword,
        district,
        isAdmin
    });

    try {
        const savedUser = await user.save();
        const userId = savedUser._id;

        const token = createToken(userId)
        res.json({ message: "User Registered Successfully", id: userId, token: token });
    } catch (err) {
        res.status(400).json({ message: `Something went wrong ${err}` });
    }
});


//Login User
router.post("/login", async (req, res) => {

    const { email, password } = req.body.data;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Email doesn't exist" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(400).json({ message: "Password is not valid" });

    const token = createToken(user._id)
    res.json({ message: "User logged in", id: user._id, token: token });
});

module.exports = router;