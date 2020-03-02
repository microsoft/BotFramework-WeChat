using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Bot.Builder.Adapters.WeChat.Schema.JsonResults;
using Newtonsoft.Json;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema
{
    public class UserBasicInfoList : WeChatJsonResult
    {
        [JsonProperty("user_info_list")]
        public List<UsersBasicInformation> UserInfoList { get; set; }
    }
}
