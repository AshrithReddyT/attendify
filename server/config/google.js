const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

const oAuth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  process.env.GOOGLE_OAUTH_REDIRECT_URL
);

module.exports = oAuth2Client;
