const express = require('express');
const router = express.Router();

module.exports = param => {

  const { feedbackService } = param;
  
  router.get('/', async (req, res, send) => {
    const feedbacks = await feedbackService.getList();
    res.render('feedback', {
      pageTitle: "Recent Feedback",
      feedbacks: feedbacks,
      success: req.query.success // in fact listens to a GET request
    });
  })
  router.post('/', async (req, res, next) => {
    let trimData = req.body;
    for(i=0; i<trimData.lenth; i++) {
      trimData[i] = trimData[i].trim();
    }
    const {fbName, fbTitle, fbMessage} = trimData;
    
    if (!fbName || !fbTitle || !fbMessage) {     
      const feedbacks = await feedbackService.getList();
      return res.render('feedback', {
        pageTitle: "Recent Feedback",
        feedbacks: feedbacks,
        fbName,
        fbTitle,
        fbMessage,
        error: true
      });
    }
    else {
      
      await feedbackService.addEntry(trimData);
      res.redirect ('/feedback?success=true');
    }
  });
  
  return router;
}