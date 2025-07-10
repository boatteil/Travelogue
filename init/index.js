const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Travelogue";

main()
.then(()=>{
    console.log("Connected to Database");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
 const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "678513b4afef4d2838718299",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
 };

 initDB();
 