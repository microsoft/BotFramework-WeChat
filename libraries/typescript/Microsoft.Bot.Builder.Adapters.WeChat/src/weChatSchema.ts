/**
 * Request Message types.
 */
export enum RequestMessageTypes {
    /**
     * Unknown
     */
    Unknown = 'unknow',

    /**
     * Text
    */
    Text = 'text',

    /**
     * Location
     */
    Location = 'location',

    /**
     * Image
     */
    Image = 'image',

    /**Voice */
    Voice = 'voice',

    /**Video */
    Video = 'video',

    /**Link */
    Link = 'link',

    /**ShortVideo */
    ShortVideo = 'shortvideo',

    /**Event */
    Event = 'event',

    /**File */
    File = 'file',
}

export enum ResponseMessageTypes {
    /**Text message. */
    Text = 'text',

    /**News message. */
    News = 'news',

    /**Music message. */
    Music = 'music',

    /**Image message. */
    Image = 'image',

    /**Voice message. */
    Voice = 'voice',

    /**Video message. */
    Video = 'video',

    /**MPNews message. */
    MPNews = 'mpnews',

    MessageMenu = 'msgmenu',

    /**MultipleNews message. */
    MultipleNews = 'mutiplenews',

    /**Location message. */
    LocationMessage = 'location',

    /**No responese message. */
    NoResponse = 'noresponse',

    /**Success response message. */
    SuccessResponse = 'successresponse',

    /**Unknown message. */
    Unknown = 'unknown',
}

export enum MediaTypes {
    /**Image: 2M, support PNG/JEPG/JPG/GIF. */
    Image = 'image',

    /**Voice: 2M, no longer than 60s, support AMR/MP3. */
    Voice = 'voice',

    /**Video: 10M, support MP4. */
    Video = 'video',

    /**General audio type. */
    Audio = 'audio',

    /**Thumb：64KB，support JPG. */
    Thumb = 'thumb',

    /**News type. */
    News = 'news',
}

export class IRequestMessageBase {
    /**
     * Gets MsgType.
     * @value
     * Message type of the request.
     */
    MsgType: RequestMessageTypes;

    Encrypt: string;

    /**
     * Gets or sets ToUserName.
     * @value
     * Recipient OpenId from WeChat.
     */
    ToUserName: string;

    /**
     * Gets or sets FromUserName.
     * @value
     * Sender OpenId from WeChat.
     */
    FromUserName: string;

    /**
     * Gets or sets CreateTime.
     * @value
     * Message Created time.
     */
    CreateTime: number;
}

export interface IRequestMessageEventBase extends IRequestMessageBase {
    Event: string;
}

export interface RequestMessage extends IRequestMessageBase {
    /**
     * Gets or sets MsgId.
     * @value
     * Message id, required except event message.
     */
    MsgId: number;

    Encrypt: string;

    /**
     * Gets MsgType.
     * @value
     * Message type of the request message, override it if needed.
     */
    MsgType: RequestMessageTypes;

    /**
     * Gets or sets ToUserName.
     * @value
     * Recipient openId.
     */
    ToUserName: string;

    /**
     * Gets or sets FromUserName.
     * @value
     * Sender openId.
     */
    FromUserName: string;

    /**
     * Gets or sets CreateTime.
     * @value
     * Message creation time.
     */
    CreateTime: number;
}

export interface ImageRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Image;

    /**
     * Gets or sets MediaId.
     * @value
     * Media id of the image.
     */
    MediaId: string;

    /**
     * Gets or sets PicUrl.
     * @value
     * Image's link.
     */
    PicUrl: string;
}

/**Link request is used to share some online aritclies. */
export interface LinkRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Link;

    Title: string;

    Description: string;

    Url: string;
}

export interface LocationRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Location;

    /**
     * Gets or sets Latitude.
     * @value
     * The latitude infomation.
     */
    Latitude: number;

    /**
     * Gets or sets Longtitude.
     * @value
     * The longtitude infomation.
     */
    Longtitude: number;

    /**
     * Gets or sets Scale.
     * @value
     * Map zoom size.
     */
    Scale: number;

    /**
     * Gets or sets Label.
     * @value
     * Geolocation information in text.
     */
    Label: string;
}

export interface ShortVideoRequest extends RequestMessage {
    MsgType: RequestMessageTypes.ShortVideo;

    MediaId: string;

    ThumbMediaId: string;
}

export interface TextRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Text;

    Content: string;
}

