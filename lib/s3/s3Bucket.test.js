var s3Bucket = require('./s3Bucket');

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
    },
}

jest.mock('aws-sdk', () => {
    return { S3: jest.fn(() => mS3Instance) };
  });
  


// jest.mock('./s3Bucket', () => ({
//     getObject: (params) => {
//         if (params.Key === 'error') {
//             const error = new Error('test-error');
//             return {
//                 promise: () => Promise.reject(error),
//             };
//         } else {
//             const responseData = {
//                 params,
//                 response: 'responseData',
//             };
//             return {
//                 promise: () => Promise.resolve(responseData),
//             };
//         }
//     },
//     upload: (params, callback) => {
//         if (params.Key === 'error') {
//             const error = new Error('test-error');
//             callback(error, null);
//         } else {
//             const responseData = {
//                 params,
//                 response: 'responseData',
//             };
//             callback(null, responseData);
//         }
//     },
// }));

describe('s3Bucket', () => {
    // const OLD_ENV = process.env;

    // beforeEach(() => {
    //     jest.resetModules();
    //     process.env = { ...OLD_ENV };
    // });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // afterAll(() => {
    //     process.env = OLD_ENV;
    // });

    describe('getObject', () => {
        it('should get object and return stream data when load is success', async () => {
            const streamData = await s3Bucket.getObject('testKey');
            const expectedResponse = {
                params: {
                    Key: 'testKey',
                },
                response: 'responseData',
            };
            expect(streamData).toStrictEqual(expectedResponse);
        });
    
        it('should return error when load not successful', async () => {
            await expect(s3Bucket.getObject('error')).rejects.toThrow('test-error');
        });
    });

    // describe('getObjectKey', () => {
    //     it('should return key using user domain, folder and file name', () => {
    //         const getObjectKey = require('./s3Bucket').getObjectKey;
    //         let expected = getObjectKey('domain', 'folder', 'fileName');
    //         expect(expected).toBe('domain/folder/fileName');
    //     });
    // });

    // describe('getObjectUrl', () => {
    //     it('should return url using user domain, folder and file name', () => {
    //         process.env.AWS_REGION = 'test-region';
    //         process.env.S3_BUCKET_NAME = 'test-bucket';
    //         const getObjectUrl = require('./s3Bucket').getObjectUrl;
    //         let expected = getObjectUrl('domain', 'folder', 'fileName');
    //         expect(expected).toBe('https://test-bucket.s3-test-region.amazonaws.com/domain/folder/fileName');
    //     });
    // });
});
