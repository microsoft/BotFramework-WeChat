using Newtonsoft.Json;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema.JsonResults
{
    public class UploadMediaResult : WeChatJsonResult, IStoreItem
    {
        [JsonProperty("media_id")]
        public string MediaId { get; set; }

        public string ETag { get; set; }

        public virtual bool Expired() => false;
    }
}
