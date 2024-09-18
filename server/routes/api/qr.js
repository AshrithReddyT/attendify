const { Router } = require("express");
const MeetingAttendance = require("../../models/MeetingAttendance");
const { verifyGoogleToken } = require("../../middleware/auth");
const qrCodeReader = require("qrcode-reader");
var QRCode = require("qrcode");
const Jimp = require("jimp");

const router = Router();

router.post("/generateQR", verifyGoogleToken, async (req, res, next) => {
  const meetingId = req.body.meetingId;
  const userId = req.user.email;
  const expirationTime = new Date().getTime() + 30000; // 40 seconds from now

  const inputString = `${meetingId},${userId},${expirationTime}`;

  try {
    const code = await QRCode.toDataURL("inputString", { version: 1 });
    const strc = await QRCode.toString(inputString);
    // Printing the code
    // console.log(strc);

    const meetingAttendance = await MeetingAttendance.findOne({
      meeting_id: meetingId,
      user_id: userId,
    });

    if (meetingAttendance) {
      meetingAttendance.qr_code = inputString;
      meetingAttendance.save();
      res.status(200).json(inputString);
    } else {
      res.status(400).json({ message: "Not a valid meeting or user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verifyQR", async (req, res, next) => {
  const qrCode = req.body.qrCode;

  try {
    const meetingAttendance = await MeetingAttendance.findOne({
      qr_code: qrCode,
    });
    if (!meetingAttendance) {
      return res.status(400).json({ message: "Invalid QR code" });
    }

    const currentTime = new Date().getTime();
    const expirationTime = parseInt(qrCode.split(",")[2]);
    if (currentTime > expirationTime) {
      return res.status(400).json({ message: "QR code has expired" });
    }

    // Update attendance status
    meetingAttendance.attended = true;
    await meetingAttendance.save();

    res.status(200).json({ message: "QR code verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get("/url", (req, res, next) => {
//   res.json(["Tony","Lisa","Michael","Ginger","Food"]);
//  });

// router.get("/scanQR", (req, res, next) => {
//   const buffer = fs.readFileSync("./file.png");

//   // __ Parse the image using Jimp.read() __ \\
//   Jimp.read(buffer, function (err, image) {
//     if (err) {
//       console.error(err);
//     }
//     // __ Creating an instance of qrcode-reader __ \\

//     const qrCodeInstance = new qrCodeReader();

//     qrCodeInstance.callback = function (err, value) {
//       if (err) {
//         console.error(err);
//       }
//       // __ Printing the decrypted value __ \\
//       console.log(value.result);
//       res.send(value.result);
//     };

//     // __ Decoding the QR code __ \\
//     qrCodeInstance.decode(image.bitmap);
//   });
// });

module.exports = router;
