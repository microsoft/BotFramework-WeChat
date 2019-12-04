/**
 * @module botframework-wechat
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Storage, AttachmentData } from 'botbuilder-core';
import { WeChatAttachmentStorage } from './weChatAttachmentStorage';
import { AccessTokenStorage } from './accessTokenStorage';
import { AttachmentHash } from './attachmentHash';
import { WeChatAccessToken, WeChatJsonResult, ResponseMessageTypes, Article, AccessTokenResult, UploadMediaResult, News, UploadTemporaryMediaResult, UploadPersistentMediaResult, MessageMenu, MediaTypes } from './weChatSchema';
import { WebResource, HttpMethods, DefaultHttpClient, HttpHeaders } from '@azure/ms-rest-js';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

export class WeChatClient {
    private ApiHost = 'https://api.weixin.qq.com';
    private Client = new DefaultHttpClient();
    private AppId: string;
    private AppSecret: string;
    private TokenStorage: AccessTokenStorage;
    private AttachmentStorage: WeChatAttachmentStorage;
    private AttachmentHash: AttachmentHash;

    /**
     * Creates an instance of we chat client.
     * @param appId
     * @param appSecret
     * @param storage
     * @param [attachmentHash]
     */
    constructor(appId: string, appSecret: string, storage: Storage) {
        this.AppId = appId;
        this.AppSecret = appSecret;
        this.TokenStorage = new AccessTokenStorage(storage);
        this.AttachmentStorage = new WeChatAttachmentStorage(storage);
        this.AttachmentHash = new AttachmentHash();
    }

    /**
     * Upload temporary graphic media.
     * @param newsList Graphic material list.
     * @param isTemporary If upload media as a temporary media.
     * @param timeout Upload temporary news timeout.
     * @returns  Result of upload a temporary news.
     */
    public async uploadNewsAsync(newsList: News[], isTemporary: boolean, timeout = 30000): Promise<UploadMediaResult> {
        const mediaHash = this.AttachmentHash.computeStringHash(JSON.stringify(newsList)) + isTemporary;
        const cacheResult = await this.AttachmentStorage.getAsync(mediaHash);
        const accessToken = await this.getAccessTokenAsync();
        const url = this.getUploadNewsEndPoint(accessToken, isTemporary);
        if (!cacheResult || cacheResult.Expired) {
            const data = {
                articles: newsList
            };
            const result = await this.sendHttpRequestAsync('POST', url, data, undefined, timeout);
            let uploadResult: any;
            uploadResult = isTemporary ? new UploadTemporaryMediaResult(result) : new UploadPersistentMediaResult(result);
            await this.checkAndUpdateAttachmentStorage(mediaHash, uploadResult);
            return uploadResult;
        }
        return cacheResult;
    }

    /**
     * Added other types of permanent material.
     * @param attachmentData Attachment data to be uploaded.
     * @param timeout Upload persistent media timeout.
     * @returns  Result of upload persistent media.
     */
    public async uploadNewsImageAsync(attachmentData: AttachmentData, timeout = 30000): Promise<UploadMediaResult> {
        const mediaHash = this.AttachmentHash.computeBytesHash(attachmentData.originalBase64);
        const cacheResult = await this.AttachmentStorage.getAsync(mediaHash);
        if (!cacheResult || cacheResult.Expired) {
            const accessToken = await this.getAccessTokenAsync();
            const url = this.getAcquireMediaUrlEndPoint(accessToken);
            const uploadResult = await this.processUploadMediaAsync(attachmentData, url, false, timeout);
            await this.checkAndUpdateAttachmentStorage(mediaHash, uploadResult);
            return uploadResult;
        }
        return cacheResult;
    }

    /**
     * Upload temporary media (originally uploaded media files api).
     * @param attachmentData attachment data to be uploaded.
     * @param isTemporary If upload media as a temporary media.
     * @param timeout Upload temporary media timeout.
     * @returns  Result of upload Temporary media.
     */
    public async uploadMediaAsync(attachmentData: AttachmentData, isTemporary: boolean, timeout = 30000): Promise<UploadMediaResult> {
        const mediaHash = this.AttachmentHash.computeBytesHash(attachmentData.originalBase64) + isTemporary;
        const cacheResult = await this.AttachmentStorage.getAsync(mediaHash);
        const accessToken = await this.getAccessTokenAsync();
        const url = this.getUploadMediaEndPoint(accessToken, attachmentData.type, isTemporary);
        if (!cacheResult || cacheResult.Expired) {
            const uploadResult = await this.processUploadMediaAsync(attachmentData, url, isTemporary, timeout);
            await this.checkAndUpdateAttachmentStorage(mediaHash, uploadResult);
            return uploadResult;
        }
        return cacheResult;
    }

    /**
     * Get media url from mediaId.
     * @param mediaId The media Id.
     * @returns  Url of the specific media.
     */
    public async getMediaUrlAsync(mediaId: string): Promise<string> {
        const accessToken = await this.getAccessTokenAsync();
        const mediaUrl = `${ this.ApiHost }/cgi-bin/media/get?access_token=${ accessToken }&media_id=${ mediaId }`;
        return mediaUrl;
    }


    /**
     * Get access token used to call WeChat API.
     * @returns  Access token string.
     */
    public async getAccessTokenAsync(): Promise<string> {
        const token = await this.TokenStorage.getAsync(this.AppId);
        if (!token || token.ExpireTime <= new Date(Date.now())) {
            const url = this.getAccessTokenEndPoint(this.AppId, this.AppSecret);
            const result = await this.sendHttpRequestAsync('GET', url);
            const tokenResult = new AccessTokenResult(result);
            if (!tokenResult.ErrorCode) {
                const token: WeChatAccessToken = {
                    AppId: this.AppId,
                    Secret: this.AppSecret,
                    ExpireTime: new Date(Date.now() + tokenResult.ExpireIn * 1000),
                    Token: tokenResult.Token
                };
                await this.TokenStorage.saveAsync(this.AppId, token);
                return token.Token;
            } else {
                throw new Error(`${JSON.stringify(tokenResult)}`);
            }
        } else {
            return token.Token;
        }
    }

    /**
     * Send message to user through customer service message api.
     * @param data Message data.
     * @param timeout Send message to user timeout.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendMessageToUser(data: any, timeout = 10000): Promise<WeChatJsonResult> {
        const accessToken = await this.getAccessTokenAsync();
        const url = this.getMessageApiEndPoint(accessToken);
        const result = await this.sendHttpRequestAsync('POST', url, data, undefined, timeout);
        const sendResult = new WeChatJsonResult(result);
        if (sendResult.ErrorCode) {
            throw new Error(`${ sendResult.ErrorMessage }`);
        }
        return sendResult;
    }

    public async sendHttpRequestAsync(method: HttpMethods, url: string, data: any = undefined, headers: HttpHeaders = undefined, timeout = 10000): Promise<any> {
        const result = await this.makeHttpRequestAsync(method, url, data, headers, timeout);
        return result;
    }

    /**

    * All http request send to WeChat will be handled by this method.
     * @param method Http method.
     * @param url Request URL.
     * @param [data] Request data.
     * @param [token] Authentication token.
     * @param [timeout] Send http request timeout.
     * @returns Http response content.
     */
    private async makeHttpRequestAsync(method: HttpMethods, url: string, data: any = undefined, headers: any = undefined, timeout = 10000): Promise<any> {
        if (!url.includes(this.ApiHost)) {
            const result = await fetch(url);
            const buffer = await result.arrayBuffer();
            return new Uint8Array(buffer);
        }
        const requestMessage = new WebResource(url, method);
        let response: any;

        requestMessage.timeout = timeout;

        if (headers) {

            const options = {
                method: method,
                body: data,
                headers: headers,
            };
            const result = await fetch(url, options);
            response = await result.json();
            return response;
        }
        else {
            requestMessage.body = data;
            response = await this.Client.sendRequest(requestMessage);
            return JSON.parse(response.bodyAsText);
        }
    }

    /**
     * Send Image message.
     * @param openId User's open id from WeChat.
     * @param mediaId Image media id.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendImageAsync(
        openId: string,
        mediaId: string,
        timeout = 10000,
        customerServiceAccount: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Image,
                image: {
                    media_id: mediaId
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Image,
                image: {
                    media_id: mediaId
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send a graphic message (click to jump to the graphic message page) The number of the messages is limited to 8
     * note that if the number of graphics more then 8, there will be no response.
     * @param openId User's open id from WeChat.
     * @param mediaId Image media id.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendMPNewsAsync(
        openId: string,
        mediaId: string,
        timeout = 10000,
        customerServiceAccount: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.MPNews,
                mpnews: {
                    media_id: mediaId
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.MPNews,
                mpnews: {
                    media_id: mediaId
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send music message to user.
     * @param openId User's open id from WeChat.
     * @param title Music Title, Not required.
     * @param description Not required.
     * @param musicUrl Music url send to user.
     * @param highQualityMusicUrl High-quality music link, wifi environment priority use this link to play music.
     * @param thumbMediaId Media id for thumbnail image.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendMusicAsync(
        openId: string,
        title: string,
        description: string,
        musicUrl: string,
        highQualityMusicUrl: string,
        thumbMediaId: string,
        timeout = 10000,
        customerServiceAccount: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Music,
                music: {
                    title: title,
                    description: description,
                    musicurl: musicUrl,
                    hqmusicurl: highQualityMusicUrl,
                    thumb_media_id: thumbMediaId
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Music,
                music: {
                    title: title,
                    description: description,
                    musicurl: musicUrl,
                    hqmusicurl: highQualityMusicUrl,
                    thumb_media_id: thumbMediaId
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send graphic message to user.
     * @param openId User's open id from WeChat.
     * @param articles Article list will be sent to user.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendNewsAsync(
        openId: string,
        articles: Article[],
        timeout = 10000,
        customerServiceAccount: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.News,
                news: {
                    articles: articles
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.News,
                news: {
                    articles: articles
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send text message to user.
     * @param openId User's open id from WeChat.
     * @param content Text message content.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendTextAsync(
        openId: string,
        content: string,
        timeout = 10000,
        customerServiceAccount: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Text,
                text: {
                    content: content
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Text,
                text: {
                    content: content
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send a video message.
     * @param openId User's open id from WeChat.
     * @param mediaId Media id of the video.
     * @param title The title of the video.
     * @param description Video description.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @param thumbMeidaId Thumbnail image media id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendVideoAsync(
        openId: string,
        mediaId: string,
        title: string,
        description: string,
        timeout = 10000,
        customerServiceAccount: string = undefined,
        thumbMeidaId: string = undefined
    ): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Video,
                video: {
                    media_id: mediaId,
                    thumb_media_id: thumbMeidaId,
                    title: title,
                    description: description
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Video,
                video: {
                    media_id: mediaId,
                    thumb_media_id: thumbMeidaId,
                    title: title,
                    description: description
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send a voice message.
     * @param openId User's open id from WeChat.
     * @param mediaId Media id of the voice.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendVoiceAsync(openId: string, mediaId: string, timeout = 10000, customerServiceAccount: string = undefined): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Voice,
                voice: {
                    media_id: mediaId
                }
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Voice,
                voice: {
                    media_id: mediaId
                },
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Send a menu message.
     * @param openId User's open id from WeChat.
     * @param messageMenu Message menu that need to be sent.
     * @param timeout Send message operation timeout.
     * @param customerServiceAccount Customer service account open id.
     * @returns  Standard result of calling WeChat message API.
     */
    public async sendMessageMenuAsync(openId: string, messageMenu: MessageMenu, timeout = 10000, customerServiceAccount: string = undefined): Promise<WeChatJsonResult> {
        let data: any;
        if (!customerServiceAccount) {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.MessageMenu,
                msgmenu: messageMenu,
            };
        } else {
            data = {
                touser: openId,
                msgtype: ResponseMessageTypes.Voice,
                msgmenu: messageMenu,
                customservice: {
                    kf_account: customerServiceAccount
                }
            };
        }
        return await this.sendMessageToUser(data, timeout);
    }

    /**
     * Upload media data to WeChat.
     * @param attachmentData The attachment data need to be uploaded.
     * @param url The endpoint when upload the data.
     * @param isTemporaryMeida If upload media as a temporary media.
     * @param [timeout] Upload media timeout.
     * @returns Uploaded result from WeChat.
     */
    private async processUploadMediaAsync(attachmentData: AttachmentData, url: string, isTemporaryMeida: boolean, timeout = 10000): Promise<UploadMediaResult> {
        let form = new FormData();
        let headers: any;
        const ext = this.getMediaExtension(attachmentData.type);
        form.append('media', Buffer.from(attachmentData.originalBase64), {
            contentType: attachmentData.type,
            filename: attachmentData.name + ext,
            knownLength: attachmentData.originalBase64.byteLength,
        });
        if (!isTemporaryMeida && attachmentData.type.includes(MediaTypes.Video)) {
            form.append('description', {
                title: 'video',
                introduction: 'INTRODUCTION'
            });
        }
        headers = { 'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}` };
        const response = await this.sendHttpRequestAsync('POST', url, form, headers, timeout);
        if (isTemporaryMeida) {
            return new UploadTemporaryMediaResult(response);
        } else {
            return new UploadPersistentMediaResult(response);
        }
    }

    /**
     * Check if upload media successful then update attachment storage.
     * @param mediaHash Hash value of the media.
     * @param uploadResult Upload media result.
     * @returns  Task of updating media.
     */
    private async checkAndUpdateAttachmentStorage(
        mediaHash: string,
        uploadResult: UploadMediaResult
    ) {
        if (!uploadResult.ErrorCode) {
            await this.AttachmentStorage.saveAsync(mediaHash, uploadResult);
        } else {
            throw new Error('Upload media to WeChat failed.');
        }
    }

    /**
     * Private method to get access token endpoint.
     */
    private getAccessTokenEndPoint(appId: string, appSecret: string) {
        return `${ this.ApiHost }/cgi-bin/token?grant_type=client_credential&appid=${ appId }&secret=${ appSecret }`;
    }

    /**
     * Private method to get message api endpoint.
     */
    private getMessageApiEndPoint(accessToken: string) {
        return `${ this.ApiHost }/cgi-bin/message/custom/send?access_token=${ accessToken }`;
    }

    /**
     * Private method to get upload media endpoint.
     */
    private getUploadMediaEndPoint(accessToken: string, type: string, isTemporaryMeida: boolean) {
        if (isTemporaryMeida) {
            return `${ this.ApiHost }/cgi-bin/media/upload?access_token=${ accessToken }&type=${ type }`;
        }
        return `${ this.ApiHost }/cgi-bin/material/add_material?access_token=${ accessToken }&type=${ type };`;
    }

    /**
     * Private method to get upload news endpoint.
     */
    private getUploadNewsEndPoint(accessToken: string, isTemporary: boolean) {
        if (isTemporary) {
            return `${ this.ApiHost }/cgi-bin/media/uploadnews?access_token=${ accessToken }`;
        }
        return `${ this.ApiHost }/cgi-bin/material/add_news?access_token=${ accessToken }`;
    }

    private getAcquireMediaUrlEndPoint(accessToken: string) {
        return `${ this.ApiHost }/cgi-bin/media/uploadimg?access_token=${ accessToken }`;
    }

    private getMediaExtension(type: string) {
        if (type.includes(MediaTypes.Image) || type.includes(MediaTypes.Thumb)) {
            return '.jpg';
        }
        if (type.includes(MediaTypes.Video)) {
            return '.mp4';
        }
        if (type.includes(MediaTypes.Voice)) {
            return '.mp3';
        }
    }
}
