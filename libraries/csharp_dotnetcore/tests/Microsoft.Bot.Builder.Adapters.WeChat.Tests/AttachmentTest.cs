// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Text;
using Microsoft.Bot.Builder.Adapters.WeChat.Extensions;
using Microsoft.Bot.Schema;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Tests
{
    public class AttachmentTest
    {
        private enum TestValueType
        {
            Type0,
            Type1,
        }

        [Fact]
        public void Md5HashTest()
        {
            var md5Hash = new AttachmentHash();
            var testString = "test string to get hash";
            var stringHashed = md5Hash.ComputeHash(testString);
            var bytesHashed = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(testString));
            Assert.Equal("E16B52D76AD74BB8D4B507515CD9ADB8", stringHashed);
            Assert.Equal(bytesHashed, stringHashed);
        }

        [Fact]
        public void AttachmentExtensionsTest()
        {
            var testString = "test_string";
            var herocard = new HeroCard()
            {
                Text = testString,
            };
            var herocardAttachment = herocard.ToAttachment();
            Assert.True(herocardAttachment.ContentAs<HeroCard>() is HeroCard);
            Assert.True(herocardAttachment.ContentAs<HeroCard>().Text == herocard.Text);

            var nullContent = new Attachment();
            Assert.Equal(default(HeroCard), nullContent.ContentAs<HeroCard>());
            var valueTypeAttachment = new Attachment()
            {
                Content = TestValueType.Type1,
            };

            Assert.Equal(TestValueType.Type1, valueTypeAttachment.ContentAs<TestValueType>());

            var testBytes = Encoding.UTF8.GetBytes(testString);
            var base64String = Convert.ToBase64String(testBytes);
            var byteArrayContentAttachment = new Attachment()
            {
                Content = base64String,
            };

            Assert.Equal(testBytes.Length, byteArrayContentAttachment.ContentAs<byte[]>().Length);

            var stringContentAttachment = new Attachment()
            {
                Content = JsonConvert.SerializeObject(herocard),
            };
            Assert.Equal(herocard.Text, stringContentAttachment.ContentAs<HeroCard>().Text);
        }
    }
}
