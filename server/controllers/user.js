const dbClient = require('../initializers/db').getClient();

module.exports = {
    async postUserDetails(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            console.log(reqJson);
            console.log(reqJson.user_email + "  " + reqJson.user_password);
            await insertToUsers(reqJson.user_email, reqJson.user_password)
                //console.log("in post");
                //await insertToUsersCourses(reqJson);
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json");
            res.send(JSON.stringify(result))
        }
    },

    async handleGetUserDetails(req, res) {
        const user_email = req.query["user_email"];
        const rows = await readUsersDetails(user_email);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows))
    },

    async updateUserNameByEmail(req, res) {
        const user_email = req.body["user_email"];
        const name = req.body["name"];
        const rows = await updateUserNameByEmailInDb(user_email, name);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows))
    }
};

/* DB ACCESSORS */

async function insertToUsers(user_email, user_password) {
    try {
        await dbClient.query("insert into users (user_email, password) values ($1, $2)", [user_email, user_password]);
        return true
    } catch (e) {
        return false;
    }
}

async function readUsersDetails(user_email) {
    try {
        const results = await dbClient.query("select * from users where user_email = $1", [user_email]);
        return results.rows;
    } catch (e) {
        return [];
    }
}

async function updateUserNameByEmailInDb(user_email, name) {
    try {
        const results = await dbClient.query("update users set name = $1 where user_email = $2", [name, user_email]);
        return results.rows;
    } catch (e) {
        return [];
    }
}