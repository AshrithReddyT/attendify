# Attendify
Meeting Scheduler and QR-Based Attendance Management System

> **Abstract:** *Managers often face challenges when scheduling important events and keeping track of the attendance of intended participants. Managers need to use multiple tools to schedule the events, keep track of past and upcoming events, and mark and monitor the attendance of participants, which can be a laborious and tedious process - especially in a fast paced work environment where managers have other important responsibilities. Managers can make light work of scheduling events and attendance management with the help of Attendify. Using the Attendify tool, managers can streamline the process and focus their efforts on other critical aspects of project management.*

![Landing Page of Attendify](media/Homepage.png)

## Table of Contents

- [Introduction](#introduction)
- [Resources](#resources)
- [System Requirements](#system-requirements)
- [Instructions](#instructions)
- [Behaviour of System](#behaviour-of-system)
- [Tests](#tests)
- [Project Management](#project-management)
- [Group Members](#group-members---tu-beer-hai-bc)
- [Acknowledgements](#acknowledgements)

**Note** that all links in this README file are restricted to members of our organization and can only be accessed using a VT Gmail account. If you are not a member of our organization, please contact the project owner for more information.

## Introduction

With Attendify, you can authenticate with your Google account and create, schedule, and manage meetings. You can also view attendance reports and generate QR codes for meetings to mark attendance using a scanner.

## Resources

All the project resources are available via the following links:

- Final Report: https://docs.google.com/document/d/1WNbGnyOhYkB4DZ2wDtqtbWE1aar-QIJG/edit?usp=sharing&ouid=118022308042279892080&rtpof=true&sd=true
- Project Proposal: https://docs.google.com/document/d/1MaMyX2X64olSS5EgwjoqH3ooD8pjPqNY/edit?usp=sharing&ouid=118022308042279892080&rtpof=true&sd=true
- Code: https://github.com/samarkansal/attendify

## System Requirements

To run Attendify on your local machine, you need to have the following software installed:

- Node.js v14 or later


## Instructions

- Step 1: Ensure that you have Node.js installed on your computer. You can check whether it's installed by running the following command:
```
node -v
```

- Step 2: Clone the Attendify repository to your local machine using the following command:
```
git clone https://github.com/samarkansal/attendify.git
```

- Step 3: Navigate to the root directory of the project using the following command:
```
cd attendify
```

- Step 4: Make the start.sh file executable by running the following command:
```
chmod +x start.sh
```

- Step 5: Run the start.sh file using the following command:
```
./start.sh
```
This will install the necessary node packages for the client and server, and start both the node server and CLI server on different ports.

**Expected output:**

<img width="1153" alt="Screenshot 2023-05-06 at 12 15 45 PM" src="https://user-images.githubusercontent.com/51323046/236635325-26164e1f-2ad9-404b-a691-6b6f701dd5cd.png">

**Note**: Make sure that the client starts on port 5173 and the server starts on port 3000. This is important because the web app uses static URLs for both the client and server, and changing the ports will break the app.

## Behaviour of System

**USE-CASE 1**
- *Authenticate with Google account*
</br>**Note**: As this app is not published and is currently using a free version of the Google API, only the project members and the following test users can log in to the web app: [dcbrown@vt.edu, smgruber@vt.edu]. 
If you are not a test user, you will not be able to log in at this time.

  Once the system (Server and Client) is up and running...

  step 1: Open this link: http://localhost:5173/ in a browser.

  step 2: Click on the "Sign in with Google" button on the homepage to authenticate yourself with your Google account.

  step 3: If successful, you will be redirected to your dashboard.
  
**USE-CASE 2**
- *View meetings on dashboard*

  Once you are authenticated and on the dashboard...

  step 1: By default, the "Upcoming events" tab will be selected. You can click on the "Past Events" tab to view your previous meetings.

  step 2: Each meeting will be displayed in a card-shaped component that includes the topic, description, duration, and start time.
<p align="center">
 <img width="700" alt="Attendify Dashboard page" src="https://user-images.githubusercontent.com/51323046/236640677-63245d24-e36d-428d-8c3d-3debb0a99039.png">
</p>

  
**USE-CASE 3**
- *Create a new meeting*

  Once you are authenticated and on the dashboard...

  step 1: Click on the "Create New Event" button.

  step 2: Fill in the meeting details, including the topic, description, duration, start time, and guest list.

  step 3: Click the "Send Invite" button to schedule a Google Calendar event and invite attendees.

  step 4: If successful, you will receive notifications and the new meeting will be displayed in a card on your dashboard.
  
**USE-CASE 4**
- *View attendance report*

  Once you are authenticated and on the dashboard...

  step 1: Click on a meeting card to view the meeting details.

  step 2: Click on the "Download Report" button to download a list of attendees and their attendance status in a CSV format.

<p align="center">
 <img width="700" alt="Meeting details and attendance report" src="https://user-images.githubusercontent.com/51323046/236640791-014f2ab3-171b-46cf-a2a0-f2cb877affce.png">
</p>

  
**USE-CASE 5**
- *Open meeting attendance scanner*

  Once you are authenticated and on the dashboard...

  step 1: Click on any meeting card's 'Attendance scanner' button.

  step 2: Scan the QR code generated by the user using the meeting link provided in the event invite through the scanner.


Please find the recorded demo below, which covers the instructions for running the application as well as the test cases and the entire workflow.
[Attendify Project Demo](https://www.youtube.com/watch?v=KfypQMR2_yM)
[Attendify Project Demo Full (Need Drive Access)](https://drive.google.com/file/d/11GLv5hjsEOnj8PXZeDI6-zp9rW5TH4-q/view?usp=sharing)

## Tests

### White-Box Testing:
We have provided two unit test files to test the functionality of the server, including verifying the status of the server and API endpoints.

#### Running tests

  To run the tests, first make sure you have installed all the necessary dependencies in ./server by running:
```
npm install
```
#### Server Up and Running Test
This test checks whether the server is up and running and verifies the authentication for a particular QR code route. It uses supertest and can be executed by running the following command in the ./server directory:
```
npm test
```
Make sure the server is not running elsewhere while running this test.

#### Meeting API Verification Test
- This test verifies the meeting API by scheduling a meeting and verifying the details and guest list. It requires the server to be up and running. To run this test, first start the server by running in ./server directory:
```
npm run dev
```
- Then, in a separate terminal window, execute the following command in the ./server directory:
```
node verifyMeetingApi.js
```
It will prompt the user to log in by following the link in the console and copying the authentication code from the browser to the terminal. Once authenticated, it will make an API call to the meeting route and verify the details and guest list.

**Expected output**

<img width="1161" alt="Screenshot 2023-05-06 at 2 28 04 PM" src="https://user-images.githubusercontent.com/51323046/236640964-960cde5a-79bd-4d42-b2d3-d0ce14ed6842.png">


### Black-Box Testing
For black-box testing, we have prepared a [Google Doc](https://docs.google.com/document/d/1ejciWs6uoQeBqav2OCV5QhSZ5HbDgNpmaaeTluKQisU/edit?usp=sharing) that outlines the functional requirements and expected behavior of the application. We recommend testing the application against these requirements to ensure that all features are working as expected from a user's perspective.


## Project Management

We use Jira to track the progress of our project according to the software engineering process.</br>
You can view our Jira board at the following link: 
  [Jira Board](https://tu-beer-hai-bc.atlassian.net/jira/software/projects/ATT/boards/1)

If you do not have access to our Jira board, please contact the project owner for more information.

The Jira board contains a list of user stories, tasks, and bugs, and their corresponding statuses. We use it to prioritize and manage our work, and to ensure that we are meeting our project milestones.

Feel free to browse our Jira board to get an idea of our progress and to view the tasks that we are currently working on.


## Group Members - Tu Beer hai, BC
The following are the members of our project team:

- Samar Kansal (Github: [samarkansal](https://github.com/samarkansal))</br> VT ID: samarkansal
- Shankar Srinidhi Srinivas (Github: [shankarsrinidhi](https://github.com/shankarsrinidhi))</br> VT ID: shankarsrinidhi
- Ashrith Reddy Thukkaraju (Github: [AshrithReddyT](https://github.com/AshrithReddyT))</br> VT ID: ashrithreddyt
- Amith Reddy Nalla Venkat (Github: [amith2233](https://github.com/amith2233))</br> VT ID: amithreddy

Please feel free to contact any of our team members if you have any questions or concerns about our project.

## Acknowledgements

We sincerely thank Dr. Chris Brown for giving us an opportunity to learn and expand our knowledge about various Software Engineering processes through this project.
