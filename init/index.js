const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/HomeStay";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}





const initDB = async () => {
    try {
        // Clear existing data
        await Listing.deleteMany({});

        // Convert `owner` field to ObjectId
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: new mongoose.Types.ObjectId('677795983675d4de41d7f234'.trim()),
        }));

        // Insert data
        await Listing.insertMany(initData.data);

        console.log("Data was initialized successfully");
    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

initDB();