export interface UnknowRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Unknown;

    /**
     * Gets or sets Content.
     * @value
     * Original request body of the unknow type, should be xml string.
     */
    Content: string;
}

export interface VideoRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Video;

    MediaId: string;

    ThumbMediaId: string;
}

export interface VoiceRequest extends RequestMessage {
    MsgType: RequestMessageTypes.Voice;

    MediaId: string;

    Format: string;

    Recognition: string;
}

export interface RequestEvent extends IRequestMessageEventBase {
    /**
     * Gets the event type.
     * @value
     * The event type, should be one of EventType.
     */
    Encrypt: string;

    /**
     * Gets event message type.
     * @value
     * Event message type, should be a static value.
     */
    MsgType: RequestMessageTypes.Event;

    /**
     * Gets or sets ToUserName.
     * @value
     * Recipient openId.
     */
    ToUserName: string;

    /**
     * Gets or sets FromUserName.
     * @value
     * Sender openId.
     */
    FromUserName: string;

    /**
     * Gets or sets CreateTime.
     * @value
     * Message creation time.
     */
    CreateTime: number;
}

/**Request Event with event key, most likly comming from static menu event. */
export interface RequestEventWithEventKey extends RequestEvent {
    EventKey: string;
}

export class IResponseMessageBase {
    MsgType: string;
}

export class ResponseMessage extends IResponseMessageBase {
    /**
     * Gets or sets ToUserName.
     * @value
     * Recipient openId.
     */
    ToUserName: string;

    /**
     * Gets or sets FromUserName.
     * @value
     * Sender openId.
     */
    FromUserName: string;

    /**
     * Gets or sets creation time.
     * @value
     * Message creation time.
     */
    CreateTime: number;
}

export class Image
{
    MediaId: string;
    constructor(mediaId: string) {
        this.MediaId = mediaId;
    }
}

export class ImageResponse extends ResponseMessage {
    image: Image;
    constructor(param: Image | string) {
        super();
        if (typeof param === 'string') {
            this.image = new Image(param);
        } else {
            this.image = param;
        }
        this.MsgType = ResponseMessageTypes.Image;
    }
}

export class MPNewsResponse extends ResponseMessage{
    MediaId: string;
    constructor(mediaId: string) {
        super();
        this.MediaId = mediaId;
        this.MsgType = ResponseMessageTypes.MPNews;
    }
}

export interface Music{
    Title: string;

    Description: string;

    MusicUrl: string;

    HQMusicUrl: string;

    ThumbMediaId: string;
}

export class MusicResponse extends ResponseMessage {
    Music: Music;
    constructor(music: Music) {
        super();
        this.Music = music;
        this.MsgType = ResponseMessageTypes.Music;
    }
}

export interface NewsResponse extends ResponseMessage {
    MsgType: ResponseMessageTypes.News;

    ArticleCount: number;

    /**
     * Gets or sets Articles.
     * @value
     * Article list, can only show up to 10 article.
     */
    Articles: Article[];
}

export interface Article {
    title: string;

    description: string;

    url: string;

    /**
     * Gets or sets PicUrl.
     * @value
     * Should be JPG or PNG type.
     */
    picUrl: string;
}

export interface TextResponse extends ResponseMessage {
    MsgType: ResponseMessageTypes.Text;

    Content: string;
}

export class Video {
    MediaId: string;

    Title: string;

    Description: string;

    constructor(mediaId: string, title?: string, description?: string) {
        this.MediaId = mediaId;
        this.Title = title;
        this.Description = description;
    }
}

export class VideoResponse extends ResponseMessage {
    Video: Video;
    constructor(mediaId: string, title?: string, description?: string) {
        super();
        this.Video = new Video(mediaId, title, description);
        this.MsgType = ResponseMessageTypes.Video;
    }
}

export class Voice {
    MediaId: string;
    constructor(mediaId: string) {
        this.MediaId = mediaId;
    }
}

export class VoiceResponse extends ResponseMessage {
    Voice: Voice;
    constructor(mediaId: string) {
        super();
        this.Voice = new Voice(mediaId);
        this.MsgType = ResponseMessageTypes.Voice;
    }
}

export class MessageMenuResponse extends ResponseMessage {
    MessageMenu: MessageMenu;

    MsgType: ResponseMessageTypes.MessageMenu;
}

export interface MenuItem {
    /**
     * Gets or sets Id.
     * @value
     * Id of the menu item.
     */
    id: string;

    /**
     * Gets or sets Content.
     * @value
     * Content of the menu item.
     */
    content: string;
}

