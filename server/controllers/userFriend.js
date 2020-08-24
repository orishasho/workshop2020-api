const dbClient = require('../initializers/db').getClient();

module.exports = {


    async handleGetFriendsByUser(req, res) {
        const user_id = req.query["user_id"];
        const rows = await getFriendsWithDrafts(user_id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetFriendRequestsByUser(req, res) {
        const user_id = req.query["user_id"];
        const rows = await getFriendRequestsByUser(user_id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetFriendRequestsByUserCount(req, res) {
        const user_id = req.query["user_id"];
        const rows = await getFriendRequestsByUserCount(user_id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleGetFriendStatusByUser(req, res) {
        const user_id = req.query["user_id"];
        const friend_to_add = req.query["friend_to_add"];
        const rows = await getFriendStatusByUser(user_id, friend_to_add);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    },

    async handleSendFriendRequest(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await insertToFriendRequests(reqJson.sender, reqJson.receiver);
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    },

    async handleSetFriendRequest(req, res) {
        let result = {}
        try {
            const reqJson = req.body;
            await setFriendRequest(reqJson.sender, reqJson.receiver, reqJson.status)
            result.success = true;
        } catch (e) {
            result.success = false;
        } finally {
            res.setHeader("content-type", "application/json")
            res.send(JSON.stringify(result))
        }
    }

};


async function getFriendsWithDrafts(user_id) {
    try {
        const results = await dbClient.query("select * from sp__get_friends_and_drafts($1)", [user_id]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}


async function getFriendRequestsByUser(user_id) {
    try {
        const results = await dbClient.query("select * from sp__get_friend_requests_info($1)", [user_id]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function getFriendStatusByUser(user_id, friend_to_add) {
    try {
        const results = await dbClient.query("select * from sp__check_friend_to_add($1, $2)", [user_id, friend_to_add]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function getFriendRequestsByUserCount(user_id) {
    try {
        const results = await dbClient.query("select count(*) from friend_requests where receiver = $1 and status is null", [user_id]);
        return results.rows;
    } catch (e) {
        console.log(e);
        return [];
    }
}

async function insertToFriendRequests(sender, receiver) {
    try {
        await dbClient.query("insert into friend_requests(sender, receiver) values ($1, $2)", [sender, receiver]);
        return true
    } catch (e) {
        console.log(e);
        return false;
    }
}

async function setFriendRequest(sender, receiver, status) {
    if (status === "accepted") {
        const addToFriendsQuery1 = `update user_friendships set user_friends = array_append(user_friends, ${receiver}) where user_id = ${sender};`;
        const addToFriendsQuery2 = `update user_friendships set user_friends = array_append(user_friends, ${sender}) where user_id = ${receiver};`;
        const updateRequestQuery = `update friend_requests set status = 'accepted', seen = 1 where sender = ${sender} and receiver = ${receiver};`;
        try {
            await dbClient.query('BEGIN');
            await dbClient.query(addToFriendsQuery1 + addToFriendsQuery2 + updateRequestQuery);
            await dbClient.query('COMMIT');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    } else {
        try {
            await dbClient.query("update friend_requests set status = 'rejected', seen = 1 where sender = $1 and receiver = $2", [sender, receiver, status]);
            return true
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}