<script setup>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";
import router from "../router";
import axios from "axios";
import { getUserEmail } from "../utils/userDetail";

const fromDate = ref(new Date());
const toDate = ref(new Date());
const location = ref("Surge Space building");
const topic = ref("Meeting standup: " + new Date());
const desc = ref("Meeting standup desc: " + new Date());

const guests = ref([{ id: 1, label: getUserEmail() }]);
const newGuest = ref("");
const saveGuest = (event) => {
  guests.value.push({
    id: guests.value.length + 1,
    label: newGuest.value,
  });
  newGuest.value = "";
  event.preventDefault();
};

const sendInvite = async (event) => {
  const meetingObj = {
    meetingDetails: {
      name: topic.value,
      description: desc.value,
      location: location.value,
      start_time: fromDate.value,
      end_time: toDate.value,
      organizer: getUserEmail(),
    },
    guestList: guests.value,
  };

  const url = "http://localhost:3000/api/meeting";
  try {
    const response = await axios.post(url, meetingObj, {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("tokens")).access_token
        }`,
      },
    });
    console.log(response.data);

    await router.push("/dashboard");
    // do something with the response, if needed
  } catch (error) {
    console.error(error);
    // handle the error, if needed
  }
  console.log(meetingObj);
  //   event.preventDefault();
  //   router.push("./dashboard");
};
</script>

<style scoped>
.bg-hero {
  position: relative;
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 85vh;
  background-image: url("/site-images/event-hero.jpeg");
}

.dark-overlay {
  height: 100%;
  width: 100%;
  min-height: 850px;
  top: 0;
  left: 0;
  background-color: rgba(12, 12, 12, 0.861);
}

.primary-button-event {
  font-size: 1.4rem;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #005ab6;
  border-radius: 6px;
  color: #fff;
  border: none;
  padding: 10px;
  font-weight: 500;
  font-family: BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
}

.primary-button-event:hover {
  background-color: #0069d2;
  cursor: pointer;
  font-weight: 510;
}

.secondary-button {
  height: fit-content;
  font-size: 1rem;
  background-color: #f3f3f3;
  border-radius: 8px;
  color: #005ab6;
  border: 2.5px solid;
  border-color: #005ab6;
  padding: 8px;
  font-weight: 500;
  font-family: BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
}
.secondary-button:hover {
  background-color: #ffffff;
  cursor: pointer;
  font-weight: 520;
  color: #032a51;
}

.event-container {
  padding: 160px 70px 0px 70px;
  height: 100%;
  font-size: larger;
  font-weight: bold;
  color: rgb(226, 226, 226);
  /* background-color: rgb(35, 35, 35); */
}

.form-group {
  margin: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.form-group label {
  margin-top: 1.3rem;
  float: top;
  color: rgb(196, 196, 196);
}

.form-group input,
textarea {
  margin: 0.5rem 0 1rem 0;
  color: rgb(52, 52, 52);
  border-radius: 4px;
  padding: 10px;
  background-color: rgb(225, 225, 225);
}

.required {
  color: red;
  margin-left: 5px;
}

.date-picker {
  width: 250px;
}
.range-picker {
  display: flex;
  flex-direction: row;
  column-gap: 2rem;
}
#topic {
  font-size: 1.5rem;
  padding: 10px;
  width: 500px;
}

#topic::placeholder {
  color: rgb(195, 195, 195);
}

#desc {
  font-size: 1rem;
}

#location {
  font-size: 1rem;
  width: 400px;
}
#guest {
  font-size: 1rem;
  margin-top: 0;
  width: 20rem;
  border: none;
}

.guest-details {
  position: relative;
  width: 40%;
}

.guest-input {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.guest-list {
  margin-top: 1rem;
}

.contact-img {
  border-radius: 50%;
  border: 1px solid;
  width: 23px;
  height: 23px;
  padding-left: 5px;
  padding-top: 1px;
  justify-self: center;
  font-size: 0.9rem;
}

.from-date input {
  padding: 5px 40px;
}

.to-date input {
  padding: 5px 40px;
}

.guest-list > li {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  font-size: 1rem;
  margin-top: 6px;
}
h1 {
  color: rgb(211, 211, 211);
}
</style>

<template>
  <section class="bg-hero">
    <div class="dark-overlay">
      <div class="event-container">
        <h1>Schedule Meeting</h1>
        <form class="form-group" @submit.prevent="sendInvite">
          <div class="meeting-details">
            <label for="topic">Topic<span class="required">*</span></label
            ><br />
            <input
              v-model="topic"
              type="text"
              id="topic"
              name="topic"
              placeholder="Daily Standup..."
              required
            /><br />
            <div class="range-picker">
              <div class="from-date">
                <label for="lname">From:<span class="required">*</span></label
                ><br />
                <Datepicker
                  class="date-picker"
                  :min-date="new Date()"
                  :is-24="false"
                  v-model="fromDate"
                  required
                />
              </div>
              <div class="to-date">
                <label for="lname">To:<span class="required">*</span></label
                ><br />
                <Datepicker
                  class="date-picker"
                  :min-date="fromDate"
                  :is-24="false"
                  v-model="toDate"
                  required
                />
              </div>
            </div>
            <label for="location">Location<span class="required">*</span></label
            ><br />
            <input
              type="text"
              id="location"
              name="location"
              required
              v-model="location"
            /><br />
            <label for="desc">Description</label><br />
            <textarea v-model="desc" id="desc" name="desc" cols="51"> </textarea><br />
          </div>
          <div class="guest-details">
            <h2>Guests</h2>
            <div class="guest-input">
              <input
                type="email"
                id="guest"
                name="guest"
                placeholder="Add guest"
                v-model.trim="newGuest"
              /><br />
              <button class="secondary-button" @click="saveGuest">Save Guest</button>
            </div>
            <ul class="guest-list">
              <li v-for="(guest, index) in guests" :key="guest.id">
                <div class="contact-img">{{ guest.label[0].toUpperCase() }}</div>
                {{ guest.label }}<span v-if="index == 0"> (Host)</span>
              </li>
            </ul>
            <button class="primary-button-event">
              Send invite <i class="fab fa-telegram-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
