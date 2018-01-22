let router = require("express").Router(),
  path = require("path"),
  ejs = require("ejs"),
  bodyParser = require("body-parser"),
  express = require("express"),
  _ = require("underscore"),
  StrainController = require("./../controllers/strains.js");

router.use(bodyParser.urlencoded({ extended: false }));
router.use("/style", express.static("public/dist/css"));
router.use("/js", express.static("public/dist/js"));
router.get("/", (req, res) => {
  Promise.all([
    StrainController.getEffects("positive"),
    StrainController.getTopStrains(6)
  ]).then(values => {
    renderEJS("index", { effects: values[0], top_strains: values[1] }, res);
  });
});
router.get("/search", (req, res) => {
  var query = {};
  var search = {};
  var limit = 20;
  var offset = 0;
  if (req.query.race) {
    query.race = req.query.race;
    search.race = req.query.race;
  }
  if (req.query.page) {
    offset = limit * req.query.page;
  }
  if (req.query.query) {
    search.name = req.query.query;
    query.name = { $regex: req.query.query, $options: "i" };
  }
  if (req.query.effects) {
    var effects = req.query.effects.split(",");
    query["effects.positive"] = { $all: effects };
  }
  var countPromise = StrainController.getCount(query);
  var searchPromise = StrainController.search(query, limit, offset);
  Promise.all([countPromise, searchPromise]).then(values => {
    renderEJS(
      "search",
      { strains: values[1], total: values[0], query: search },
      res
    );
  });
});
router.get("/browse", (req, res) => {
  var query = {};
  var limit = 20;
  var offset = 0;
  var page = 1;
  if (req.query.race) {
    query.race = req.query.race;
  }
  if (req.query.effects) {
    var effects = req.query.effects.split(",");
    query["effects.positive"] = { $all: effects };
  }
  if (req.query.page) {
    page = parseInt(req.query.page);
    offset = limit * (parseInt(req.query.page) - 1);
  }
  var strainPromise = StrainController.get(limit, offset, query);
  var strainCountPromise = StrainController.getCount(query);
  strainPromise.catch(e => {
    console.log("Failed");
  });
  strainCountPromise.catch(e => {
    console.log("Could not get strain count");
  });
  Promise.all([strainPromise, strainCountPromise]).then(values => {
    renderEJS(
      "browse",
      {
        strains: values[0],
        filter: {
          limit: limit,
          page: page,
          race: query.race,
          effects: req.query.effects
        },
        count: values[1]
      },
      res
    );
  });
});
router.get("/strain/*", (req, res) => {
  var name = decodeURIComponent(req.path.replace("/strain/", ""));
  if (name == "") {
    sendError(404, res);
    return;
  }
  var strainPromise = StrainController.getByName(name);
  strainPromise.catch(err => {
    sendError(404, res);
  });
  strainPromise.then(strain => {
    var relatedStrainPromise = StrainController.getRandom(3);
    relatedStrainPromise.then(relatedstrains => {
      renderEJS(
        "strain",
        { strain: strain, related_strains: relatedstrains, comments: [] },
        res
      );
    });
  });
});
function renderEJS(path, args, res) {
  ejs.renderFile("public/views/" + path + ".ejs", args, (err, str) => {
    if (err) {
      console.log(err);
      sendError(400, res);
    } else {
      res.send(str);
    }
  });
}

function sendError(error, res) {
  if (error == 404) {
    renderEJS("404", {}, res);
  } else {
    res.send("ERROR");
  }
}
module.exports = router;
