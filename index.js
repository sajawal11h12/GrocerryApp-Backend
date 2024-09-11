const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const Schema = mongoose.Schema;

const mongoUrl = "mongodb+srv://mrsajawal20:pakistan@reactapp.ejttiqw.mongodb.net/?retryWrites=true&w=majority&appName=reactapp";
jwt_secret="12344321"
mongoose.connect(mongoUrl)
    .then(() => {
        console.log("database connected");
    })
    .catch((e) => {
        console.error("Error connecting to database:", e);
    });

require("./userdetail");

const User = mongoose.model("Userinfo");

app.get("/", (req, res) => {
    res.send({ status: "started" });
});

app.post("/signup", async (req, res) => {
    
    const { name, email, phone, password } = req.body;
    try {
        const oldUser = await User.findOne({ email: email });
        if (oldUser) {
            return res.send({ data: "User already exists" });
        }
        const encryptedpassword=await bcrypt.hash(password,10)
        await User.create({
            name: name,
            email: email,
            phone: phone,
            password: encryptedpassword,
        });
        res.send({ status: "ok", data: "user created" });
    } catch (e) {
        console.error("Error creating user:", e);
        res.send({ status: "error", data: e.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.send({ error: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.send({ error: "Incorrect password" });
    }

    const token = jwt.sign({ email: user.email }, jwt_secret);
    return res.send({ status: "ok", data: token });
});


app.listen(5001, () => {
    console.log("running");
});
