// components/text-message/text-message.js
import { decodeText } from '../../utils/decodeText'
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
          message: decodeText(newVal.payload)
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

  }
})
