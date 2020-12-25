const mS3Instance = {
    getObject: (params) => {
        if (params.Key === 'error') {
            const error = new Error('test-error');
            return {
                promise: () => Promise.reject(error),
            };
        } else {
            const responseData = {
                params,
                response: 'responseData',
            };
            return {
                promise: () => Promise.resolve(responseData),
            };
        }
    },
    upload: (params, callback) => {
        if (params.Key === 'error') {
            const error = new Error('test-error');
            callback(error, null);
        } else {
            const responseData = {
                params,
                response: 'responseData',
            };
            callback(null, responseData);
        }
    }
}

jest.mock('aws-sdk', () => {
    return { 
        S3: jest.fn(() => mS3Instance),
        config: {
            update: () => jest.fn()
        }
    };
});


describe('s3Bucket', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env.S3_BUCKET_NAME = 'test-bucket'
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getObject', () => {
        it('should get object and return stream data when load is success', async () => {
            var s3Bucket = require('./s3Bucket');
            const streamData = await s3Bucket.getObject('testKey');
            const expectedResponse = {
                params: {
                    Bucket: 'test-bucket',
                    Key: 'testKey',
                },
                response: 'responseData',
            };
            expect(streamData).toStrictEqual(expectedResponse);
        });
    
        it('should return error when load not successful', async () => {
            var s3Bucket = require('./s3Bucket');
            await expect(s3Bucket.getObject('error')).rejects.toThrow('test-error');
        });
    });

    describe('getObjectKey', () => {
        it('should return key using user folder and file name', () => {
            const getObjectKey = require('./s3Bucket').getObjectKey;
            let expected = getObjectKey('folder', 'fileName');
            expect(expected).toBe('folder/fileName');
        });
    });
});
