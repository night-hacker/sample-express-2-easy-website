const fs = require('fs');
const util = require('util');

// data is promisified just to artificially create conditions similar to actual MongoDB data
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// interesting solution for data manipulations:
// 1. create a class,
// 2. add a method that receives the entire data,
// 3. add methods that find requested data

class FeedbackService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  // get all comments per app's request
  async getList() {
    const data = await this.getData();
    return data;
  }

  // add a comment via POST request
  async addEntry(param) {
    const newComment = {
      name: param.fbName,
      title: param.fbTitle,
      message: param.fbMessage
    }
    const data = await this.getList();
    data.unshift(newComment);
    return writeFile(this.datafile, JSON.stringify(data, null, 2));
  }

  // gets the entire data
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if(!data) return [];
    return JSON.parse(data);
  }

}

module.exports = FeedbackService;