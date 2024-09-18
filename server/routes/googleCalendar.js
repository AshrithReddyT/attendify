const { google } = require("googleapis");
const oAuth2Client = require("../config/google");

const insertEvent = async (jwtToken, { meetingDetails, guestList }) => {
  console.log(jwtToken);
  oAuth2Client.setCredentials({
    access_token: jwtToken,
  });
  console.log(meetingDetails);
  const attendeesList = guestList.map((guest) => ({
    email: guest.label,
  }));

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const event = {
    summary: meetingDetails.name,
    description: meetingDetails.description,
    location: meetingDetails.location,
    start: {
      dateTime: meetingDetails.start_time,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: meetingDetails.end_time,
      timeZone: "America/Los_Angeles",
    },
    attendees: attendeesList,
    reminders: {
      useDefault: true,
    },
  };

  try {
    const { data } = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendNotifications: true,
    });
    console.log("meetingData", data);
    console.log(`Event created: ${data.htmlLink}`);
    return data;
    // return "event-sim";
    // console.log("event");
  } catch (error) {
    console.error(`Error creating event: ${error}`);
    throw error;
  }
};

module.exports = insertEvent;