export interface MessageMenu {
    /**
     * Gets or sets HeaderContent.
     * @value
     * HeaderContent of the menu.
     */
    HeaderContent: string;

    /**
     * Gets or sets MenuItems.
     * @value
     * Items in message menu.
     */
    MenuItems: MenuItem[];

    /**
     * Gets or sets TailContent.
     * @value
     * Footer of the menu.
     */
    TailContent: string;
}

/**Secret info store the parameter used to verify the message from WeChat and decrypt message content. */
export interface SecretInfo {
    /**
     * Gets or Sets signature from WeChat update webhook request.
     * @value
     * signature from WeChat update webhook request.
     */
    Signature: string;

    /**
     * Gets or Sets signature from WeChat message request.
     * @value
     * Signature from WeChat message request.
     */
    Msg_signature: string;

    /**
     * Gets or Sets timestamp.
     * @value
     * Timestamp of the request parameter.
     */
    Timestamp: string;

    /**
     * Gets or Sets nonce.
     * @value
     * Nonce of the request parameter.
     */
    Nonce: string;

    /**
     * Gets or Sets token.
     * @value
     * Token from the request parameter.
     */
    Token: string;

    /**
     * Gets or Sets endcoding aes key.
     * @value
     * EncodingAESKey from appsetings.
     * EncodingAESKey fixed length of 43 characters, a-z, A-Z, 0-9 a total of 62 characters selected
     * https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419318479&token=&lang=en_US.
     */
    EncodingAesKey: string;

    /**
     * Gets or Sets WeChat app id.
     * @value
     * WeChat app id.
     */
    AppId: string;
}

export interface WeChatAccessToken {
    AppId: string;

    Token: string;

    Secret: string;

    ExpireTime: Date;
}

export class WeChatJsonResult {
    /**
     * Gets or sets ErrorCode.
     * @value
     * Error code from WeChat, default is 0.
     */
    ErrorCode: number;

    /**
     * Gets or sets ErrorMessage.
     * @value
     * Error message from WeChat, default is 'ok'.
     */
    ErrorMessage: string;
    constructor(result: any) {
        this.ErrorCode = result.errcode;
        this.ErrorMessage = result.errmsg;
    }
}

export class UploadMediaResult extends WeChatJsonResult {
    MediaId: string;

    Expired = false;
    constructor(result: any) {
        super(result);
        this.MediaId = result.media_id;
    }
}

export class UploadTemporaryMediaResult extends UploadMediaResult {
    Type: string;

    ThumbMediaId: string;

    CreatedAt: number;

    constructor(result: any) {
        super(result);
        this.Type = result.type;
        this.ThumbMediaId = result.thumb_media_id;
        this.CreatedAt = result.created_at || 0;
        this.Expired = (this.CreatedAt + (3 * 24 * 60 * 60)) * 1000 <= Date.now();
    }
}

export class UploadPersistentMediaResult extends UploadMediaResult {
    Url: string;
    constructor(result: any) {
        super(result);
        this.Url = result.url;
    }
}

export class AccessTokenResult extends WeChatJsonResult {
    Token: string;
    ExpireIn: number;
    constructor(result: any) {
        super(result);
        this.Token = result.access_token;
        this.ExpireIn = result.expires_in;
    }
}

export interface News {
    /**
     * Gets or sets ThumbMediaId.
     * @value
     * Thumbnail image id.
     */
    thumb_media_id: string;

    /**
     * Gets or sets Author.
     * @value
     * Author of the news.
     */
    author: string;

    /**
     * Gets or sets Title.
     * @value
     * News title.
     */
    title: string;

    /**
     * Gets or sets ContentSourceUrl.
     * @value
     * Link to open when user click open original article.
     */
    content_source_url: string;

    /**
     * Gets or sets Content.
     * @value
     * News content, support HTML.
     */
    content: string;

    /**
     * Gets or sets Description.
     * @value
     * News description.
     */
    digest: string;

    /**
     * Gets or sets ShowCoverPicture.
     * @value
     * Show cover picture in news detail, 1 is ture, 0 is false.
     * Must be a string.
     */
    show_cover_pic: string;

    /**
     * Gets or sets ThumbUrl.
     * @value
     * Thumbnail image url.
     */
    thumb_url: string;

    /**
     * Gets or sets NeedOpenComment.
     * @value
     * Flag if open comment for news, 1 is true, 0 is false.
     */
    need_open_comment?: number;

    /**
     * Gets or sets OnlyFansCanComment.
     * @value
     * Flag only fans can comment, 1 is true, 0 is false.
     */
    only_fans_can_comment?: number;
}

