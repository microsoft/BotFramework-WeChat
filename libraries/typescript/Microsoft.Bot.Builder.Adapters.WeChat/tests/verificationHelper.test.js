const assert = require('assert');
const { VerificationHelper } = require('../lib/verificationHelper');
const secretInfo = {
    Token: 'bmwipabotwx',
    EncodingAesKey: 'P7PIjIGpA7axbjbffRoWYq7G0BsIaEpqdawIir4KqCt',
    AppId: 'wx77f941c869071d99',
    Signature: '4e17212123b3ce5a6b11643dc658af83fdb54c7d',
    Timestamp: '1562066088',
    Nonce: '236161902',
    Msg_signature: 'f3187a0efd9709c8f6550190147f43c279e9bc43',
};

describe('Verify secret information', () => {
    it('should throw error if the Signature is invalid', () => {
        assert.throws(
            () => {
                VerificationHelper.verifySignature(undefined, secretInfo.Timestamp, secretInfo.Nonce);
            },
            /^Error: ArgumentError - Request validation failed - invalid Signature.$/
        );
    });
    it('should throw error if the Timestamp is invalid', () => {
        assert.throws(
            () => {
                VerificationHelper.verifySignature(secretInfo.Signature, undefined, secretInfo.Nonce);
            },
            /^Error: ArgumentError - Request validation failed - invalid Timestamp.$/
        );
    });
    it('should throw error if the Nonce is invalid', () => {
        assert.throws(
            () => {
                VerificationHelper.verifySignature(secretInfo.Signature, secretInfo.Timestamp, undefined);
            },
            /^Error: ArgumentError - Request validation failed - invalid Nonce.$/
        );
    });
});