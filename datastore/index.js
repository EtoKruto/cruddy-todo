const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};


// "test": "mocha -c test | less -R"

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // return new Promise(function(resolve, reject) {

    if (text !== undefined) {
      counter.getNextUniqueId((error, id) => {
        if (error) {
          return callback(error)
        } else {
          fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
            if (err) {
              return callback(error)
            } else {
              callback(null, { id, text });
            };
          });
        }
      })
    };

  // })
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log("Houston we have an error reading directory")
      return callback(err)
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then((fileData) => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });

    Promise.all(data).done((items) => {
      callback(null, items);
    });

  });
};


exports.readOne = (id, callback) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) {
      callback(err, undefined);
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, 'utf8', (error, data) => {
    if (error) {
      callback(error, undefined);
    } else {
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          console.log(err);
          callback(err, undefined);
        } else {
          callback(null, { id, text: text });
        }
      })
    }

  });
};

exports.delete = (id, callback) => {

  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filepath, 'utf8', (error, data) => {
    if (error) {
      callback(error, undefined);
    } else {
      fs.unlink(filepath, (err, data) => {
        if (err) {
          callback(err);
        } else {
          console.log('Deleted');
          callback(null);
        }
      });
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};