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
    var data = new shortUrl({

      sourceURL : url,
      finalURL : short

    });

    data.save(err => {
      if(err){
        return res.send('Error saving to db');
      }
    });
    return res.json({'Source URL':data.sourceURL, 'Final URL':data.finalURL});
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
    var re = new RegExp("^(http|https)://","i");
    var strToCheck = data.sourceURL;
    if(re.test(strToCheck))
    {
      res.redirect(301,data.sourceURL);
    }
    else{
      res.redirect(301,'http://' + data.sourceURL);
    }
  });
});

module.exports = router;
