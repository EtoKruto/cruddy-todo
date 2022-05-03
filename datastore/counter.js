const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  //read the file, readCounter
  readCounter((error, counter) => { //XXXX need to add the parameters for the anon function in the tests......, no return value
    //if the file has errors, console.log
    if (error) {
      console.log('Error in readCounter: ', error);
    } else { //else write on the file, writeCounter
      writeCounter(counter + 1, (error, counterString) => { //XXXX need to add the parameters for the anon function in the tests......
        if (error) { //if write function return error, console.log
          console.error('error in writeCounter is:', error)
        } else { //else use the callback and update the value
          callback(error, counterString)
        }
      })
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
