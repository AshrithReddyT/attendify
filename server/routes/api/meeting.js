const axios = require("axios");
const { Router } = require("express");
const Meeting = require("../../models/Meeting");
const { verifyGoogleToken } = require("../../middleware/auth");
const insertEvent = require("../googleCalendar");
const shortid = require("shortid");
const mongoose = require("mongoose");
const router = Router();

router.get("/:eventType", verifyGoogleToken, async (req, res) => {
  try {
    console.log(req.params.eventType);
    const timeObj =
      req.params.eventType === "upcoming"
        ? { $gt: new Date() }
        : { $lt: new Date() };
    console.log(req.user.email);
    const meetingList = await Meeting.find({
      organizer: req.user.email,
      start_time: timeObj,
    });
    if (!meetingList) throw new Error("No Meeting List found");
    res.status(200).json(meetingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/id/:meetingId", verifyGoogleToken, async (req, res) => {
  try {
    console.log(req.params.meetingId);
    const meeting = await Meeting.findById(req.params.meetingId);
    if (!meeting) throw new Error("No Meeting found");
    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//To check if valid meeting_id and passkey

router.get("/:id/:passkey", async (req, res) => {
  const { id, passkey } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid meeting ID" });
  }
  const meeting = await Meeting.findOne({ _id: id, passkey });
  if (!meeting) {
    return res.status(404).json({ message: "Meeting not found" });
  }
  // render the QR code page for the attendee
  res.status(200).json(meeting);
});

router.post("/", verifyGoogleToken, async (req, res) => {
  const passkey = shortid.generate();
  const { name, description, location, start_time, end_time } =
    req.body.meetingDetails;
  const newMeeting = new Meeting({
    name,
    description,
    location,
    start_time,
    end_time,
    organizer: req.user.email, // Set the organizer to the email from verifyGoogleToken
    passkey,
  });
  try {
    const meeting = await newMeeting.save();
    console.log(meeting);
    if (!meeting)
      throw new Error("Something went wrong while saving the Meeting");
    const url = `${process.env.BASE_URL}/api/meetingAttendance`;
    const token = req.headers.authorization.replace(/^Bearer\s/, "");
    var glist = req.body.guestList;
    if (!glist.map((a) => a.label).includes(req.user.email)) {
      glist.push({ id: req.body.guestList.length + 1, label: req.user.email });
    }
    const response = await axios.post(
      url,
      {
        id: meeting._id,
        guestList: glist,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    req.body.meetingDetails.description += `\nPlease use the following link to check in for attendance:\n${process.env.CLIENT_BASE_URL}/attend/${meeting._id}/${passkey}`;
    const ev = await insertEvent(
      req.headers.authorization.replace(/^Bearer\s/, ""),
      { meetingDetails: req.body.meetingDetails, guestList: glist }
    );
    // do something with the response, if needed
    res.status(200).json(ev);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyGoogleToken, async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await Meeting.findByIdAndDelete(id);
    if (!removed) throw Error("Something went wrong ");
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
