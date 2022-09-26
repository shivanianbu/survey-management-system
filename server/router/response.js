const router = require("express").Router();
const Response = require('../model/responseModel')
const { verify } = require("./verifyToken");
const Survey = require("../model/surveyModel");
const User = require("../model/userModel");



router.post("/", verify, async (req, res) => {
    try {
        const { surveyId, userId, district, responses } = req.body.data;
        const isExists = await isResponseAlreadyExist({ surveyId, userId })
        if (!isExists) {
        const responseData = new Response({
            surveyId,
            userId,
            district,
            responses
        });
        await responseData.save();
        const { wallet } = await walletAndSurveyIncrement(userId)
        res.status(200).json({ message: "Response Recorded and Updated Wallet", userWallet: wallet });
        } else {
            res.status(200).json({ message: "The user Already submitted the record" })
        }
    } catch (err) {
        res.json(err);
    }
});


router.get("/responseCount/:surveyId", verify, async (req, res) => {
    try {
      const count = await Response.countDocuments({
        surveyId: req.params.surveyId,
      });
      res.status(200).json({ TotalCountBySurvey : count });
    } catch (error) {
      res.send(error);
    }
  });


router.get("/dashboard/getdetails", verify, async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const surveyCount = await Survey.countDocuments({});
        
        res.status(200).json({TotalUsers: userCount, TotalSurveys: surveyCount});
    } catch (error) {
      res.status(400).json(error);
    }
  });

  const isResponseAlreadyExist = async ({ surveyId, userId }) => {
    try {
        const result = await Response.exists({ surveyId, userId });
        return (result);
    } catch (error) {
        return false;
    }
}


const walletAndSurveyIncrement = async (userId) => {

    try {
        const isUser = await User.findOne({ _id: userId });
        if (isUser) {
            let updatedData = await User.findByIdAndUpdate(
                { _id: userId },
                { $inc: { "wallet": 5, "surveys": 1 } },
                { new: true })
            return updatedData
        }
    } catch (err) {
        return err
    }
}

module.exports = router;