// TODO : Need to Move CloudFront
const s3 = require( 'multer-storage-s3' );

const multer = require('multer');
const uuid = require('uuid');

const path = require('path');
const fs = require('fs');
const env = require('dotenv').load();

const dir = path.join(__dirname, 'uploads');

const upload = multer({
        storage : s3({
destination : function( req, file, cb ) {

    cb( null, 'janghotest/' );// s3폴더에 경로명 시작  bucket/버킷폴더이름/jangho/file/

},
filename    : function( req, file, cb ) {

    cb( null, file.fieldname + '-' + Date.now() );

},
    bucket: 'janghotest',//버킷이름
    region: 'ap-northeast-2',//s3에 써있는 리젼이름
})
});

module.exports = upload;
