using Newtonsoft.Json;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema
{
    public class QueryInfo
    {
        public QueryInfo()
        {
            Language = "zh_CN";
        }

        [JsonProperty("openid")]
        public string OpenId { get; set; }

        [JsonProperty("lang")]
        public string Language { get; set; }
    }
}
