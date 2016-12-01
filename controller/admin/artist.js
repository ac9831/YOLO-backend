'use strict';

const express = require('express');
const router = express.Router();
const artist = require('../../service/artist');
const upload = require('../../config/upload');

// POST /admin/artists
router.post('/', (req, res) => {

    const name = req.body.name;
    const profile = req.body.profile || null;
    const link = req.body.link || null;

    if(name === '' || name === null) {

        res.status(412).json({});
        return;
    }

    artist.addArtist(name, profile, link)
          .then((data) => { res.status(201).json(data); return; })
          .catch((e) => { res.status(500).json({}); return; })
});

// PUT /admin/artists/:id
router.put('/:id', upload.single('profile'), (req, res) => {

    const id = parseInt(req.params.id);
    const name = req.body.name;
    const profile = req.file !== undefined ? req.file.path : undefined;
    const link = req.body.link || null;

    if(id === 0 || id === null) {

        res.status(412).json({});
        return;
    }

    artist.modifyArtist(id, name, profile, link)
          .then((data) => { res.status(204).json({}); return; })
          .catch((data) => { res.status(500).json({}); return; });

});

// DELETE /admin/artists/:id
router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if(id === 0 || id === null) {

        res.status(412).json({});
        return;
    }

    artist.deleteArtist(id)
          .then(() => { res.status(204).json({}); return; })
          .catch((e) => { res.status(500).json({}); return; });

});


module.exports = router;
