const dbClient = require('../initializers/db').getClient();

/* CONTROLLER INTERFACE */


/*
router.get('/allNames', userScheduleDraftController.getUserScheduleDraftNames);
router.get('/byName', userScheduleDraftController.getUserScheduleDraftByName);
router.post('/all', userScheduleDraftController.postUserScheduleDraft);
*/

module.exports = {
    async getUserScheduleDraftNames(req, res) {
        const user_id = req.query["user_id"];
        const rows = await readUserScheduleDraftNames(user_id);
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    },

    async getUserScheduleDraftByName(req, res) {
        const user_id = req.query["user_id"];
        const draft_name = req.query["draft_name"];
        const rows = await readUserScheduleDraftByName(user_id, draft_name);
        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify(rows))
    },

    async updateUserScheduleDraftByName(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await updateUserScheduleDrafts(reqJson.user_id, reqJson.draft_name, reqJson.draft)
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    },

    async finalizeUserScheduleDraftByName(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await finalizeUserScheduleDrafts(reqJson.user_id, reqJson.draft_name)
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    },

    async postUserScheduleDraft(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await insertToUserScheduleDrafts(reqJson.user_id, reqJson.draft_name, reqJson.draft)
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    },


};

/* DB ACCESSORS */

async function readUserScheduleDraftNames(user_id) {
    try {
        const results = await dbClient.query("select draft_name, is_final from user_schedule_drafts where user_id=$1", [user_id]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function readUserScheduleDraftByName(user_id, draft_name) {
    try {
        const results = await dbClient.query("select draft from user_schedule_drafts where user_id=$1 and draft_name=$2", [user_id, draft_name]);
        return results.rows[0].draft;
    } catch (e) {
        return [];
    }
}

async function insertToUserScheduleDrafts(user_id, draft_name, draft) {
    try {
        await dbClient.query("insert into user_schedule_drafts (user_id, draft_name, draft) values ($1, $2, $3)", [user_id, draft_name, JSON.stringify(draft)]);
        return true
    } catch (e) {
        return false;
    }
}

async function updateUserScheduleDrafts(user_id, draft_name, draft) {
    try {
        await dbClient.query("update user_schedule_drafts set draft=$3 where user_id=$1 and draft_name=$2", [user_id, draft_name, JSON.stringify(draft)]);
        return true
    } catch (e) {
        return false;
    }
}

async function finalizeUserScheduleDrafts(user_id, draft_name) {
    try {
        await dbClient.query("update user_schedule_drafts set is_final=(case when draft_name = $2 then 1 else 0 end) where user_id=$1", [user_id, draft_name]);
        return true
    } catch (e) {
        console.log(e);
        return false;
    }
}