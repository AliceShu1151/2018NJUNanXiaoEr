let app = getApp()
let Bmob = app.globalData.Bmob;

Page({
  data: {
    userInfo: {},
	gender: '',
	showNickName: false,
	nick: ''
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
        userInfo: res[0],
		gender: app.globalData.userInfo.gender,
		nickName: app.globalData.userInfo.nickName
      });
	  if (that.data.userInfo.userRealName == '' || that.data.userInfo.userRealName === undefined){
		  that.setData({
				showNickName: true
		  });
	  }
      console.log(that.data.userInfo.userRealName);
    });
  },
})