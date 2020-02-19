## WeChat Adapter for BotFramework ***_[PREVIEW]_***

This is the Node.js version of WeChat Adapter for BotFramework.

- [Installing](#installing)
- [Documentation](https://github.com/microsoft/BotFramework-WeChat/blob/6fd1d212e47fd9ff1b9e6865beac1c6fac242047/doc/README.md)
- [GitHub Repo](https://github.com/microsoft/BotFramework-WeChat)
- [Report Issues](https://github.com/microsoft/BotFramework-WeChat/issues)

### Installing
As we are the preview version, please configure npm to use the MyGet feed before installing.
```bash
npm config set registry https://botbuilder.myget.org/F/botframework-wechat/npm/
```

Then add the published version of this package to your bot:
```bash
npm install --save botframework-wechat
```

To reset the registry, run:
```bash
npm config set registry https://registry.npmjs.org/
```