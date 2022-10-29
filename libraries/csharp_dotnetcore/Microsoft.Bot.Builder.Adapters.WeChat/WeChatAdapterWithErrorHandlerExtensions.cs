using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Adapters.WeChat;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class WeChatAdapterWithErrorHandlerExtensions
    {
        public static IServiceCollection AddWeChatAdapterWithErrorHandler(this IServiceCollection services, IConfiguration config)
        {
            //services.Configure<WeChatSettings>(config.GetSection(WeChatSettings.ConfigureItemName));
            //var weChatSetting = new WeChatSettings();
            var weChatSetting = config.GetSection(WeChatSettings.ConfigureItemName).Get<WeChatSettings>();
            services.AddSingleton(weChatSetting);
            services.AddSingleton<WeChatClient>();

            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
            services.AddHostedService<QueuedHostedService>();
            services.AddSingleton<WeChatAdapterWithErrorHandler>();

            return services;
        }

        public static IServiceCollection AddWeChatAdapterWithErrorAndTranscriptLoggerHandler(this IServiceCollection services, IConfiguration config)
        {
            //services.Configure<WeChatSettings>(config.GetSection(WeChatSettings.ConfigureItemName));
            var weChatSetting = config.GetSection(WeChatSettings.ConfigureItemName).Get<WeChatSettings>();
            services.AddSingleton(weChatSetting);
            services.AddSingleton<WeChatClient>();

            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
            services.AddHostedService<QueuedHostedService>();
            services.AddSingleton<WeChatAdapterWithErrorAndTranscriptLoggerHandler>();

            return services;
        }

    }
}
