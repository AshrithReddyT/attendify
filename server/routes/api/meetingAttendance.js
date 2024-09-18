const { Router } = require("express");
const MeetingAttendance = require("../../models/MeetingAttendance");
const { verifyGoogleToken } = require("../../middleware/auth");
const mongoose = require("mongoose");

const router = Router();

router.get("/:meetingId", async (req, res) => {
  try {
    const meetingId = req.params.meetingId;
    console.log(meetingId);
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      throw new Error("Invalid Meeting ID");
    }
    const meetingAttendanceList = await MeetingAttendance.find({
      meeting_id: meetingId,
    });
    if (!meetingAttendanceList) throw new Error("No Meeting List found");
    res.status(200).json(meetingAttendanceList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", verifyGoogleToken, async (req, res) => {
  try {
    console.log(req.body.guestList);
    let meetingAttendances = [];
    for (var i = 0; i < req.body.guestList.length; i++) {
      console.log(req.body.guestList[i].label);
      meetingAttendances.push({
        meeting_id: req.body.id,
        user_id: req.body.guestList[i].label,
        attended: false,
        qr_code: "",
      });
    }
    console.log(meetingAttendances);
    //const newMeeting = new MeetingAttendance(req.body.meetingDetails);

    const result = await MeetingAttendance.insertMany(meetingAttendances);
    console.log(result);
    if (!result)
      throw new Error(
        "Something went wrong while saving the Meeting Attendance"
      );
    console.log(`${result.length} documents were inserted`);
    // do something with the response, if needed
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const removed = await Attendance.findByIdAndDelete(id);
    if (!removed) throw Error("Something went wrong ");
    res.status(200).json(removed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
