// components/image-message/image-message.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageInfo: {
      type: Object,
      value: {},
      observer: function(newVal,oldVal) {
        var imageUrl = newVal.payload.imageInfoArray[0]
        this.setData({
          message: newVal.payload,
          imageUrl: imageUrl
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    message: {},
    imageUrl: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImage() {
      const imageUrl = this.data.imageUrl
      wx.previewImage({
        urls: [imageUrl.imageUrl],
        current: imageUrl.imageUrl,
        success: (res) => {},
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  }
})
