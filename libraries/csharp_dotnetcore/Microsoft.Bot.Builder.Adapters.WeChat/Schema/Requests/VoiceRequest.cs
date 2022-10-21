// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Xml.Serialization;

namespace Microsoft.Bot.Builder.Adapters.WeChat.Schema.Requests
{
    [XmlRoot("xml")]
    public class VoiceRequest : RequestMessage
    {
        public override string MsgType => RequestMessageTypes.Voice;

        [XmlElement(ElementName = "MediaId")]
        public string MediaId { get; set; } = null!;

        [XmlElement(ElementName = "Format")]
        public string Format { get; set; } = null!;

        [XmlElement(ElementName = "Recognition")]
        public string Recognition { get; set; } = null!;
    }
}
