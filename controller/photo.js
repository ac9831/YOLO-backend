const express = require('express');
const router = express.Router();
const fiesta = require('../service/fiesta');


// GET /photos/:id?redirect={redirect}
router.get('/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const redirect = (req.query.redirect === 'true') || false;

    if(id === null || id === 0) {

       res.status(412).json({});
       return;
    }

    fiesta.findPhoto(id)
          .then((data) => {

              if(data === null || data === '') {

                 res.status(404).json({});
                 return;
              }

                 if(redirect) { res.redirect("http://d26pmijmax1x4k.cloudfront.net/"); return; }
                 else { res.status(200).json({ body : 'd26pmijmax1x4k.cloudfront.net/' + data.path }); }
          })
          .catch(() => { res.status(500).json({}); return; });

});

module.exports = router;
