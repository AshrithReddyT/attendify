<template>
  <section class="att-hero">
    <div class="att-dark-overlay">
      <div class="attendance-container">
        <h1>Meeting Details</h1>
        <h3><b>Topic:</b> {{ meeting.name }}</h3>
        <h3><b>Description:</b> {{ meeting.description }}</h3>
        <h3><b>When:</b> {{ formatDateTime(meeting.start_time) }}<br /></h3>
        <h3>
          <b>Duration:</b>
          {{ getMeetingMinutes(meeting.start_time, meeting.end_time) }} minutes
        </h3>
        <div class="action-container">
          <button class="download-button" @click="downloadCSVData">
            <i class="fas fa-solid fa-download"></i>&nbsp;Download Report
          </button>
          <button class="refresh-list" @click="refreshData">
            <i class="fas fa-sync-alt"></i>&nbsp;Refresh
          </button>
          <div class="data-container">
            <ul class="attendance-table">
              <li class="table-header">
                <div>User ID</div>
                <div>Attended</div>
              </li>
              <li
                class="table-row"
                v-for="attendance in meetingAttendanceList"
                :key="attendance.id"
              >
                <div>{{ attendance.user_id }}</div>
                <div>{{ attendance.attended }}</div>
              </li>
            </ul>

            <div class="canvas-cont"><canvas id="attendance-chart"></canvas></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
h3 {
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 1.4rem;
  max-width: 60%;
  padding-left: 10px;
  color: rgb(245, 245, 245);
}

.action-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: -90px;
}
.attendance-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.attendance-table {
  flex-direction: column;
  display: flex;
  padding: 0;
  list-style: none;
  width: 45%;
}

.table-row {
  font-size: 1.2rem;
  padding: 10px;
  padding-bottom: 2px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}

.table-header {
  font-size: 1.4rem;
  font-weight: bold;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
}
h1 {
  color: rgb(242, 242, 242);
  margin-bottom: 20px;
}
.att-hero {
  position: relative;
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: fit-content;
  background-image: url("/site-images/attendance-hero.jpeg");
}

.att-dark-overlay {
  height: 100%;
  width: 100%;
  min-height: 650px;
  top: 0;
  left: 0;
  background-color: rgba(8, 8, 8, 0.727);
}

.data-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: rgba(0, 0, 0, 0.724);
  padding: 1rem 2rem 2rem 2rem;
  border-radius: 12px;
  width: 100%;
}

.canvas-cont {
  margin-top: 10px;
  height: 300px;
}

.attendance-container {
  padding: 120px 100px;
  color: rgb(228, 228, 228);
}

.refresh-list {
  width: 150px;
  border: none;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 4px;
  background-color: rgb(78, 51, 255);
  color: rgb(237, 237, 237);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 30px 10px;
  font-weight: 550;
}

.download-button {
  width: 250px;
  border: none;
  padding: 10px 20px;
  font-size: 20px;
  border-radius: 4px;
  background-color: rgb(28, 126, 4);
  color: rgb(237, 237, 237);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  font-weight: 550;
  margin-top: -30px;
}

.download-button:hover {
  background-color: rgb(97, 73, 255);
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-weight: 700;
}

.refresh-list:hover {
  background-color: rgb(97, 73, 255);
  cursor: pointer;
  color: rgb(255, 255, 255);
  font-weight: 700;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      meetingId: null,
      meetingAttendanceList: [],
      meeting: {},
    };
  },
  created() {
    this.meetingId = this.$route.params.meetingId;
    console.log(this.meetingId);
    this.refreshData();
  },
  methods: {
    async downloadCSVData() {
      try {
        let csv = "Meeting ID, User ID, attended\n";
        console.log(csv);
        this.meetingAttendanceList.forEach((row) => {
          let r = [row["meeting_id"], row["user_id"], row["attended"]];
          csv += r.join(",");
          csv += "\n";
        });
        const anchor = document.createElement("a");
        anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        anchor.target = "_blank";
        anchor.download = this.meetingId + "_attendance_report.csv";
        anchor.click();
      } catch (error) {
        console.log(error);
      }
    },

    async refreshData() {
      try {
        const meetingId = this.meetingId;
        const responseMeeting = await axios.get(
          `http://localhost:3000/api/meeting/id/${meetingId}`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("tokens")).access_token
              }`,
            },
          }
        );
        this.meeting = responseMeeting.data;

        const responseAttendance = await axios.get(
          `http://localhost:3000/api/meetingAttendance/${meetingId}`,
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("tokens")).access_token
              }`,
            },
          }
        );
        this.meetingAttendanceList = responseAttendance.data;

        this.createChart();
      } catch (error) {
        console.error(error);
      }
    },

    createChart() {
      const canvasElement = document.getElementById("attendance-chart");

      // Check if there is an existing Chart instance
      if (canvasElement.chart) {
        canvasElement.chart.destroy(); // Destroy the existing Chart instance
      }
      const ctx = canvasElement.getContext("2d");
      const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Attended", "Not Attended"],
          datasets: [
            {
              label: "Attendance",
              data: [this.attendancePercentage, 100 - this.attendancePercentage],
              backgroundColor: ["#0000e6", "#e6e6ff"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            position: "right",
          },
          centerText: {
            display: true,
            text: this.attendancePercentage + "% attended",
            color: "#ffffff",
            fontStyle: "bold",
            fontSize: 18,
          },
        },
      });
      canvasElement.chart = chart;
    },

    getMeetingMinutes(startTime, endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationInMinutes = Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60)
      );
      return durationInMinutes;
    },

    formatDateTime(input) {
      const date = new Date(input);
      const formattedDate = date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const formattedTime = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const formattedDateTime = `${formattedDate} ${formattedTime}`;
      return formattedDateTime;
    },
  },

  computed: {
    attendancePercentage() {
      const numAttendees = this.meetingAttendanceList.filter(
        (attendance) => attendance.attended
      ).length;
      const totalAttendees = this.meetingAttendanceList.length;
      return Math.round((numAttendees / totalAttendees) * 100);
    },
  },
};
</script>
