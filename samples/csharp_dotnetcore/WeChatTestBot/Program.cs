using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Builder.Adapters.WeChat;
using Bot.Builder.Community.Storage.EntityFramework;
using WeChatTestBot.Bots;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson(
    options =>
    {
        options.SerializerSettings.MaxDepth = HttpHelper.BotMessageSerializerSettings.MaxDepth;
    });

builder.Services.AddHttpClient();

builder.Services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

//builder.Services.AddSingleton<IStorage, MemoryStorage>();

var ConnectString = builder.Configuration["StoreConnectionString"];

var storage = new EntityFrameworkStorage(ConnectString);
var TranscriptStorageLogger = new EntityFrameworkTranscriptStore(ConnectString);

builder.Services.AddSingleton<IStorage>(storage);
builder.Services.AddSingleton<UserState>(new UserState(storage));
builder.Services.AddSingleton<ConversationState>(new ConversationState(storage));
builder.Services.AddSingleton<ITranscriptStore>(TranscriptStorageLogger);




builder.Services.AddWeChatAdapterWithErrorAndTranscriptLoggerHandler(builder.Configuration);


builder.Services.AddTransient<IBot, TestBot>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();