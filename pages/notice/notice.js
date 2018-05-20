let app = getApp();
let Bmob = app.globalData.Bmob;

Page({
	data: {
		notice: [],
		objectId: null,
	},

	onLoad: function (options) {
		let that = this;
		that.data.objectId = options.noticeId;
		let db = Bmob.Query("notices");
		db.get(that.data.objectId).then(res => {
			that.setData({
				notice: res,
			});
		});
	},
})