const express = require("express");
const passport = require("passport");
const router = express.Router();
const oAuth2Client = require("../config/google");

// @desc    Auth with Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
});

router.post("/google", async (req, res) => {
  try {
    const authCode = req.body.code;
    const { tokens } = await oAuth2Client.getToken(authCode);

    // Verify the token
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userProfile = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // Return token and user profile
    res.status(200).json({ tokens, userProfile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
