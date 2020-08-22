const dbClient = require('../initializers/db').getClient();

module.exports = {
    async postRating(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await insertToUserRatings(reqJson.user_id, reqJson.course_number, reqJson.interesting_rating, reqJson.hard_rating);
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    },

    async handleGetTopInteresting(req, res) {
        const rows = await getTopInteresting();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetTopHard(req, res) {
        const rows = await getTopHard();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },
};

async function insertToUserRatings(user_id, course_number, interesting_rating, hard_rating) {
    const deletePreviousQuery = `delete from user_ratings where user_id = ${user_id} and course_number = '${course_number}';`;
    const insertQuery = `insert into user_ratings(user_id, course_number, interesting_rating, hard_rating) values (${user_id},${course_number},${interesting_rating},${hard_rating})`;
    // Perform delete and insert in the same transaction:
    try {
        await dbClient.query('BEGIN');
        await dbClient.query(deletePreviousQuery + insertQuery);
        await dbClient.query('COMMIT');
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function getTopInteresting() {
    try {
        const query = 'WITH top_3 AS (SELECT course_number, avg(interesting_rating) average FROM user_ratings GROUP BY 1 ORDER BY 2 DESC LIMIT 3) SELECT c.course_name, round(t.average,1) as cnt FROM courses c JOIN top_3 t ON c.course_number = t.course_number ORDER BY average DESC';
        const results = await dbClient.query(query);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function getTopHard() {
    try {
        const query = 'WITH top_3 AS (SELECT course_number, avg(hard_rating) average FROM user_ratings GROUP BY 1 ORDER BY 2 DESC LIMIT 3) SELECT c.course_name, round(t.average,1) as cnt FROM courses c JOIN top_3 t ON c.course_number = t.course_number ORDER BY average DESC';
        const results = await dbClient.query(query);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}