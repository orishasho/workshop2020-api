const dbClient = require('../initializers/db').getClient();

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

    async handleGetUserCoursesDetailed(req, res) {
        const userId = req.query['user_id'];
        const rows = await getUserCoursesDetailedByUserId(userId);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async getMandatoryCourses(req, res) {
        const rows = await getSpecificTypeCoursesFromDb('mandatory');
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async getElectiveCourses(req, res) {
        const rows = await getSpecificTypeCoursesFromDb('elective');
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async getWorkshopCourses(req, res) {
        const rows = await getSpecificTypeCoursesFromDb('workshop');
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    }
};

/* DB ACCESSORS */
//TODO: change to management college tables

async function getSpecificTypeCoursesFromDb(courseType) {
    try {
        const results = await dbClient.query('select * from courses where course_type = $1', [courseType]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function bulkInsertToUserCourses(userCoursesArray) {
    const formattedUserCoursesArray = userCoursesArray.map(userCourse => [
        userCourse.userId,
        userCourse.courseGrade,
        userCourse.courseStatus,
        userCourse.courseNumber
    ]);

    const deletePreviousQuery = `delete from user_courses_minhal where user_id = ${formattedUserCoursesArray[0][0]};`;
    const insertQuery = pgFormat('insert into user_courses_minhal (user_id, course_grade, course_status, course_number) VALUES %L', formattedUserCoursesArray);
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

async function getUserCoursesDetailedByUserId(userId) {
    try {
        const results = await dbClient.query('select * from user_courses_minhal join courses_minhal on (user_courses_minhal.course_number = courses_minhal.course_number) where user_id = $1', [userId]);
        return results.rows;
    } catch (e) {
        return [];
    }
}