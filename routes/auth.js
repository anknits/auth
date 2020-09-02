const router = require("express").Router();
const User = require("../models/User");
const { signUpValidation, loginValidation } = require('../validation.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    // validate user input
    const { error } = signUpValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('email already signed up');
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send('username already in use');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        // create and assign jwt
        const token = jwt.sign({ _id: user._id }, process.env.Token_Secret, { expiresIn: "1d" });
        res.header("auth-token", token).status(200).send("Signup successful");
    }
    catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {

    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if user exists
    let user;
    if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('email not registered');
    }
    else if (req.body.username) {
        user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('username not found');
    }
    else {
        return res.status(400).send("email or username is required");
    }

    // validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send("password is incorrect");

    // create and assign jwt
    const token = jwt.sign({ _id: user._id }, process.env.Token_Secret, { expiresIn: "1d" });
    res.header("auth-token", token).status(200).send("Successfully logged in");
});

module.exports = router;