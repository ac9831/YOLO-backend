'use strict';

const express = require('express');
const router = express.Router();
const tag = require('../../domain/entity/tag');

// POST /admin/tags
router.post('/', (req, res) => {

    const name = req.body.name;
    const type = req.body.type;

    if(name === null || name === '' || type === null || type === '') {

        res.status(412).json({});
        return;
    }

    tag.create({name : name,type : type})
       .then((data) => {

           res.status(201).json(data);
           return;
       })
       .catch((e) => {

            res.status(500);
            return;
        });
});

// DELETE /admin/tags/:id
router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if(id === null || id === 0) {
        res.status(412).json({});
        return;
    }

    tag.destroy({ where : { id : id } })
       .then(() => {
           res.status(204).json({});
           return;
       })
       .catch(() => {
            res.status(500).json({});
            return;
        });
});

module.exports = router;
