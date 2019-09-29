const fs = require('fs');
const util =require('util');

const readFile = util.promisify(fs.readFile);

class SpeakerService {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();

    return data.map (speaker => {
      return {name: speaker.name, shortname: speaker.shortname}
    })
  }

  async getListShort () {
    const data = await this.getData();
    return data.map(speaker => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title}
    });
  }

  async getList() {
    const data = await this.getData();
    return data.map(speaker => {
      return { name: speaker.name, shortname: speaker.shortname, title: speaker.title, summary:speaker.summary }
    });
  }

  async getAllArtwork() {
    const data = await this.getData();
    const artwork = data.reduce( (accumulation, elem) => {
      if (elem.artwork) {
      accumulation = [...accumulation, ...elem.artwork]
      }
      return accumulation;
    }, []);
    return artwork;
  }

  async getSpeaker(shortname) {
    const data = await this.getData();
    let speaker = data.find( speaker => {
      return speaker.shortname === shortname
    });
    if (!speaker) return null;
    let res = [];
    res.push({ name: speaker.name, shortname: speaker.shortname, title: speaker.title, description: speaker.description });
    if (speaker.artwork && speaker.artwork.length) {
      res.push(speaker.artwork);
    }
    return res;
  }

  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    if(!data) return [];
    return JSON.parse(data).speakers;
  }

}

module.exports = SpeakerService;