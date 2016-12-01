const debug = {};
const release = {};

debug.gcm = {};
debug.gcm.sender_id = 'xxxxxxxxxxxxxxxxxxxxxxxxx';
debug.gcm.sender_api_key = 'xxxxxxxxxxxxxxxxxx'

debug.database = {};
debug.database.name = 'yolo';
debug.database.url = 'xxxxxxxxxxxxx';
debug.database.username = 'xxxxxxxxxxxxxx';
debug.database.password = 'xxxxxxxxxxxxxxxxxxx';

release.gcm = {};
release.gcm.sender_id = 'xxxxxxxxxxxxxxxxxxxxxx';
release.gcm.sender_api_key = 'xxxxxxxxxxxxxxxxxxxxxxxxx';

release.database = {};
release.database.name = 'xxxxxxxxxxx';
release.database.url = 'xxxxxx';
release.database.username = 'xxxxxxx';
release.database.password = 'xxxxxxxxxxxxxxxxx';

module.exports = process.env.NODE_ENV === 'development' ? debug : release;
