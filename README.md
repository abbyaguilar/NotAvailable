# NotAvailable Chrome Extension

Overview

The NotAvailable Chrome Extension is a web browser extension designed to monitor user screentime and provide incentives for reducing time spent on specific URLs. The extension is part of the NotAvailable project, aiming to promote healthier digital habits through gamification and rewards.

Features

Screentime Monitoring: Tracks user activity, including visited URLs and time spent on each URL.
Popup Interface: Displays a popup with insights into the top URLs visited during the current week and a comparison with the previous week.
Gamification and Incentives: Calculates screentime reduction, generates coupon codes as rewards, and provides feedback to encourage users.
Server Communication: Sends user activity data to a server for further analysis.
Deals Display: Shows predefined deals in the popup to incentivize users further.


Installation

Clone the repository:

  git clone https://github.com/abbyaguilar/NotAvailable.git
  
Open Google Chrome and go to chrome://extensions/.

Enable "Developer mode" in the top right.

Click "Load unpacked" and select the directory where the extension code is located.


Usage

Once installed, click on the extension icon in the Chrome toolbar to open the popup interface.

The popup displays the top URLs visited during the current week, along with the time spent on each URL.

Receive feedback and rewards based on your screentime reduction achievements.

Server Integration

The extension communicates with a server running on http://localhost:19008/user-activity. Ensure that the server is running and can handle POST requests from the extension.

Dependencies

Axios: Used for making HTTP requests.

