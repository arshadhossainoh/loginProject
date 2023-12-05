const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredPassword.trim() < 6 ||
    enteredEmail !== enteredConfirmEmail ||
    !enteredEmail.includes("@")
  ) {
    console.log("Incorrect data");
    return res.redirect("/signup");
  }

  // check whether the user/email already exists
  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (existingUser) {
    console.log("User already exists");
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,
  };
  await db.getDb().collection("users").insertOne(user);
  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  if (!existingUser) {
    console.log("oops, could not log you in");
    return res.redirect("/login");
  }
  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );
  if (!passwordsAreEqual) {
    console.log("oops, could not log you in-passwords dont match");
    return res.redirect("/login");
  }

  req.session.user = { id: existingUser._Id, email: existingUser.email };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/admin");
  });
});

router.get("/admin", function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401");
  }
  res.render("admin");
});

router.post("/logout", function (req, res) {});

module.exports = router;
