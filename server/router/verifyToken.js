const jwt = require("jsonwebtoken");

function createToken(userId) {

    try {
     
      const token = jwt.sign({ _id: userId }, process.env.TOKEN_SECRET,{ expiresIn: '1800s' });
      return token
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };

  
function verify(req, res, next) {
const token = req.headers['authorisation']
  if (!token) return res.status(403).send("Access Denied");

  try {
   
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};


module.exports = {
  createToken,
  verify
}