using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Microsoft.Bot.Builder.Adapters.WeChat
{
    public class WeChatAdapterWithErrorHandler : WeChatHttpAdapter
    {
        public WeChatAdapterWithErrorHandler(
            WeChatSettings settings,
            IStorage storage,
            IBackgroundTaskQueue taskQueue,
            ILogger<WeChatAdapterWithErrorHandler> logger,
            ConversationState conversationState,
            UserState userState,
            WeChatClient chatClient)
            : base(settings, storage, taskQueue, logger, chatClient)
        {
            OnTurnError = async (turnContext, exception) =>
            {
                // Log any leaked exception from the application.
                logger.LogError($"Exception caught : {exception.Message}");

                // Send a catch-all apology to the user.
                await turnContext.SendActivityAsync("Sorry, it looks like something went wrong.");

                if (conversationState != null)
                {
                    try
                    {
                        // Delete the conversationState for the current conversation to prevent the
                        // bot from getting stuck in a error-loop caused by being in a bad state.
                        // ConversationState should be thought of as similar to "cookie-state" in a Web pages.
                        await conversationState.DeleteAsync(turnContext);
                    }
                    catch (Exception e)
                    {
                        logger.LogError($"Exception caught on attempting to Delete ConversationState : {e.Message}");
                    }
                }
            };

            Use(new AutoSaveStateMiddleware(conversationState, userState));
        }
    }
}