export class MimeTypesMap {
    MimeTypeMap: { [key: string]: string } = {
        ['adp'] : 'audio/adpcm',
        ['au'] : 'audio/basic',
        ['snd'] : 'audio/basic',
        ['mid'] : 'audio/midi',
        ['midi'] : 'audio/midi',
        ['kar'] : 'audio/midi',
        ['rmi'] : 'audio/midi',
        ['m4a'] : 'audio/mp4',
        ['mp4a'] : 'audio/mp4',
        ['mp3'] : 'audio/mpeg',
        ['mpga'] : 'audio/mpeg',
        ['mp2'] : 'audio/mpeg',
        ['mp2a'] : 'audio/mpeg',
        ['m2a'] : 'audio/mpeg',
        ['m3a'] : 'audio/mpeg',
        ['oga'] : 'audio/ogg',
        ['ogg'] : 'audio/ogg',
        ['spx'] : 'audio/ogg',
        ['s3m'] : 'audio/s3m',
        ['sil'] : 'audio/silk',
        ['uva'] : 'audio/vnd.dece.audio',
        ['uvva'] : 'audio/vnd.dece.audio',
        ['eol'] : 'audio/vnd.digital-winds',
        ['dra'] : 'audio/vnd.dra',
        ['dts'] : 'audio/vnd.dts',
        ['dtshd'] : 'audio/vnd.dts.hd',
        ['lvp'] : 'audio/vnd.lucent.voice',
        ['pya'] : 'audio/vnd.ms-playready.media.pya',
        ['ecelp4800'] : 'audio/vnd.nuera.ecelp4800',
        ['ecelp7470'] : 'audio/vnd.nuera.ecelp7470',
        ['ecelp9600'] : 'audio/vnd.nuera.ecelp9600',
        ['rip'] : 'audio/vnd.rip',
        ['weba'] : 'audio/webm',
        ['aac'] : 'audio/x-aac',
        ['aif'] : 'audio/x-aiff',
        ['aiff'] : 'audio/x-aiff',
        ['aifc'] : 'audio/x-aiff',
        ['caf'] : 'audio/x-caf',
        ['flac'] : 'audio/x-flac',
        ['mka'] : 'audio/x-matroska',
        ['m3u'] : 'audio/x-mpegurl',
        ['wax'] : 'audio/x-ms-wax',
        ['wma'] : 'audio/x-ms-wma',
        ['ram'] : 'audio/x-pn-realaudio',
        ['ra'] : 'audio/x-pn-realaudio',
        ['rmp'] : 'audio/x-pn-realaudio-plugin',
        ['wav'] : 'audio/x-wav',
        ['amr'] : 'audio/amr',
        ['xm'] : 'audio/xm',
        ['bmp'] : 'image/bmp',
        ['cgm'] : 'image/cgm',
        ['g3'] : 'image/g3fax',
        ['gif'] : 'image/gif',
        ['ief'] : 'image/ief',
        ['jpg'] : 'image/jpeg',
        ['jpeg'] : 'image/jpeg',
        ['jpe'] : 'image/jpeg',
        ['ktx'] : 'image/ktx',
        ['png'] : 'image/png',
        ['btif'] : 'image/prs.btif',
        ['sgi'] : 'image/sgi',
        ['svg'] : 'image/svg+xml',
        ['svgz'] : 'image/svg+xml',
        ['tiff'] : 'image/tiff',
        ['tif'] : 'image/tiff',
        ['psd'] : 'image/vnd.adobe.photoshop',
        ['uvi'] : 'image/vnd.dece.graphic',
        ['uvvi'] : 'image/vnd.dece.graphic',
        ['uvg'] : 'image/vnd.dece.graphic',
        ['uvvg'] : 'image/vnd.dece.graphic',
        ['djvu'] : 'image/vnd.djvu',
        ['djv'] : 'image/vnd.djvu',
        ['sub'] : 'image/vnd.dvb.subtitle',
        ['dwg'] : 'image/vnd.dwg',
        ['dxf'] : 'image/vnd.dxf',
        ['fbs'] : 'image/vnd.fastbidsheet',
        ['fpx'] : 'image/vnd.fpx',
        ['fst'] : 'image/vnd.fst',
        ['mmr'] : 'image/vnd.fujixerox.edmics-mmr',
        ['rlc'] : 'image/vnd.fujixerox.edmics-rlc',
        ['mdi'] : 'image/vnd.ms-modi',
        ['wdp'] : 'image/vnd.ms-photo',
        ['npx'] : 'image/vnd.net-fpx',
        ['wbmp'] : 'image/vnd.wap.wbmp',
        ['xif'] : 'image/vnd.xiff',
        ['webp'] : 'image/webp',
        ['3ds'] : 'image/x-3ds',
        ['ras'] : 'image/x-cmu-raster',
        ['cmx'] : 'image/x-cmx',
        ['fh'] : 'image/x-freehand',
        ['fhc'] : 'image/x-freehand',
        ['fh4'] : 'image/x-freehand',
        ['fh5'] : 'image/x-freehand',
        ['fh7'] : 'image/x-freehand',
        ['ico'] : 'image/x-icon',
        ['sid'] : 'image/x-mrsid-image',
        ['pcx'] : 'image/x-pcx',
        ['pic'] : 'image/x-pict',
        ['pct'] : 'image/x-pict',
        ['pnm'] : 'image/x-portable-anymap',
        ['pbm'] : 'image/x-portable-bitmap',
        ['pgm'] : 'image/x-portable-graymap',
        ['ppm'] : 'image/x-portable-pixmap',
        ['rgb'] : 'image/x-rgb',
        ['tga'] : 'image/x-tga',
        ['xbm'] : 'image/x-xbitmap',
        ['xpm'] : 'image/x-xpixmap',
        ['xwd'] : 'image/x-xwindowdump',
        ['3gp'] : 'video/3gpp',
        ['3g2'] : 'video/3gpp2',
        ['h261'] : 'video/h261',
        ['h263'] : 'video/h263',
        ['h264'] : 'video/h264',
        ['jpgv'] : 'video/jpeg',
        ['jpm'] : 'video/jpm',
        ['jpgm'] : 'video/jpm',
        ['mj2'] : 'video/mj2',
        ['mjp2'] : 'video/mj2',
        ['mp4'] : 'video/mp4',
        ['mp4v'] : 'video/mp4',
        ['mpg4'] : 'video/mp4',
        ['mpeg'] : 'video/mpeg',
        ['mpg'] : 'video/mpeg',
        ['mpe'] : 'video/mpeg',
        ['m1v'] : 'video/mpeg',
        ['m2v'] : 'video/mpeg',
        ['ogv'] : 'video/ogg',
        ['qt'] : 'video/quicktime',
        ['mov'] : 'video/quicktime',
        ['uvh'] : 'video/vnd.dece.hd',
        ['uvvh'] : 'video/vnd.dece.hd',
        ['uvm'] : 'video/vnd.dece.mobile',
        ['uvvm'] : 'video/vnd.dece.mobile',
        ['uvp'] : 'video/vnd.dece.pd',
        ['uvvp'] : 'video/vnd.dece.pd',
        ['uvs'] : 'video/vnd.dece.sd',
        ['uvvs'] : 'video/vnd.dece.sd',
        ['uvv'] : 'video/vnd.dece.video',
        ['uvvv'] : 'video/vnd.dece.video',
        ['dvb'] : 'video/vnd.dvb.file',
        ['fvt'] : 'video/vnd.fvt',
        ['mxu'] : 'video/vnd.mpegurl',
        ['m4u'] : 'video/vnd.mpegurl',
        ['pyv'] : 'video/vnd.ms-playready.media.pyv',
        ['uvu'] : 'video/vnd.uvvu.mp4',
        ['uvvu'] : 'video/vnd.uvvu.mp4',
        ['viv'] : 'video/vnd.vivo',
        ['webm'] : 'video/webm',
        ['f4v'] : 'video/x-f4v',
        ['fli'] : 'video/x-fli',
        ['flv'] : 'video/x-flv',
        ['m4v'] : 'video/x-m4v',
        ['mkv'] : 'video/x-matroska',
        ['mk3d'] : 'video/x-matroska',
        ['mks'] : 'video/x-matroska',
        ['mng'] : 'video/x-mng',
        ['asf'] : 'video/x-ms-asf',
        ['asx'] : 'video/x-ms-asf',
        ['vob'] : 'video/x-ms-vob',
        ['wm'] : 'video/x-ms-wm',
        ['wmv'] : 'video/x-ms-wmv',
        ['wmx'] : 'video/x-ms-wmx',
        ['wvx'] : 'video/x-ms-wvx',
        ['avi'] : 'video/x-msvideo',
        ['movie'] : 'video/x-sgi-movie',
        ['smv'] : 'video/x-smv',
    };
}
