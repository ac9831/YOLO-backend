const artist = require('../entity/artist');

const facebookAuthentication = require('../entity/auth.facebook');

const fiesta = require('../entity/fiesta');
const fiestaPerformance = require('../entity/fiesta.perform');
const fiestaPhoto = require('../entity/fiesta.photo');
const fiestaPurchase = require('../entity/fiesta.purchase');

const holder = require('../entity/holder');
const host = require('../entity/holder.host');

const interestedInArtist = require('../entity/interest.artist');
const interestedInFiesta = require('../entity/interest.fiesta');
const interestedInTrack = require('../entity/interest.track');

const notify = require('../entity/notify');
const notifyToken = require('../entity/notify.token');
const notifyRecord = require('../entity/notify.record');

const tag = require('../entity/tag');
const tagGenre = require('../entity/tag.genre');

const track = require('../entity/track');
const trackComposition = require('../entity/track.compose');

const user = require('../entity/user');

user.hasOne(facebookAuthentication, { foreignKey : 'userId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
user.hasMany(notifyToken, { foreignKey : 'userId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
user.belongsToMany(artist, { through : interestedInArtist, foreignKey : 'userId' });
user.belongsToMany(notify, { through : notifyRecord, foreignKey : 'userId' });
user.belongsToMany(track, { through : interestedInTrack, foreignKey : 'userId' });

artist.hasOne(tag, { foreignKey : 'artistId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
artist.belongsToMany(fiesta, { through : fiestaPerformance, foreignKey : 'artistId' });

fiesta.hasMany(fiestaPhoto, { foreignKey : 'fiestaId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
fiesta.hasMany(fiestaPurchase, { foreignKey : 'fiestaId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
fiesta.hasMany(notify, { foreignKey : 'fiestaId', onUpdate : 'CASCADE', onDelete : 'CASCADE' });
fiesta.belongsToMany(user, { through : interestedInFiesta, foreignKey : 'fiestaId' });
fiesta.belongsToMany(artist, { through : fiestaPerformance, foreignKey : 'fiestaId' });
fiesta.belongsToMany(holder, { through : host, foreignKey : 'fiestaId' });

fiestaPerformance.hasMany(artist, {foreignKey : 'id'});

track.hasMany(tagGenre);
track.belongsToMany(tag, { through : tagGenre, foreignKey : 'trackId' });
track.belongsToMany(artist, { through : trackComposition, foreignKey : 'trackId' });

trackComposition.hasMany(track, {foreignKey : 'id' });

tag.hasMany(tagGenre);
tag.belongsToMany(track, { through : tagGenre, foreignKey : 'tagId'});

notify.hasMany(notifyRecord);

user.sync().then(() => {

    facebookAuthentication.sync();
    notifyToken.sync();

    artist.sync().then(() => {

        interestedInArtist.sync();

        track.sync().then(() => {

            trackComposition.sync();
            interestedInTrack.sync();

            tag.sync().then(() => {

                tagGenre.sync();
            });
        });

        holder.sync().then(() => {

            fiesta.sync().then(() => {

                fiestaPerformance.sync();
                fiestaPhoto.sync();
                fiestaPurchase.sync();

                host.sync();

                interestedInFiesta.sync();

                notify.sync().then(() => {

                    notifyRecord.sync();
                });
            });
        });
    });
});
