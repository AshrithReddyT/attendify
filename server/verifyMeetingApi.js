const axios = require("axios");
const readlineSync = require("readline-sync");
const { google } = require("googleapis");
const oAuth2Client = require("./config/google");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

async function runTests() {
  // Prompt user to sign in and authorize access
  const redirectUri = "http://localhost:3000";
  const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectUri);
  console.log(process.env.GOOGLE_OAUTH_CLIENT_ID);
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  const reset = "\x1b[0m";
  const yellowBg = "\x1b[43m";
  const blackFg = "\x1b[30m";
  const lightBlueFg = "\x1b[94m";
  console.log(
    `\n\n${yellowBg}${blackFg}Authorize this app by visiting this url:${reset} ${lightBlueFg}${authUrl}${reset}\n\n`
  );

  const code = readlineSync.question("Enter the code from that page here: ");
  const { tokens } = await oAuth2Client.getToken(code);
  // Run the test with the authorized token
  const token = tokens.access_token;
  const url = "http://localhost:3000/api/meeting";
  const startDateTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // One day from now
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // One hour after start time
  const meetingDetails = {
    name: "Test Meeting: Unit Test",
    description: "This is a test meeting from server unit test",
    location: "Virtual",
    start_time: startDateTime,
    end_time: endDateTime,
  };

  const guestList = [
    { id: 1, label: "sameerkansal27@gmail.com" },
    { id: 2, label: "samarkansal@vt.edu" },
  ];

  try {
    console.log("\n\nStarting server unit test...");
    const response = await axios.post(
      url,
      {
        meetingDetails,
        guestList,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("\n****Meeting created successfully!****");

    // Verify meeting details
    const returnedMeetingDetails = response.data;
    console.log(
      `\n\nVerifying title of the event....\nExpected: ${meetingDetails.name}\n Actual: ${returnedMeetingDetails.summary}`
    );
    console.assert(
      returnedMeetingDetails.summary === meetingDetails.name,
      "Meeting name is incorrect"
    );
    console.log("Verified successfully");
    console.log(
      `\n\nVerifying description of the event....\nExpected: ${meetingDetails.description}\nActual: ${returnedMeetingDetails.description}`
    );
    console.assert(
      returnedMeetingDetails.description.indexOf(meetingDetails.description) >=
        0,
      "Meeting description is incorrect"
    );
    console.log("Verified successfully");
    console.log(
      `\n\nVerifying location of the event...\nExpected: ${meetingDetails.location}\nActual: ${returnedMeetingDetails.location}`
    );
    console.assert(
      returnedMeetingDetails.location === meetingDetails.location,
      "Meeting location is incorrect"
    );
    console.log("Verified successfully");
    console.log("\n****All meeting details verified successfully!****");

    // Verify guest list
    const returnedGuestList = response.data.attendees.sort((a, b) =>
      a.email.localeCompare(b.email)
    );
    console.log(
      `\n\nVerifying number of guests in the event....\nExpected: ${guestList.length}\nActual: ${returnedGuestList.length}`
    );
    console.assert(
      returnedGuestList.length === guestList.length,
      "Number of guests is incorrect"
    );
    console.log("Verified successfully");
    // Verify that the guest list was saved correctly
    console.log(`\n\nVerifying guest list details....`);
    const sortedGuestList = guestList.sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    console.assert(
      sortedGuestList[0].label === returnedGuestList[0].email,
      "Guest email is incorrect"
    );
    console.assert(
      sortedGuestList[1].label === returnedGuestList[1].email,
      "Guest email is incorrect"
    );
    console.log("\n****Guest list verified successfully!****\n");
  } catch (error) {
    console.error("Tests failed:", error);
  }
}

runTests();
