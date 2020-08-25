const dbClient = require('../initializers/db').getClient();
const pgFormat = require('pg-format');

/* CONTROLLER INTERFACE */

module.exports = {
    async postBulkUserCourse(req, res) {
        /*
            req is an array of userCourse objects:
            userCourse = {
                userId: integer
                courseGrade: integer
                courseStatus: 'passed', 'failed', 'signed'
                courseNumber: integer
            }
        */
        let result = {};
        try {
            const userCoursesArray = req.body;
            await bulkInsertToUserCourses(userCoursesArray);
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json");
            res.send(JSON.stringify(result));
        }
    },

    async handleGetUserCourses(req, res) {
        //TODO: implement try-catch
        const userId = req.query['user_id'];
        const rows = await getUserCoursesByUserId(userId);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetUserCoursesDetailed(req, res) {
        //TODO: implement try-catch
        const userId = req.query['user_id'];
        const rows = await getUserCoursesDetailedByUserId(userId);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetGrade(req, res) {
        const userId = req.query['user_id'];
        const course_number = req.query['course_number'];
        const rows = await getCourseGrade(userId, course_number);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetCourseStatus(req, res) {
        const userId = req.query['user_id'];
        const course_number = req.query['course_number'];
        const rows = await getCourseStatus(userId, course_number);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetCourseStatusAndGrade(req, res) {
        const userId = req.query['user_id'];
        const rows = await getCourseStatusAndGrade(userId);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetTopPopular(req, res) {
        const rows = await getTopPopular();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },
};

/* DB ACCESSORS */

async function bulkInsertToUserCourses(userCoursesArray) {
    const formattedUserCoursesArray = userCoursesArray.map(userCourse => [
        userCourse.userId,
        userCourse.courseGrade,
        userCourse.courseStatus,
        userCourse.courseNumber
    ]);

    const deletePreviousQuery = `delete from user_courses where user_id = ${formattedUserCoursesArray[0][0]};`;
    const insertQuery = pgFormat('insert into user_courses (user_id, course_grade, course_status, course_number) VALUES %L', formattedUserCoursesArray);
    // Perform delete and insert in the same transaction:
    try {
        await dbClient.query('BEGIN');
        await dbClient.query(deletePreviousQuery + insertQuery);
        await dbClient.query('COMMIT');
        return true;
    } catch (e) {
        return false;
    }
}

async function getUserCoursesByUserId(userId) {
    try {
        const results = await dbClient.query('select * from user_courses where user_id = $1', [userId]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function getCourseGrade(userId, course_number) {
    try {
        const results = await dbClient.query('select course_grade from user_courses where user_id = $1 and course_number = $2', [userId, course_number]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function getCourseStatus(userId, course_number) {
    try {
        const results = await dbClient.query('select * from sp__get_course_status($1,$2)', [userId, course_number]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function getCourseStatusAndGrade(userId) {
    try {
        const results = await dbClient.query('select * from sp__get_courses_status_and_grade($1)', [userId]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function getTopPopular() {
    try {
        const query = 'with top_3 as (select course_number, count(*) cnt from user_courses where course_number in (select course_number from courses where course_type in (\'math\', \'elective\')) group by 1 order by 2 desc limit 3) select c.course_name, t.cnt from courses c join top_3 t on c.course_number = t.course_number order by cnt desc';
        const results = await dbClient.query(query);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function getUserCoursesDetailedByUserId(userId) {
    try {
        const results = await dbClient.query('select * from user_courses join courses on (user_courses.course_number = courses.course_number) where user_id = $1', [userId]);
        return results.rows;
    } catch (e) {
        return [];
    }
}