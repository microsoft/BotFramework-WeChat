const { AccessTokenStorage } = require('../lib/accessTokenStorage');
const { MemoryStorage } = require('botbuilder-core');
const assert = require('assert');
const accessTokenStorage = new AccessTokenStorage(new MemoryStorage());
const key = 'accesstokenkey';
const date = new Date('1995-12-17T03:24:00');
const result = {
    AppId: 'appid',
    Secret: 'secret',
    Token: 'token',
    ExpireTime: date.valueOf()
};

describe('My access token storage', async () => {
    assert(accessTokenStorage.saveAsync(key, result), 'Save failed.');
    it('shoule be reload the corret stored value', async () => {
        const weChatAccessToken = await accessTokenStorage.getAsync(key);
        assert.equal(weChatAccessToken.AppId, result.AppId);
        assert.equal(weChatAccessToken.Secret, result.Secret);
        assert.equal(weChatAccessToken.Token, result.Token);
        assert.equal(weChatAccessToken.ExpireTime, result.ExpireTime);
    });
});