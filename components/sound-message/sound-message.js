// components/sound-message/sound-message.js
const InnerAudioContext = getApp().globalData.InnerAudioContext
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageInfo: {
      type: Object,
      value: {},
      observer: function(newVal,oldVal) {
        
        this.setData({
          message: newVal.payload
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playAudio() {
      if(InnerAudioContext.src === this.data.message.url) {
        InnerAudioContext.play()
      } else {
        InnerAudioContext.src = this.data.message.url
      }
    }
  }
})
