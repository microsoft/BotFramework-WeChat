// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema
{
    public class WeChatAccessToken : IStoreItem
    {
        public WeChatAccessToken()
        {
            ExpireTime = DateTimeOffset.MinValue;
        }

        public string AppId { get; set; } = null!;

        public string Token { get; set; } = null!;

        public string Secret { get; set; } = null!;

        public DateTimeOffset ExpireTime { get; set; }

        public string ETag { get; set; } = null!;
    }
}
