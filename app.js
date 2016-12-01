const body = require('body-parser');
const cookie = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const store = require('mysql-express-session')(session);

const relation = require('./domain/relation/relation');
const resources = require('./config/resources');

const fb = require('fb-mini');

const artist = require('./controller/artist');
const fiesta = require('./controller/fiesta');
const notify = require('./controller/notify');
const photo = require('./controller/photo');
const search = require('./controller/search');
const sign = require('./controller/sign');
const tag = require('./controller/tag');
const track = require('./controller/track');
const user = require('./controller/user');

const artistAdmin = require('./controller/admin/artist');
const fiestaAdmin = require('./controller/admin/fiesta');
const holderAdmin = require('./controller/admin/holder');
const trackAdmin = require('./controller/admin/track');

const tagAdmin = require('./controller/admin/tag');
const me = require('./controller/me');

const app = express();
const database = resources.database;

const sessionOption = {

	database: database.name,

	host: database.url,
	port: 3306,

	user: database.username,
	password: database.password
};

app.set('etag', false);

app.use(logger('dev'));
app.use(body.json());
app.use(body.urlencoded({ extended: true  }));
app.use(cookie());
app.use(session({

    key : 'sid',
    name : 'session_id',
    saveUninitialized  : false,
    secret : 'xxxxxxxxxxxxxxxxxxxxx',
    resave : false,
    store: new store(sessionOption)
}));


// Authentication / Public Routing
app.use('/sign', sign);
app.use('/artists', artist);
app.use('/search', search);
app.use('/notifications', notify);
app.use('/photos', photo);
app.use('/users', user);
app.use('/admin/artists', artistAdmin);
app.use('/admin/fiesta', fiestaAdmin);
app.use('/admin/holder', holderAdmin);
app.use('/admin/track', trackAdmin);
app.use('/fiesta', fiesta);
app.use('/me', me);


app.use('/tags', tag);
app.use('/tracks', track);


// Authorized Access - Routing



app.use('/admin/artists', artistAdmin)
app.use('/admin/fiestas', fiestaAdmin);
app.use('/admin/holders', holderAdmin)
app.use('/admin/tracks', trackAdmin);
app.use('/admin/tags', tagAdmin);


app.use((req, res, next) => {

    if (req.session.user_id === undefined)
        res.sendStatus(403);
    else
        next();
});



// Catch Not Found Error
app.use((req, res, next) => {

    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});

// Handling Errors
app.use((err, req, res) => {

    const e = { message: err.message };
    e.error = app.get('env') === 'development' ? err : undefined;

    res.status(err.status || 500).json(e);
});

module.exports = app;
