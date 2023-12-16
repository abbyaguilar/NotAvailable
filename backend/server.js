const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 19008;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://abigails:4b2O4xynAbxphZeU@userdata.aqhpfpu.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const userActivitySchema = new mongoose.Schema({
    activityData: {
        currentWeekData: Array,
        previousWeekData: Array,
    },
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

app.post('/user-activity', async (req, res) => {
    try {
        const { currentWeekData, previousWeekData } = req.body;
        console.log('Received data:', currentWeekData, previousWeekData);

        // Perform calculations to determine the amount of time spent for the current week
        const currentWeekAverage = calculateAverageTime(currentWeekData);
        console.log('Current week average:', currentWeekAverage);

        // Perform calculations to determine the amount of time spent for the previous week
        const previousWeekAverage = calculateAverageTime(previousWeekData);
        console.log('Previous week average:', previousWeekAverage);

        // Prepare the data to send to home.js
        const dataToSend = {
            currentWeekData: currentWeekData,
            previousWeekData: previousWeekData,
            currentWeekAverage: currentWeekAverage,
            previousWeekAverage: previousWeekAverage,
        };

        // Save the data to MongoDB
        const userActivity = new UserActivity({
            activityData: {
                currentWeekData: currentWeekData,
                previousWeekData: previousWeekData,
            },
        });
        await userActivity.save();

        res.json(dataToSend);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.sendStatus(500);
    }
});

function calculateAverageTime(data) {
    if (!Array.isArray(data) || data.length === 0) return 0;

    const totalTime = data.reduce((total, entry) => total + entry.time, 0);
    return totalTime / data.length;
}

app.get('/user-activity', async (req, res) => {
    try {
        const allUserActivity = await UserActivity.find({});
        console.log('User data to send:', allUserActivity);
        res.json(allUserActivity);
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.sendStatus(500);
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



/* const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 19008;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://abigails:4b2O4xynAbxphZeU@userdata.aqhpfpu.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

const userActivitySchema = new mongoose.Schema({
    activityData: {
        currentWeekData: Object,
        previousWeekData: Object,
    },
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

app.post('/user-activity', async (req, res) => {
    try {
        const { currentWeekData, previousWeekData } = req.body;
        console.log('Received data:', currentWeekData, previousWeekData);

        // Perform calculations to determine the amount of time spent for the current week
        const currentWeekAverage = calculateAverageTime(currentWeekData);
        console.log('Current week average:', currentWeekAverage);

        // Perform calculations to determine the amount of time spent for the previous week
        const previousWeekAverage = calculateAverageTime(previousWeekData);
        console.log('Previous week average:', previousWeekAverage);

        // Prepare the data to send to home.js
        const dataToSend = {
            currentWeekData: currentWeekData,
            previousWeekData: previousWeekData,
            currentWeekAverage: currentWeekAverage,
            previousWeekAverage: previousWeekAverage,
        };

        // Save the data to MongoDB
        const userActivity = new UserActivity({
            activityData: {
                currentWeekData: currentWeekData,
                previousWeekData: previousWeekData,
            },
        });
        await userActivity.save();

        res.json(dataToSend);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.sendStatus(500);
    }
});

function calculateAverageTime(data) {
    if (!Array.isArray(data) || data.length === 0) return 0;

    const totalTime = data.reduce((total, entry) => total + entry.time, 0);
    return totalTime / data.length;
}

app.get('/user-activity', async (req, res) => {
    try {
        const allUserActivity = await UserActivity.find({});
        console.log('User data to send:', allUserActivity);
        res.json(allUserActivity);
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.sendStatus(500);
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
 */



/* const express = require('express');
const cors = require('cors');
const app = express();
const port = 19008;

app.use(express.json());
app.use(cors());

let userActivityData = {
    currentWeekData: [],
    previousWeekData: []
};

app.post('/user-activity', (req, res) => {
    try {
        const data = req.body;
        console.log('Received user activity data:', data);

        if (data.currentWeekData) {
            userActivityData.currentWeekData.push(data.currentWeekData);
        }

        if (data.previousWeekData) {
            userActivityData.previousWeekData.push(data.previousWeekData);
        }

        console.log('User data stored:', userActivityData); // Add this line to check if data is stored correctly
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.sendStatus(500);
    }
});

app.get('/user-activity', (req, res) => {
    try {
        console.log('User data to send:', userActivityData); // Add this line to check if data is sent correctly
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(userActivityData));
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.sendStatus(500);
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handling deprecation warnings
if (server && server.start) {
    server.start();
} else if (server && server.startCallback) {
    server.startCallback();
}

// Handling deprecation warnings for close method
process.on('SIGINT', async () => {
    if (server && server.stop) {
        await server.stop();
    } else if (server && server.stopCallback) {
        await server.stopCallback();
    }
    process.exit();
}); */



/* const express = require('express');
const cors = require('cors');
const app = express();
const port = 19008;

app.use(express.json());
app.use(cors());

let userActivityData = [];

app.post('/user-activity', (req, res) => {
    try {
        const data = req.body;
        console.log('Received user activity data:', data);
        userActivityData.push(data);
        console.log('User data stored:', userActivityData); // Add this line to check if data is stored correctly
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.sendStatus(500);
    }
});

app.get('/user-activity', (req, res) => {
    try {
        console.log('User data to send:', userActivityData); // Add this line to check if data is sent correctly
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(userActivityData));
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.sendStatus(500);
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handling deprecation warnings
if (server && server.start) {
    server.start();
} else if (server && server.startCallback) {
    server.startCallback();
}

// Handling deprecation warnings for close method
process.on('SIGINT', async () => {
    if (server && server.stop) {
        await server.stop();
    } else if (server && server.stopCallback) {
        await server.stopCallback();
    }
    process.exit();
}); */


/* const express = require('express');
const cors = require('cors');
const app = express();
const port = 19008;

app.use(express.json());
app.use(cors());

let userActivityData = [];

app.post('/', (req, res) => {
    try {
        const data = req.body;
        console.log('Received user activity data:', data);
        userActivityData.push(data);
        console.log('User data stored:', userActivityData); // Add this line to check if data is stored correctly
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing POST request:', error);
        res.sendStatus(500);
    }
});

app.get('/', (req, res) => {
    try {
        console.log('User data to send:', userActivityData); // Add this line to check if data is sent correctly
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(userActivityData));
    } catch (error) {
        console.error('Error processing GET request:', error);
        res.sendStatus(500);
    }
});


const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Handling deprecation warnings
if (server && server.start) {
    server.start();
} else if (server && server.startCallback) {
    server.startCallback();
}

// Handling deprecation warnings for close method
process.on('SIGINT', async () => {
    if (server && server.stop) {
        await server.stop();
    } else if (server && server.stopCallback) {
        await server.stopCallback();
    }
    process.exit();
});
 */