const router = require("express").Router();
const Surveys = require("../model/surveyModel");
const { verify } = require("./verifyToken");
const User = require("../model/userModel");

router.post("/admin/add", verify, async (req, res) => {
    const { isAdmin } = await User.findById({ _id: req.user._id })
    try {
        if (isAdmin) {
            const { title, description, district, gender, questions } =
                req.body.data;
            const survey = new Surveys({
                title,
                description,
                district,
                gender,
                questions,
            });
            const newSurvey = await survey.save();
            res.status(200).json({ message: "Survey Added", id: newSurvey._id });
        } else {
            res.status(400).json({ message: "User not Authorised" })
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

//Get survey all by admin or the surveys by district for user
router.get("/fetch", verify, async (req, res) => {
    try {
        let surveyDetails = [];
        const user = await User.findOne({ _id: req.user._id });

        if (user.isAdmin) {
            surveyDetails = await Surveys.find({}).sort({ createdAt: -1 });
        } else {
            surveyDetails = await Surveys.find({
                $and: [
                    { $or: [{ district: user.district }, { district: "All" }] },
                    { isAcceptingResponse: true },
                ],
            }).sort({ createdAt: -1 });
        }

        surveyDetails.length === 0
            ? res.status(200).json({ message: "No Records Found" })
            : res.json(surveyDetails);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Get Survey by ID
router.get("/:surveyId", verify, async (req, res) => {
    try {
        const surveyDetails = await Surveys.findById(req.params.surveyId);
        res.json(surveyDetails);
    } catch (err) {
        res.json(err);
    }
});


module.exports = router;
