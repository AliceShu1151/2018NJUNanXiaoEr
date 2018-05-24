let app = getApp();
let Bmob = app.globalData.Bmob;

Page({
  data: {
    notice: [],
    content: [],
    objectId: null,
  },

  onLoad: function (options) {
    let that = this;
    let content = new Array();
    that.data.objectId = options.noticeId;
    let db = Bmob.Query("notices");
    db.get(that.data.objectId).then(res => {
      that.setData({
        notice: res,
        content: res.content.split("<br>")
      });
    });
    console.log(that.data)
  },
})