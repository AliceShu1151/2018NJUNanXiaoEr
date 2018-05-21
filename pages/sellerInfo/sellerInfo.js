let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
  data: {
    userInfo: {},
    seller: ''
  },

  onLoad(options) {
    let that = this;
    var seller = options.seller;
    console.log(seller);
    let db = Bmob.Query("_User");
    db.equalTo("username", "==", seller);
    db.find().then(res => {
    // db.get(seller).then(res => {
      that.setData({
        userInfo: res[0]
      });
      console.log(that.data.userInfo);
    });
  },
})