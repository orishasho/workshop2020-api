const express = require('express');
const cors = require('cors');
const userCourseRoute = require('./server/routes/userCourse');
const courseRoute = require('./server/routes/course');
const dbInitializer = require('./server/initializers/db');

// App settings
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/user_course', userCourseRoute);
app.use('/course', courseRoute);

// App start
app.listen(8080, () => console.log('Web server is listening.. on port 8080'));
dbInitializer.initConnection().then(() => console.log('connected to db'));


