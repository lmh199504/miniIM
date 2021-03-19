// app.js
const InnerAudioContext = wx.createInnerAudioContext()
InnerAudioContext.autoplay = true
InnerAudioContext.onTimeUpdate(() => {
  console.log("播放中")
})
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    InnerAudioContext,
  }
})
