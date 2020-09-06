const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require('./routes/auth');

mongoose.connect(process.env.mongodbConnectionString, {
    useNewUrlParser: true, useUnifiedTopology: true
}, err => {
    if (err) {
        console.error('Failed to Establish Connection with MongoDB. Error: ' + err);
    }
});

app.use(express.json());
app.use('/api', authRoute);

app.listen(process.env.PORT || 5000, () => { console.log("Server up and running") });