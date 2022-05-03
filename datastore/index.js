const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};


// "test": "mocha -c test | less -R"

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  if (text !== undefined) {
    counter.getNextUniqueId((error, id) => {
      if(error) {
        // console.log('${exports.dataDir}/${id}', exports.dataDir, '/', id);
        // console.log('is this walk the dog?: ', text);
        // console.log('is this walk the dog?: ', error);
        throw('Error with getUniqueId');
      } else {
        fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
          if (err) {
            throw ('error writing counter');
          } else {
            callback(null, { id, text });
          };
        });
      }
    })
  };
};

exports.readAll = (callback) => {
  let arrOfTodoObjects = [];
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    if (err) {
      console.log("Houston we have an error reading directory")
      return arrOfTodoObjects;
    } else {
      // console.log(files)
      // arrOfTodoObjects = files.map(file, () => {
      //   fs.readFile(file, (error, fileData) => {
      //     if (err) {
      //       console.log('halp me')
      //     } else {
      //       console.log("fileData", fileData)
      //       console.log("file", file)

      //       return { text: fileData, id: file };
      //     }
      //   })
      // });

      files.forEach((file, index) => {
        //splice up to the dot (split('.'))
        let fileName = file.split('.')
        // console.log('URI:', `${exports.dataDir}/${fileName[0]}.txt`);
        arrOfTodoObjects.push({id: fileName[0], text: fileName[0]});

        // fs.readFile(`${exports.dataDir}/${fileName[0]}.txt`, "utf8", (err, fileData) => {
        //   if (err) {
        //     console.log('error reading file');
        //   } else {
        //     // callback(null, Number(fileData));
        //     console.log("fileName[0]", fileName[0])
        //     console.log("file", fileData)

        //     console.log("Object", {id: fileName[0], text: fileData});
        //     // arrOfTodoObjects.push({id: fileName[0], text: fileData});
        //     arrOfTodoObjects.push(fileData);

        //   }
        // });

        // console.log("arrOfTodoObjects to be returned ",arrOfTodoObjects);





        // counter.readCounter((error, fileData) => {
        //   if (error) {
        //     throw('readCounter Error in readAll');
        //   } else {
        //     console.log(fileData);
        //     arrOfTodoObjects.push({id: fileName[0], text: fileData});
        //     console.log(arrOfTodoObjects);
        //   }
        // });
      });


      callback(null, arrOfTodoObjects);
    }


  });

  // console.log("arrOfTodoObjects to be returned ", arrOfTodoObjects);

  // return arrOfTodoObjects;

};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
