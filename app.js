const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/connectDB');
const userRoute = require('./routes/user.routes');
const projectRoute = require('./routes/project.routes');

// Instantiate the application
const app = express();

// Port declaration
const PORT = process.env.PORT || 3000;

// For parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', userRoute);
app.use('/api/project', projectRoute);

// Middleware to handle error;
app.use(errorHandler);

// Start App function, display PROMPT in purple
const startApp = async () => {
    try{
        await config.connectDB();
        app.listen(PORT, () => {
            console.log(`\x1b[35m%s\x1b[0m`, `SERVER: Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error(`\x1b[31m%s\x1b[0m`, `SERVER: ${error.message}`);
        process.exit(1);
    }
}

startApp();