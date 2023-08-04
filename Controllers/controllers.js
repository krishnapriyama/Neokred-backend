const bcrypt = require("bcrypt");
const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const data = req.body;
    const user = await userModel.create(data);
    res.json({ user: user._id, created: true });
  } catch (err) {
    console.log(err, "Error from server,register");
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};


module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          const fullName = user.fullname;
          const token = jwt.sign({ email }, "SuperSecretKey", { expiresIn: '5m' }); 
          res.json({ created: true, token, fullName });
        } else {
          res.json({ error: "Invalid email or password" });
        }
      });
    } else {
      res.json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};


module.exports.userDetails = async (req, res, next) => {
  const { email } = req.user;
  const user = await userModel.findOne({ email });
  console.log(user);
  res.json(user);
};
