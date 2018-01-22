var http = require("http"),
  Strains = require("./strains.js"),
  //Strains2 = require("./strains.js"),
  StrainEffect = require("./../models/strain-effects.js"),
  StrainController = require("./strains.js"),
  _ = require("underscore"),
  mongoose = require("mongoose");
const api_endpoint = "http://strainapi.evanbusse.com";
const alt_api_endpoint = "http://en.seedfinder.eu/api/json/";
const api_key = "DAmswVW";
const alt_api_key = "8e4988004f12da09718881fafafe4273";
//db.strains.find().forEach(function(d) {db.findSiblingDB('backup')['strains'].insert(d)});
//X-API-Key: 70588ff0c70d3a94f6998f914eab7cdfa6c6c23a
let db_collection = "test";
let db_pw = "xVEA3tOoMfCtfniS";
mongoose.connect(
  "mongodb://slabby:" +
    db_pw +
    "@cluster0-shard-00-00-cxibp.mongodb.net:27017,cluster0-shard-00-01-cxibp.mongodb.net:27017,cluster0-shard-00-02-cxibp.mongodb.net:27017/" +
    db_collection +
    "?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  { useMongoClient: true }
);

function getAllStrains(page = 0) {
  var req = apiRequest(api_endpoint + "/" + api_key + "/strains/search/all");
  req.then(strains => {
    var num = 0;
    for (strain_name in strains) {
      var promise = Strains.create({
        api_id: strains[strain_name].id,
        name: strain_name,
        race: strains[strain_name].race,
        flavors: strains[strain_name].flavors,
        effects: strains[strain_name].effects
      });
      promise.then(() => {
        num += 1;
      });
      promise.catch(err => {
        console.log(err);
      });
    }
  });
}
function effectsParser(strains) {
  var Strain_Effects = {};
  var num = 0;
  for (strain_name in strains) {
    num += 1;
    var effects = strains[strain_name].effects;
    for (e = 0; e < 3; e++) {
      switch (e) {
        case 0:
          category = "medical";
          break;
        case 1:
          category = "positive";
          break;
        case 2:
          category = "negative";
          break;
      }
      for (i = 0; i < effects[category].length; i++) {
        if (effects[category][i] in Strain_Effects) {
          Strain_Effects[effects[category][i]].count += 1;
        } else {
          Strain_Effects[effects[category][i]] = new StrainEffect({
            type: category,
            name: effects[category][i],
            count: 0
          });
        }
      }
    }
  }
  for (strain in Strain_Effects) {
    console.log(Strain_Effects[strain].count);
    Strain_Effects[strain].save(err => {
      if (err) console.log("Failed to save");
    });
  }
  console.log("Did " + num + "saved " + Strain_Effects);
}
function associateImages() {
  var pr = StrainController.get(12);
  pr.catch(err => console.log(err));
  pr.then(strains => {
    console.log("associate");
    for (strain in strains) {
      getImage(strains[strain]);
    }
  });
}
associateImages();
function getImage(obj) {
  console.log("Searching for " + obj.name);
  apiRequest(
    "http://en.seedfinder.eu/api/json/search.json?q=" + obj.name
  ).then(res => {
    if (res.count > 0) {
      console.log(res);
    }
  });
}
function apiRequest(path) {
  return new Promise(function(resolve, reject) {
    http
      .get(path, resp => {
        let data = ""; // A chunk of data has been recieved.

        resp.on("data", chunk => {
          data += chunk;
        }); // The whole response has been received. Print out the result.

        resp.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", err => {
        reject(err.message);
      });
  });
}
