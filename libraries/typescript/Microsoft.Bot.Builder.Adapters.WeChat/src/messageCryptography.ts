/**
 * @module botframework-wechat
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { SecretInfo } from './weChatSchema';
import { VerificationHelper } from './verificationHelper';
import * as crypto from 'crypto';

/**
 * A cryptography class to decrypt the message content from WeChat.
 * @private
 */
export class MessageCryptography {

    /**
     * Verify the authenticity of the message and get the decrypted plaintext.
     * @param requestData Cipher message.
     * @param secretInfo The secret info provide by WeChat.
     * @returns message
     */
    public static decryptMessage(requestData: any, secretInfo: SecretInfo): string {
        if (secretInfo.EncodingAesKey.length !== 43) {
            throw new Error('Invalid EncodingAESKey.');
        }
        if (!VerificationHelper.verifySignature(secretInfo.Msg_signature, secretInfo.Timestamp, secretInfo.Nonce, secretInfo.Token, requestData.Encrypt)) {
            throw new Error('Signature verification failed.');
        }
        const message = aesDecrypt(requestData.Encrypt, secretInfo.EncodingAesKey, secretInfo.AppId);
        return message;
    }
}

/**
 * Decrypt the message.
 * @private
 * @param encryptString Encrypted string.
 * @param encodingAesKey Encoding AES key for decrypt message.
 * @param appId The WeChat app id.
 * @returns Decrypted string.
 */
function aesDecrypt(encryptString: string, encodingAesKey: string, appId: string): string {
    const aesKey = Buffer.from(encodingAesKey + '=', 'base64');
    const iv = aesKey.slice(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    decipher.setAutoPadding(false);
    let decipherBuff = Buffer.concat([decipher.update(encryptString, 'base64'), decipher.final()]);
    decipherBuff = pkcs7Decoder(decipherBuff);
    const len = decipherBuff.slice(16);
    const msgLen = len.slice(0, 4).readUInt32BE(0);
    const result = len.slice(4, msgLen + 4).toString();
    const appid = len.slice(msgLen + 4).toString();
    if (appId !== appid) {
        throw new Error('AppId is invalid.');
    }
    return result;
}

/**
 * @private
 */
function pkcs7Decoder(buff: any) {
    let pad = buff[buff.length - 1];
    if (pad < 1 || pad > 32) {
        pad = 0;
    }
    return buff.slice(0, buff.length - pad);
}