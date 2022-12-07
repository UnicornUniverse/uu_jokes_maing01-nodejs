const { MongoClient } = require("mongodb");
const Environments = require("../helpers/environments");

async function main() {
    console.log("Dropping MongoDb databases in Docker.");

    const client = new MongoClient(Environments.mongoUri);
    try {
        await client.connect();

        // find databases and drop them all one by one
        let adminDb = await client.db("admin").admin();
        let databaseList = await adminDb.listDatabases();
        for (let db of databaseList.databases) {
            if (db.name === "admin") continue;

            await client.db(db.name).dropDatabase();
        }
    } finally {
        await client.close();
    }

    console.log("All MongoDb databases in Docker dropped.");
}

main().catch(e => {
    console.error(e);
});