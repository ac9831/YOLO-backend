'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const fiesta = require('../../service/fiesta');
const holder = require('../../service/holder');
const upload = require('../../config/upload');


router.post('/', (req, res) => {

    const name = req.body.name;
    const description = req.body.description;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const location = req.body.location;
    const geolocation = JSON.parse(req.body.geolocation);
    const point = { type : 'Point', 'coordinates' : [geolocation.lat, geolocation.lng]};

    if (name === null || name === '') {

        res.status(412).json({});
        return;
    }

    fiesta.createFiesta(name, description, startTime, endTime, location, point)
          .then((data) => {

              res.status(201).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.post('/:id/photos', upload.single('photo'), (req, res) => {

    const id = parseInt(req.params.id);
    const path = req.file !== undefined ? req.file.path : undefined;

    if (id === null || id === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.createFiestaPhoto(id, path)
          .then((data) => {
              if (data === null || data === '') {

                  res.status(404).json({});
                  return;
              }
              res.status(201).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.put('/:fiestaId/photos/:photoId', upload.single('photo'), (req, res) => {

    const fiestaId = parseInt(req.params.fiestaId);
    const photoId = parseInt(req.params.photoId);
    const path = req.file !== undefined ? req.file.path : undefined;

    if (fiestaId === null || fiestaId === 0 || photoId === null || photoId === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.modifyFiestaPhoto(fiestaId, photoId, path)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(200).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.delete('/:fiestaId/photos/:photoId', (req, res) => {

    const fiestaId = parseInt(req.params.fiestaId);
    const photoId = parseInt(req.params.photoId);

    if (fiestaId === null || fiestaId === 0 || photoId === null || photoId === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.findFiestaPhoto(fiestaId, photoId)
          .then((data) => {

              if(data === null || data === '') {

                  res.status(204).json({});
                  return;
              }

              fs.exists(data.path, function(exists) {
                  if (exists) {

                      fs.unlink(data.path, function(err) {
                          if (err) {

                              res.status(412).json({});
                              return;
                          }

                          fiesta.deleteFiestaPhoto(fiestaId, photoId)
                                .then(() => {

                                    res.status(204).json({});
                                    return;
                                })
                                .catch((e) => {

                                    res.status(500).json({});
                                    return;
                                });

                      });
                  }else {

                      fiesta.deleteFiestaPhoto(fiestaId, photoId)
                            .then(() => {

                                res.status(204).json({});
                                return;
                            })
                            .catch(() => {

                                res.status(500).json({});
                                return;
                            });
                  }



              });
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.put('/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const name = req.body.name;
    const description = req.body.description;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const location = req.body.location;
    const geolocation = JSON.parse(req.body.geolocation);
    const point = { type : 'Point', 'coordinates' : [geolocation.lat, geolocation.lng]};

    if (id === null || id === '') {

        res.status(412).json({});
        return;
    }

    fiesta.modifyFiesta(id, name, description, startTime, endTime, location, point)
          .then(() => {

              res.status(200).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.put('/:id/facade', upload.single('photo'), (req, res) => {

    const id = parseInt(req.params.id);
    const path = req.file !== undefined ? req.file.path : undefined;

    if (id === null || id === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.inputFiestaFacade(id, path)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(200).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});

router.delete('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    if (id === null || id === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.deleteFiesta(id)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(204).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});



router.post('/:id/holders', (req, res) => {

    const fiestaId = parseInt(req.params.id);
    const holderId = parseInt(req.body.holderId);

    if (fiestaId === null || fiestaId === 0 || holderId === null || holderId === 0) {

        res.status(412).json({});
        return;
    }

    holder.findHolders(fiestaId, holderId)
          .then((data) => {

              if(data !== null && data !== '') {

                  res.status(204).json({});
                  return;
              }

              holder.addHolderHost(fiestaId, holderId)
                    .then((data) => {

                        if (data === null) {
                            res.status(404).json({});
                            return;
                        }

                        res.status(201).json(data);
                        return;
                    })
                    .catch((e) => {

                        res.status(500).json({});
                        return;
                    });
          })
          .catch(() => {

              res.status(500).json({});
              return;
          })
});

router.delete('/:fiestaId/holders/:holderId', (req, res) => {

    const fiestaId = parseInt(req.params.fiestaId);
    const holderId = parseInt(req.params.holderId);

    if (fiestaId === null || fiestaId === '' || holderId === null || holderId === '') {

        res.status(412).json({});
        return;
    }

    holder.deleteHolderHost(fiestaId, holderId)
          .then((data) => {

              if (data === null) {

                   res.status(404).json({});
                   return;
              }

              res.status(204).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});

router.post('/:id/artists', (req, res) => {

    const fiestaId = parseInt(req.params.id);
    const artistId = parseInt(req.body.artistId);
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const stage = req.body.stage;
    const headliner = req.body.headliner;

    if (fiestaId === null || fiestaId === 0 || artistId === null || artistId === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.addPerform(fiestaId, artistId, startTime, endTime, stage, headliner)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(201).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});


router.put('/:fiestaId/artists/:artistId', (req, res) => {

    const fiestaId = parseInt(req.params.fiestaId);
    const artistId = parseInt(req.params.artistId);
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const stage = req.body.stage;
    const headliner = req.body.headliner;

    if (fiestaId === null || fiestaId === 0 || artistId === null || artistId === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.modifyPerform(fiestaId, artistId, startTime, endTime, stage, headliner)
          .then((data) => {

              if (data === null) {
                  res.status(404).json({});
                  return;
              }

              res.status(200).json(data);
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });
});

router.delete('/:fiestaId/artists/:artistId', (req, res) => {

    const fiestaId = parseInt(req.params.fiestaId);
    const artistId = parseInt(req.params.artistId);

    if (fiestaId === null || fiestaId === 0 || artistId === null || artistId === 0) {

        res.status(412).json({});
        return;
    }

    fiesta.deletePerform(fiestaId, artistId)
          .then((data) => {

              if (data === null) {

                  res.status(404).json({});
                  return;
              }

              res.status(204).json({});
              return;
          })
          .catch((e) => {

              res.status(500).json({});
              return;
          });

});



module.exports = router;
