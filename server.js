let https = require("https"),
  http = require("http"),
  app = require("express")(),
  app_route = require("./routes/app.js"),
  strains = require("./controllers/strains.js"),
  //api = require('./controllers/api.js'),
  mongoose = require("mongoose");

let db_collection = "test";
let db_pw = "xVEA3tOoMfCtfniS";
app.use("/api", require("./routes/rest.js"));
app.use("/", app_route);
mongoose.connect(
  "mongodb://slabby:" +
    db_pw +
    "@cluster0-shard-00-00-cxibp.mongodb.net:27017,cluster0-shard-00-01-cxibp.mongodb.net:27017,cluster0-shard-00-02-cxibp.mongodb.net:27017/" +
    db_collection +
    "?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  { useMongoClient: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected");
});
var server = http.createServer(app).listen(80);
