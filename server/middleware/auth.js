const oAuth2Client = require("../config/google");
module.exports = {
  verifyGoogleToken: async function (req, res, next) {
    const token = req.headers.authorization.replace(/^Bearer\s/, "");
    try {
      const resp = await oAuth2Client.getTokenInfo(token);
      if (!resp || !resp.email_verified) {
        return res.status(401).json({ msg: "Token is not valid" });
      }
      req.user = {
        email: resp.email,
        name: resp.name,
        picture: resp.picture,
      };
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: "Token is not valid" });
    }
  },
};
