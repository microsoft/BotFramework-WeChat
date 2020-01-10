/**
 * @module botframework-wechat
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Storage, StoreItems } from 'botbuilder-core';
import { WeChatAccessToken } from './weChatSchema';

/**
 * Storage provider for access token.
 * @private
 */
export class AccessTokenStorage {
    private storage: Storage;

    /**
     * Creates an instance of access token storage.
     * @param storage
     */
    constructor(storage: Storage) {
        this.storage = storage;
    }

    /**
     * Saves store items to storage.
     * @param key Item key to write to the storage.
     * @param value Item value to write to the storage.
     */
    public async saveAsync(key: string, value: WeChatAccessToken): Promise<void> {
        const dict: StoreItems = {
            [key]: value
        };
        await this.storage.write(dict);
    }

    /**
     * Loads store items from storage.
     * @param key Item key to read from the store.
     */
    public async getAsync(key: string): Promise<WeChatAccessToken | undefined> {
        const result: StoreItems = await this.storage.read([key]);
        return result[key] as WeChatAccessToken;
    }

    /**
     * Removes store items from storage.
     * @param key Item key to remove from the store.
     */
    public async deleteAsync(key: string): Promise<void> {
        await this.storage.delete([key]);
    }
}