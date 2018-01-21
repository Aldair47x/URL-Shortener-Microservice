var express = require('express');
var router = express.Router();
var shortUrl = require('../model/shortUrl');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/new/:url(*)',function(req,res,next) {
  var {url} = req.params;
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if(regex.test(url)==true)
  {
    var short = Math.floor(Math.random()*10000).toString();
    var newUser = new shortUrl();
    newUser.sourceURL = url;
    newUser.finalURL = short;
    newUser.save(err => {
      if(err){
        return res.send('Error saving to db');
      }
    });
    return res.json({'Source URL':newUser.sourceURL, 'Final URL':newUser.finalURL});
  }
  else
  {
    return res.json({url: 'Does not comply with the established parameters of a URL'});
  }
});

router.get('/:urls',(req,res,next) => {
  var shorterUrl = req.params.urls;
  shortUrl.findOne({'finalURL': shorterUrl}, (err, data) => {
    if(err) return res.send('Error reading db');
    var newUrl=data.sourceURL;
    res.redirect(newUrl);
  });
});

module.exports = router;
