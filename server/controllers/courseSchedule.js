const dbClient = require('../initializers/db').getClient();

/* CONTROLLER INTERFACE */

module.exports = {
    async getPossibleCourses(req, res) {
        const user_id = req.query["user_id"];
        const semester = req.query["semester"];
        const rows = await readPossibleUserCourses(user_id, semester);
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    },

    async getCoursesSchedules(req, res) {
        const courses = req.body["arr"];
        const semester = req.body["semester"];
        console.log(courses);
        const rows = await readcoursesSchedules(courses, semester);
        console.log(rows);
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    }


};

/* DB ACCESSORS */

async function readPossibleUserCourses(user_id, semester) {
    try {
        const results = await dbClient.query("select * from sp__get_user_possible_courses($1, $2)", [user_id, semester]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function readcoursesSchedules(courses_list, semester) {
    try {
        console.log(courses_list.join());
        const results = await dbClient.query("select c.course_name, cs.* from courses_schedules cs join courses c on c.course_number = cs.course_number where c.course_number=ANY($1::varchar(50)[]) and cs.semester = ($2)", [courses_list, semester]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}