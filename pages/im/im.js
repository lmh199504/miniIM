// pages/im/im.js
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import genTestUserSig from '../../utils/GenerateTestUserSig'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID: '',
    messageText: '',
    messageList: [],
    customeId: 'user03',
    nextReqMessageID: '',
    conversationID: 'C2Cuser03',
    isCompleted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initIM()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputChange(e) {
    console.log(e.detail.value)
    this.setData({
      messageText: e.detail.value
    })
  },
  sendTextMessage: function () {
    // 发送文本消息，Web 端与小程序端相同
    // 1. 创建消息实例，接口返回的实例可以上屏
    console.log(this.data.messageText)
    let message = this.tim.createTextMessage({
      to: this.data.customeId,
      conversationType: TIM.TYPES.CONV_C2C,
      // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
      // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
      // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
      payload: {
        text: this.data.messageText
      }
    });
    // 2. 发送消息
    let promise = this.tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      console.log(imResponse);
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  initIM(e) {
    var self = this;
    const userId = 'user02'
    this.setData({
      userID: userId
    })
    const config = genTestUserSig(userId)
    console.log(config)
    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
    let option = {
      SDKAppID: config.sdkAppID // 接入时需要将0替换为您的即时通信应用的 SDKAppID
    };
    this.tim = TIM.create(option); // SDK 实例通常用 tim 表示
    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    this.tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    // tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

    // 注册腾讯云即时通信 IM 上传插件，即时通信 IM SDK 发送图片、语音、视频、文件等消息需要使用上传插件，将文件上传到腾讯云对象存储
    this.tim.registerPlugin({
      'tim-upload-plugin': TIMUploadPlugin
    });

    // 监听事件，如：
    this.tim.on(TIM.EVENT.SDK_READY, function (event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
    });

    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log("收到新消息了")
      console.log(event.data)
    });

    this.tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
      // 收到消息被撤回的通知。使用前需要将SDK版本升级至v2.4.0或更高版本。
      // event.name - TIM.EVENT.MESSAGE_REVOKED
      // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    });

    this.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
      // SDK 收到对端已读消息的通知，即已读回执。使用前需要将SDK版本升级至v2.7.0或更高版本。仅支持单聊会话。
      // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
      // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    });

    this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
      console.log("会话列表更新了")
      console.log(event.data)
    });

    this.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
    });

    this.tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
      // 收到自己或好友的资料变更通知
      // event.name - TIM.EVENT.PROFILE_UPDATED
      // event.data - 存储 Profile 对象的数组 - [Profile]
    });

    this.tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
      // 收到黑名单列表更新通知
      // event.name - TIM.EVENT.BLACKLIST_UPDATED
      // event.data - 存储 userID 的数组 - [userID]
    });

    this.tim.on(TIM.EVENT.ERROR, function (event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
    });

    this.tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
    });

    this.tim.on(TIM.EVENT.KICKED_OUT, function (event) {
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如 :
      //   - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //   - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //   - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）。
      console.log("被挤掉了")
    });

    this.tim.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
      // 网络状态发生改变（v2.5.0 起支持）。
      // event.name - TIM.EVENT.NET_STATE_CHANGE
      // event.data.state 当前网络状态，枚举值及说明如下：
      //   - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      //   - TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      //   - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
    });
    this.tim.on(TIM.EVENT.SDK_READY, function (event) {
      console.log("TIM is ready...")
      self.getMessageList()
      self.sendRecord()
    })

    // 开始登录
    this.tim.login({
      userID: userId,
      userSig: config.userSig
    });
  },
  getMessageList() {
    if (this.data.isCompleted) {
      return
    } else {
      if (!this.data.nextReqMessageID) {
        console.log("第一次拉取列表")
        // 打开某个会话时，第一次拉取消息列表
        let promise = this.tim.getMessageList({
          conversationID: this.data.conversationID,
          count: 15
        });
        promise.then((imResponse) => {
          const messageList = imResponse.data.messageList; // 消息列表。
          console.log("---------------------------")
          console.log(messageList)
          const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。

          this.setData({
            messageList,
            nextReqMessageID,
            isCompleted
          })
        });
      } else {
        // 下拉查看更多消息
        let promise = this.tim.getMessageList({
          conversationID: this.data.conversationID,
          nextReqMessageID: this.data.nextReqMessageID,
          count: 15
        });
        promise.then((imResponse) => {
          const messageList = imResponse.data.messageList; // 消息列表。
          const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
          const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
          this.setData({
            messageList: [...messageList, ...this.data.messageList],
            nextReqMessageID,
            isCompleted
          })
        });
      }
    }

  },
  sendRecord() {
    // 示例：使用微信官方的 RecorderManager 进行录音，参考 https://developers.weixin.qq.com/minigame/dev/api/media/recorder/RecorderManager.start.html
    // 1. 获取全局唯一的录音管理器 RecorderManager
    const recorderManager = wx.getRecorderManager();
    // // 录音部分参数
    // const recordOptions = {
    //   duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
    //   sampleRate: 44100, // 采样率
    //   numberOfChannels: 1, // 录音通道数
    //   encodeBitRate: 192000, // 编码码率
    //   format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
    // };

    // 2.1 监听录音错误事件
    recorderManager.onError((errMsg) => {
      console.warn('recorder error:', errMsg);
    });
    // 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      // 4. 创建消息实例，接口返回的实例可以上屏
      console.log(this.showCancelType)
      if(this.showCancelType === 3) {
        console.log("取消的不发送")
        return
      }
      const message = this.tim.createAudioMessage({
        to: this.data.customeId,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          file: res
        }
      });

      // 5. 发送消息
      let promise = this.tim.sendMessage(message);
      promise.then((imResponse) => {
        // 发送成功
        console.log(imResponse);
      }).catch((imError) => {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    });
  },
  startVolume: function (e) {
    this.startPageY = e.touches[0].clientY;
    const recorderManager = wx.getRecorderManager()
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  stopVolume() {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop();
  },
  onTouchMove(e) {
    if (this.startPageY - e.touches[0].clientY > 50) {
      console.log("上滑取消")
      //松开手指
      this.showCancelType = 3;
  } else {
      //上划取消
      this.showCancelType = 2;
  }
  }
})