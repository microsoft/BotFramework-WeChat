// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Tests
{
    public class AdapterTest
    {
        [Fact]
        public async Task WeChatHttpAdapterTest()
        {
            var request = CreateMockRequest(MockDataUtility.XmlEncrypt).Object;
            var response = CreateMockResponse().Object;
            var secretInfo = MockDataUtility.GetMockSecretInfo();
            var storage = new MemoryStorage();
            var taskQueue = new BackgroundTaskQueue();
            var bot = new EchoBot();
            var testAdapter1 = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(true, false), storage, taskQueue);
            var testAdapter2 = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(false, true), storage, taskQueue);
            var testAdapter3 = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(true, true), storage, taskQueue);
            var testAdapter4 = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(false, false), storage, taskQueue);

            await testAdapter1.ProcessAsync(request, response, bot, secretInfo);
            await testAdapter2.ProcessAsync(request, response, bot, secretInfo);
            await testAdapter3.ProcessAsync(request, response, bot, secretInfo);
            await testAdapter4.ProcessAsync(request, response, bot, secretInfo);
        }

        [Fact]
        public async Task WeChatHttpAdapterExceptionTest()
        {
            var request = CreateMockRequest(MockDataUtility.XmlEncrypt).Object;
            var response = CreateMockResponse().Object;
            var secretInfo = MockDataUtility.GetMockSecretInfo();
            var storage = new MemoryStorage();
            var taskQueue = new BackgroundTaskQueue();
            var bot = new EchoBot();
            var testAdapter = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(true, false), storage, taskQueue);
            var testAdapter2 = new WeChatHttpAdapter(MockDataUtility.MockWeChatSettings(true, false), storage, null);
            var nullQueue = await Assert.ThrowsAsync<NullReferenceException>(() => testAdapter2.ProcessAsync(request, response, bot, secretInfo)).ConfigureAwait(false);
            Assert.Equal("Background task queue can not be null.", nullQueue.Message);
            testAdapter2.OnTurnError = (context, exception) => { return Task.CompletedTask; };
            await testAdapter2.ProcessAsync(request, response, bot, secretInfo).ConfigureAwait(false);

            var nullRequest = await Assert.ThrowsAsync<ArgumentNullException>(() => testAdapter.ProcessAsync(null, response, bot, secretInfo)).ConfigureAwait(false);
            Assert.Equal("Value cannot be null.\r\nParameter name: httpRequest", nullRequest.Message);
            var nullResponse = await Assert.ThrowsAsync<ArgumentNullException>(() => testAdapter.ProcessAsync(request, null, bot, secretInfo)).ConfigureAwait(false);
            Assert.Equal("Value cannot be null.\r\nParameter name: httpResponse", nullResponse.Message);
            var nullBot = await Assert.ThrowsAsync<ArgumentNullException>(() => testAdapter.ProcessAsync(request, response, null, secretInfo)).ConfigureAwait(false);
            Assert.Equal("Value cannot be null.\r\nParameter name: bot", nullBot.Message);
            var nullSecretInfo = await Assert.ThrowsAsync<ArgumentNullException>(() => testAdapter.ProcessAsync(request, response, bot, null)).ConfigureAwait(false);
            Assert.Equal("Value cannot be null.\r\nParameter name: secretInfo", nullSecretInfo.Message);

            secretInfo.EchoString = "echoString";
            await testAdapter.ProcessAsync(request, response, bot, secretInfo).ConfigureAwait(false);
            Assert.Equal(response.Body.Length, secretInfo.EchoString.Length);
            secretInfo.Timestamp = "0";
            var unauthorized = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => testAdapter.ProcessAsync(request, response, bot, secretInfo)).ConfigureAwait(false);
            Assert.Equal("Signature verification failed.", unauthorized.Message);

            testAdapter.Dispose();
        }

        private static Mock<HttpRequest> CreateMockRequest(object body)
        {
            var ms = new MemoryStream();

            // Do not dispose writer.
            var sw = new StreamWriter(ms);
            var json = body as string ?? JsonConvert.SerializeObject(body);
            sw.Write(json);
            sw.Flush();
            ms.Position = 0;
            var mockRequest = new Mock<HttpRequest>();
            mockRequest.Setup(x => x.Body).Returns(ms);
            var mockHeaders = new HeaderDictionary
            {
                { "Content-Type", "text/xml" },
            };
            mockRequest.Setup(x => x.Headers).Returns(mockHeaders);

            return mockRequest;
        }

        private static Mock<HttpResponse> CreateMockResponse()
        {
            var mockResponse = new Mock<HttpResponse>();
            mockResponse.Setup(x => x.Body).Returns(new MemoryStream());
            return mockResponse;
        }
    }
}
