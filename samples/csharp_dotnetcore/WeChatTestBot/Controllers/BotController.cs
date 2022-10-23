using Microsoft.AspNetCore.Mvc;
using Microsoft.Bot.Builder.Adapters.WeChat.Schema;
using Microsoft.Bot.Builder.Adapters.WeChat;
using Microsoft.Bot.Builder;

namespace WeChatTestBot.Controllers;

[Route("api/messages")]
[ApiController]
public class BotController : ControllerBase
{
    private readonly IBot _bot;
    private readonly WeChatAdapterWithErrorAndTranscriptLoggerHandler _wechatAdapter;

    public BotController(IBot bot, WeChatAdapterWithErrorAndTranscriptLoggerHandler wechatAdapter)
    {
        _bot = bot;
        _wechatAdapter = wechatAdapter;
    }

    [HttpGet("/WeChat")]
    [HttpPost("/WeChat")]
    public async Task PostWeChatAsync([FromQuery] SecretInfo postModel)
    {
        // Delegate the processing of the HTTP POST to the adapter.
        // The adapter will invoke the bot.
        await _wechatAdapter.ProcessAsync(Request, Response, _bot, postModel);
    }
}
