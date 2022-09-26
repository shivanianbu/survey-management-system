const User = require("../model/userModel");
const { verify } = require("./verifyToken");
const router = require("./auth");


//Get User by ID
router.get("/", verify, async (req, res) => {
  const userDetails = await User.findById({ _id: req.user._id }).select(
    "-password"
  );
  res.json(userDetails);
});

//Fetch all users
router.get("/fetch", verify, async (req, res) => {
  try {
    const userDetails = await User.find({
      isAdmin: { $not: { $eq: true } },
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
    const user = await User.findByIdAndUpdate(
      {_id: req.params.userId },
      { $set: updateUser });
    res.status(200).json({ id: user._id, message: "Updated Successfully" });
  } catch (err) {
    res.send(err);
  }
});


//Delete User
router.delete("/:userId/delete", verify, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ id: user._id , message: "Deleted Successfully" });
  } catch (err) {
    res.send(err);
  }
});


module.exports = router;
