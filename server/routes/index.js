const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc    Login/Landing page
// @route   GET /
router.get("/", async (req, res) => {
  try {
    // const todoList = await Todo.find();
    // if (!todoList) throw new Error("No Todo List found");
    res.status(200).json({ todoList: "1234" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // @desc    Dashboard
// // @route   GET /dashboard
// router.get("/dashboard", ensureAuth, async (req, res) => {
//   try {
//     const stories = await Story.find({ user: req.user.id }).lean();
//     res.render("dashboard", {
//       name: req.user.firstName,
//       stories,
//     });
//   } catch (err) {
//     console.error(err);
//     res.render("error/500");
//   }
// // });

module.exports = router;
