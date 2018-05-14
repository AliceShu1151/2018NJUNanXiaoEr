Page({
  data: {
   seller: ''
  },

  onLoad: function(options) {
    var that = this;
    that.setData({
      seller: options.seller
    })
  }
})