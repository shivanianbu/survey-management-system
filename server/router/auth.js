const express=require("express")
const router=express.Router()
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const User=require("../model/userModel")

//Register User
router.post("/register", async(req,res) => {

    const { firstName, lastName, email, gender,dob, password, district } = req.body.data;
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
        const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET,{ expiresIn: '1800s' });
        res.json({ message: "User Registered Successfully", id: savedUser._id, token: token });
    } catch (err) {
        res.status(400).json({ message: `Something went wrong ${err}` });
    }
});


//Login User
router.post("/login", async(req, res) => {

    const { email, password } = req.body.data;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: "Email doesn't exist" });
  
    // Check if password is valid //
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Password is not valid" });
  
    // JWT //
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET,{ expiresIn: '1800s' });
    res.json({ message: "User logged in", id:user._id, isAdmin: user.isAdmin, token: token });
  });

module.exports = router;