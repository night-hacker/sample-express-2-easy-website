const express = require('express');
const app = express();
const router = express.Router(); // givers an instance of Express Router

const configs = require('../config.json'); //get the json file in
const config = configs[app.get('env')]; // load configuration for production or development mode. Production mode can be set with a one time PowerShell command: $env:NODE_ENV="production"; nodemon .

module.exports = param => {

  const { speakerService } = param;

  router.get('/', async (req, res, next) => {
    try{
      /* const speakerslist = await speakerService.getListShort();
      const artwork = await speakerService.getAllArtwork(); */

      //the two lines above were replaced by the 4 lines below for the reasons described below.

      const promises = []; //gets all data from speakerslist and artwork into this array in order to avoid wait penalties by getting and passing through the data by chunks 
      promises.push(speakerService.getListShort());
      promises.push(speakerService.getAllArtwork());

      const results = await Promise.all(promises);
      
      return res.render('index', {
        pageTitle: 'Home',
        speakerslist: results[0],
        artwork: results[1]
      });
    }
    catch(err) {
      next(err);
    }
  });

  return router;
};

//EXPRESS CONSTRUCTOR uses the pattern below, but the course teacher turns routs to functions in order to be able to pass params down from the main index file.

/* 
router.get('/', (req, res, next) => {
  // res.locals.title = {title: "yihhaaaaa"}; //interesting correlation between app.locals and res.locals
  
  res.render('index', {pageTitle: 'Home'});
});
//, {title: app.locals.title}
module.exports = router;
 */