const express = require('express');
const cors = require('cors');
const userCourseRoute = require('./server/routes/userCourse');
const courseRoute = require('./server/routes/course');
const userRoute = require('./server/routes/user');
const courseScheduleRoute = require('./server/routes/courseSchedule');
const userScheduleDraftRoute = require('./server/routes/userScheduleDraft');
const userRatingRoute = require('./server/routes/userRating');
const userFriendRoute = require('./server/routes/userFriend');
const managementCollegeRoute = require('./server/routes/managementCollege');
const dbInitializer = require('./server/initializers/db');

// App settings
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/user_course', userCourseRoute);
app.use('/course', courseRoute);
app.use('/user', userRoute);
app.use('/course_schedule', courseScheduleRoute);
app.use('/user_schedule_drafts', userScheduleDraftRoute);
app.use('/user_rating', userRatingRoute);
app.use('/user_friend', userFriendRoute);
app.use('/management_college', managementCollegeRoute);


// App start
app.listen(8080, () => console.log('Web server is listening.. on port 8080'));
dbInitializer.initConnection().then(() => console.log('connected to db'));