let mongoose = require("mongoose"),
  Strain = require("./../models/strains.js"),
  Strain_Effect = require("./../models/strain-effects.js"),
  _ = require("underscore");
require("mongoose-query-random");
function create(options) {
  return new Promise((resolve, reject) => {
    var newStrain = new Strain(options);
    newStrain.save(err => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(newStrain.toObject());
      }
    });
  });
}
function getById(id) {
  return new Promise((resolve, reject) => {
    Strain.findById(id, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}
function getRandom(limit = 10, race = null) {
  var search = {};
  if (race !== null) {
    search = { race: race };
  }
  return new Promise((resolve, reject) => {
    Strain.find(search).random(limit, true, function(err, strains) {
      if (err) {
        reject(err);
        return;
      }
      var allStrains = [];
      strains.forEach(strain => {
        allStrains.push(strain.toObject());
      });
      resolve(allStrains);
    });
  });
}
function getByName(name) {
  return new Promise((resolve, reject) => {
    var promise = get(1, 0, { name: name });
    promise.then(strainArray => {
      if (strainArray.length > 0) {
        resolve(strainArray[0]);
      } else {
        reject();
      }
    });
    promise.catch(() => {
      reject();
    });
  });
}
function getEffects(type = null) {
  return new Promise((resolve, reject) => {
    var search = {};
    if (type !== null) search = { type: type };
    Strain_Effect.find(search).exec((err, effects) => {
      if (err) {
        reject(err);
      } else {
        let effectArray = [];
        effects.forEach(effect => {
          effectArray.push(effect.toObject());
        });
        resolve(effectArray);
      }
    });
  });
}
function getTopStrains(limit = 20, offset = 0) {
  return getRandom(limit);
}
function search(query, limit = 20, offset = 0) {
  return get(limit, offset, query);
}
function count(query) {
  return new Promise((resolve, reject) => {
    Strain.find(query)
      .count()
      .exec((err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
  });
}
function get(limit = 20, offset = 0, query = {}, sort = {}) {
  return new Promise((resolve, reject) => {
    Strain.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .exec((err, strains) => {
        if (err) {
          reject(err);
        } else {
          var all_strains = [];
          _.forEach(strains, strain => {
            all_strains.push(strain);
          });
          resolve(all_strains);
        }
      });
  });
}
module.exports.create = create;
module.exports.get = get;
module.exports.getEffects = getEffects;
module.exports.getTopStrains = getTopStrains;
module.exports.search = search;
module.exports.getByName = getByName;
module.exports.getCount = count;
module.exports.getRandom = getRandom;
