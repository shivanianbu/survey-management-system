const User = require("../model/userModel");
const {verify} = require("./verifyToken");
const router = require("./auth");


//Get user
router.get("/", verify, async (req, res) => {
  console.log("getUser",req.body," ",req.user)
  const userDetails = await User.findById({ _id: req.user._id }).select(
    "-password"
  );
  res.json(userDetails);
});

//Fetch all users
router.get("/fetch", verify, async (req, res) => {
  try {
    const userDetails = await User.find({
      email: { $not: { $eq: "admin@survey.com" } },
    }).select("-password");
    if (userDetails.length === 0) {
      res.status(200).json({ message: "no records" });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error) {
    res.send(error);
  }
});


//Edit user
router.put("/:userId", verify, async (req, res) => {
    try {
        const updateUser = req.body.data
        console.log(updateUser)
      const user = await User.findByIdAndUpdate({_id:req.params.userId}, {$set: updateUser});
      console.log("user",user)
      res.status(200).json({ id: user._id , message: "Updated Successfully"});
    } catch (err) {
      res.send(err);
    }
  });


//Delete User
router.delete("/:userId/delete", verify, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ id: user._id });
  } catch (err) {
    res.send(err);
  }
});


module.exports = router;
