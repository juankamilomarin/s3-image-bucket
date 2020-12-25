var AWS = require('aws-sdk');

const { AWS_REGION } = process.env;
AWS.config.update({ region: AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;

const s3BucketServiceObject = new AWS.S3({
    params: {
        Bucket: bucketName,
    },
});

const getObject = async (key) => {
    let getParams = {
        Bucket: bucketName,
        Key: key,
    };
    const dataStream = s3BucketServiceObject.getObject(getParams).promise();
    return await dataStream;
};

const getBinaryImage = async (key) => {
    const dataStream = await getObject(key);
    let img = Buffer.from(dataStream.Body);
    return {
        contentType: dataStream.ContentType,
        length: dataStream.Body.length,
        eTag: dataStream.ETag,
        img,
    };
};

const uploadObject = async (key, data, contentType, encoding) => {
    let uploadParams = {
        Key: key,
        Body: data,
        ContentEncoding: encoding,
        ContentType: contentType,
    };

    const uploadPromise = new Promise((resolve, reject) => {
        s3BucketServiceObject.upload(uploadParams, function (err, data) {
            if (err) {
                reject(err);
            }
            if (data) {
                resolve(data);
            }
        });
    });

    return await uploadPromise;
};

const uploadBinaryImage = async (key, binaryData, contentType) => {
    const data = Buffer.from(binaryData.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    return await uploadObject(key, data, contentType, 'base64');
};

const getObjectKey = (folderName, fileName) => {
    return `${folderName}/${fileName}`;
};

const s3Bucket = {
    getObject,
    getBinaryImage,
    uploadObject,
    uploadBinaryImage,
    getObjectKey
}

module.exports = s3Bucket
