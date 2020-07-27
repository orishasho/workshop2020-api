const { Client } = require('pg');

module.exports = {
    client: '',

    isClientInitialized: false,

    getClient() {
        if (!this.isClientInitialized) {
            this.client = new Client({
                connectionString: 'postgres://grxpeaoqzicdni:7cfa58fb0fc0bfc11bb8f374050230dc43e9ab5646df2f8a906987d287906bf3@ec2-46-137-84-173.eu-west-1.compute.amazonaws.com:5432/desmg0q6m0n9n0',
                ssl: { rejectUnauthorized: false }
            });
            this.isClientInitialized = true;
        }
        return this.client;
    },

    async initConnection() {
        try {
            await this.getClient().connect();
        } catch (e) {
            console.error(`Failed to connect: ${e}`);
        }
    }
};

