const dbClient = require('../initializers/db').client;

/* CONTROLLER INTERFACE */

module.exports = {
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

    async getMathCourses(req, res) {
        const rows = await getSpecificTypeCoursesFromDb('math');
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

async function getSpecificTypeCoursesFromDb(courseType) {
    try {
        const results = await dbClient.query('select * from courses where course_type = $1', [courseType]);
        return results.rows;
    } catch(e) {
        return [];
    }
}