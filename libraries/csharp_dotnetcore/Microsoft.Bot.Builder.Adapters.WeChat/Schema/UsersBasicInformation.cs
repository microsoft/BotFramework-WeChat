using System.Collections.Generic;
using Microsoft.Bot.Builder.Adapters.WeChat.Schema.JsonResults;
using Newtonsoft.Json;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema
{
    public class UsersBasicInformation : WeChatJsonResult
    {
        [JsonProperty("subscribe")]
        public int Subscribe { get; set; }

        [JsonProperty("openid")]
        public string OpenId { get; set; }

        [JsonProperty("nickname")]
        public string NickName { get; set; }

        [JsonProperty("sex")]
        public int Sex { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("province")]
        public string Province { get; set; }

        [JsonProperty("language")]
        public string Language { get; set; }

        [JsonProperty("headimgurl")]
        public string HeadImgUrl { get; set; }

        [JsonProperty("subscribe_time")]
        public long SubscribeTime { get; set; }

        [JsonProperty("unionid")]
        public string UnionId { get; set; }

        [JsonProperty("remark")]
        public string Remark { get; set; }

        [JsonProperty("groupid")]
        public int GroupId { get; set; }

        [JsonProperty("tagid_list")]
        public List<int> TagIdList { get; set; }

        [JsonProperty("subscribe_scene")]
        public string SubscribeScene { get; set; }

        [JsonProperty("qr_scene")]
        public long QRScene { get; set; }

        [JsonProperty("qr_scene_str")]
        public string QRSceneStr { get; set; }
    }
}
