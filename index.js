var express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require("./database.js");
app.use(session({ secret: "test123!@#", resave: true, saveUninitialized: true }));
const { ObjectId } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Home Route
app.get("/", (req, res) => {
    let msg = "";
    if (req.session.msg != undefined && req.session.msg != "") {
        msg = req.session.msg;
    }
    res.render("home", { msg: msg });
});

// List Users
app.get("/listuser", async function(req, res) {
    const user = db.collection("User");
    const userList = await user.find().toArray();
    res.render("listuser_view", { userList: userList });
});

// Add User - Form
app.get("/adduser", (req, res) => {
    res.render("adduser_view");
});

// Add User - Submission
app.post("/addUserSubmit", async function(req, res) {
    const user = db.collection("User");
    const result = await user.insertOne({
        name: req.body.name,
        bio: req.body.bio,
        gender: req.body.gender,
        email: req.body.email,
        password: req.body.password,
        createdat: req.body.createdate,
        updatedat: req.body.updatedate,
        Xid: req.body.Xid,
        githubid: req.body.githubid,
        userid: req.body.userid
    });

    if (result.acknowledged === true) {
        req.session.msg = "User added successfully";
        res.redirect("/");
    } else {
        req.session.msg = "Unable to add user";
        res.redirect("/");
    }
});

// Edit User - Form
app.get("/edituser", async function(req, res) {
    const userid = req.query['userid'];
    const userObj = db.collection("User");
    const userData = await userObj.findOne({ _id: new ObjectId(userid) });
    res.render("edituser_view", { userData: userData });
});

// Edit User - Submission
app.post("/editUserSubmit", async function(req, res) {
    const userObj = db.collection("User");
    const updateResult = await userObj.updateOne(
        { _id: new ObjectId(req.body.userid) },
        {
            $set: {
                name: req.body.name,
                bio: req.body.bio,
                gender: req.body.gender,
                email: req.body.email,
                password: req.body.password,
                updatedat: new Date(),
                Xid: req.body.Xid,
                githubid: req.body.githubid
            }
        }
    );

    if (updateResult.modifiedCount == 1)
        req.session.msg = "User updated successfully";
    else
        req.session.msg = "Unable to update user";

    res.redirect("/");
});

// Delete User
app.get("/deluser", async function(req, res) {
    const userObj = db.collection("User");
    const userid = req.query['userid'];
    const result = await userObj.deleteOne({ _id: new ObjectId(userid) });

    if (result.deletedCount == 1)
        req.session.msg = "User deleted successfully";
    else
        req.session.msg = "Unable to delete user";

    res.redirect("/");
});

// Pen Management

app.get("/penhome", (req, res) => {
    let msg = "";
    if (req.session.msg != undefined && req.session.msg != "") {
        msg = req.session.msg;
    }
    res.render("penhome", { msg: msg });
});

// List Pens
app.get("/listPen", async function(req, res) {
    const pen = db.collection("Pens");
    const penList = await pen.find().toArray();
    res.render("listpen_view", { penList: penList });
});

// Add Pen - Form
app.get("/addPen", (req, res) => {
    res.render("addpen_view");
});

// Add Pen - Submission
app.post("/addPenSubmit", async function(req, res) {
    const pen = db.collection("Pens");
    const resultpen = await pen.insertOne({
        penid: req.body.penid,
        userid: req.body.id,
        title: req.body.title,
        htmlcode: req.body.htmlcode,
        csscode: req.body.csscode,
        jscode: req.body.jscode,
        createdat: req.body.createdat,
        updatedat: req.body.updatedat
    });

    if (resultpen.acknowledged === true) {
        req.session.msg = "Pen added successfully";
        res.redirect("/");
    } else {
        req.session.msg = "Unable to add pen";
        res.redirect("/");
    }
});

// Edit Pen - Form
app.get("/editpen", async function(req, res) {
    const penid = req.query['penid'];
    const penObj = db.collection("Pens");
    const penData = await penObj.findOne({ _id: new ObjectId(penid) });
    res.render("editpen_view", { penData: penData });
});

// Edit Pen - Submission
app.post("/editPenSubmit", async function(req, res) {
    const penObj = db.collection("Pens");
    const updatepenResult = await penObj.updateOne(
        { _id: new ObjectId(req.body.penid) },
        {
            $set: {
                penid: req.body.penid,
                userid: req.body.id,
                title: req.body.title,
                htmlcode: req.body.htmlcode,
                csscode: req.body.csscode,
                jscode: req.body.jscode,
                createdat: req.body.createdat,
                updatedat: req.body.updatedat
            }
        }
    );

    if (updatepenResult.modifiedCount == 1)
        req.session.msg = "Pen updated successfully";
    else
        req.session.msg = "Unable to update pen";

    res.redirect("/");
});

// Delete Pen
app.get("/delpen", async function(req, res) {
    const penObj = db.collection("Pens");
    const penid = req.query['penid'];
    const result = await penObj.deleteOne({ _id: new ObjectId(penid) });

    if (result.deletedCount == 1)
        req.session.msg = "Pen deleted successfully";
    else
        req.session.msg = "Unable to delete pen";

    res.redirect("/");
});

// Comments Management

// List Comments
app.get("/listcomments", async function(req, res) {
    const comments = db.collection("Comments");
    const commentsList = await comments.find().toArray();
    res.render("listcomments_view", { commentsList: commentsList });
});

app.get("/addcomments", (req, res) => {
    res.render("addcomments_view");
});

// Add Comment Submission
app.post("/addCommentSubmit", async function(req, res) {
    const comments = db.collection("Comments");
    const resultcomment = await user.insertOne({
        userid: req.body.userid,
        penid: req.body.penid,
        commentid: req.body.commentid,
        commenttext: req.body.commenttext,
        createdat: req.body.createdat,
    });

    if (resultcomment.acknowledged === true) {
        req.session.msg = "Comment added successfully";
        res.redirect("/");
    } else {
        req.session.msg = "Unable to add comment";
        res.redirect("/");
    }
});
// Server Listening on Port 8081
app.listen(8081, () => console.log("CRUD server running at port no. 8081"));
