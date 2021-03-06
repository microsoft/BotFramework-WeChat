/**
 * @module botframework-wechat
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as crypto from 'crypto';

export class VerificationHelper {

    /**
     * Verify WeChat request message signature.
     * @param signature WeChat message signature in query params.
     * @param timestamp WeChat message timestamp in query params.
     * @param nonce WeChat message nonce in query params.
     * @param [token] Validation token from WeChat.
     * @param [postBody] Request body as string.
     * @returns Signature verification result.
     */
    public static verifySignature(signature: string, timestamp: string, nonce: string, token: string = undefined, postBody: string = undefined): boolean {
        if (!signature) {
            throw new Error('ArgumentError - Request validation failed - invalid Signature.');
        }
        if (!timestamp) {
            throw new Error('ArgumentError - Request validation failed - invalid Timestamp.');
        }
        if (!nonce) {
            throw new Error('ArgumentError - Request validation failed - invalid Nonce.');
        }
        return signature === generateSignature(token, timestamp, nonce, postBody);
    }
}

/**
 * Generate signature use the encrypted message.
 * @private
 * @param token Token in provided by WeChat.
 * @param timestamp WeChat message timestamp in query params.
 * @param nonce WeChat message nonce in query params.
 * @param [encryptedMessage] The encrypted message content from WeChat request.
 * @returns Generated signature.
 */
function generateSignature(token: string, timestamp: string, nonce: string, encryptedMessage: string = undefined): string {
    const sortlist = [token, timestamp, nonce, encryptedMessage];
    sortlist.sort();
    const raw = sortlist.join('');
    const hash = crypto.createHash('sha1').update(raw).digest('hex');
    return hash;
}