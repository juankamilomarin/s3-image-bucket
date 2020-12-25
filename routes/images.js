var express = require('express');
var router = express.Router();
var s3Bucket = require('./../lib/s3/s3Bucket')
var imagesCache = require('./../lib/cache/imagesCache')

router.get('/', async (req, res, next) => {
  const { folder_name: folderName, image_name: imageName } = req.query;
        const key = s3Bucket.getObjectKey(folderName, imageName);
        try {
            const previousEtag = req.headers['if-none-match'];
            const cacheValue = imagesCache.get(key);
            if (previousEtag && cacheValue && cacheValue === previousEtag) {
                res.statusCode = 304;
                res.end();
            } else {
                const { img, contentType, length, eTag } = await s3Bucket.getBinaryImage(key);
                res.statusCode = 200;
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Length', length);
                res.setHeader('Etag', eTag);
                imagesCache.set(key, eTag);
                res.end(img);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                errorCode: error.code,
                errorMessage: error.message,
            });
            res.end();
        }
});

const readLocalFile= (filename) => {
    fs = require('fs');
    return new Promise((resolve, reject) => {
        fs.readFile(filename, function (err,data) {
            if (err) {
                reject(err);
            }
            resolve(data)
        });
    })
}

router.post('/', async (req, res, next) => {
  const { folder_name: folderName, image_name: imageName, content_type: contentType } = req.query;
  // Instead of reading a local file you could just simply receive your data in base64 
  // and user s3Bucket.uploadBinaryImage function
  const bufferData = await readLocalFile(imageName);
  const key = s3Bucket.getObjectKey(folderName, imageName);
  try {
      const objectData = await s3Bucket.uploadObject(key, bufferData, contentType);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(objectData);
      res.end();
  } catch (error) {
      console.error(error);
      res.status(500).json({
          errorMessage: error.message,
      });
      res.end();
  }
});

module.exports = router;
