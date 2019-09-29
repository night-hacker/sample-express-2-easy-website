const express = require('express');
const router = express.Router();

module.exports = param => {

  const { speakerService } = param;

  router.get('/', async (req, res, send) => {
    try {
      // const speakerslist = await speakerService.getList();
      const promises = []; //gets all data from speakerslist and artwork into this array in order to avoid wait penalties by getting and passing through the data by chunks 
      promises.push(speakerService.getList());
      promises.push(speakerService.getAllArtwork());

      const results = await Promise.all(promises);

      res.render('speakers', {
        pageTitle: "All Speakers",
        speakerslist: results[0],
        artwork: results[1]
      });
    }
    catch(err){ return err }

  });


  router.get('/:shortname', async (req, res, next) => {
    const speaker = await speakerService.getSpeaker(req.params.shortname);
    
    return res.render('detail', {
      pageTitle: `About ${req.params.shortname}`,
      name: speaker[0].name,
      shortname: speaker[0].shortname,
      title: speaker[0].title,
      description: speaker[0].description,
      artwork: speaker[1]
     });
  });
  
  return router;
}