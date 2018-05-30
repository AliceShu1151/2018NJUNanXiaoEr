// pages/message/message.js
let app = getApp();
let Bmob = app.globalData.Bmob;

Page({

	/**
	 * 页面的初始数据
	 */
	/*
	message分为两种：交易通知（transaction）和系统通知（system）
	交易通知有两种state：
	1、你发布的商品被别人置入想购买状态
	2、你与别的卖家完成交易，等待评价
  3、你与买家交易完成，收到交易成功消息通知
	系统通知有三种state：
	1、你的xx收藏品已被他人置入待购买行列
	2、你的xx收藏品已被他人买走
	3、你的xx收藏品已被卖家撤销上架，已从你的收藏列表移除
	*/
	data: {
		remind: '加载中',
		showModal: false,
		allSelected: false,
		noSelect: true,
		saveHidden: true,
		messageList: [],
		messageListLength: 0,
		comment: '',
		messageIndex: 0,
	},

	/*下面两个函数用于编辑消息列表*/
	editTap: function () {
		this.setData({
			saveHidden: false
		})
	},
	saveTap: function () {
		let that = this;

		that.setData({
			saveHidden: true
		});

		//取消全选
		that.setData({
			allSelected: false
		});
		let tmpMessageList = that.data.messageList;
		for (let i = 0; i < that.data.messageList.length; i++) {
			tmpMessageList[i].active = false;
		}
		that.setData({
			messageList: tmpMessageList,
		});
		that.isNoSelect();
		that.isAllSelected();
	},

	//判断有无被选中的消息对象
	isNoSelect: function () {
		let that = this;
		for (let i = 0; i < that.data.messageList.length; i++) {
			if (that.data.messageList[i].active && !that.data.saveHidden) {
				that.setData({
					noSelect: false
				});
				return;
			}
		}
		that.setData({
			noSelect: true
		});
	},

	//判断是否为全选状态
	isAllSelected: function () {
		for (let i = 0; i < this.data.messageList.length; i++) {
			if (!this.data.messageList[i].active) {
				this.setData({
					allSelected: false
				});
				return;
			}
		}
		this.setData({
			allSelected: true
		});
		//console.log(this.data.allSelected);
	},

	//单选
	selectTap: function (e) {
		let that = this;
		/*
		获取对应消息有关商品的买家和卖家信息
		*/
		let seller;
		let buyer;

		let tmpMessageList = that.data.messageList;
		if (!that.data.saveHidden) {
			if (!tmpMessageList[e.currentTarget.id].active) {
				tmpMessageList[e.currentTarget.id].active = true;
			}
			else {
				tmpMessageList[e.currentTarget.id].active = false;
			}
			that.setData({
				messageList: tmpMessageList,
			});
			that.isNoSelect();
			that.isAllSelected();
		}
		else {
			if (tmpMessageList[e.currentTarget.id].category == 'transaction') {
				if (tmpMessageList[e.currentTarget.id].state == 1) {
					wx.navigateTo({
						url: '../../pages/sellerInfo/sellerInfo?seller=' + tmpMessageList[e.currentTarget.id].buyer,
					});
				}
				else if (tmpMessageList[e.currentTarget.id].state == 2) {
					that.setData({
						showModal: true,
						messageIndex: e.currentTarget.id,
					});
					//console.log(e.currentTarget.id);
					//console.log(that.data.messageList[e.currentTarget.id].goodsObjectId);
				}
			}
		}
	},

	onCancel: function () {
		this.setData({
			showModal: false
		});
	},

	onConfirm: function () {
		/*
		在此处写
		对数据库进行的操作
		*/
		let that = this;
		that.setData({
			showModal: false
		});
		if (that.data.comment == ""){
			return;
		}
		let dbComments = Bmob.Query("comments");
		let messageIndex = that.data.messageIndex;
		let seller = that.data.messageList[messageIndex].seller;
		let goodsID = that.data.messageList[messageIndex].goodsObjectId;
		let dbUser = Bmob.Query("_User");
		let senderName = null;
		let sellerName = null;
		dbUser.equalTo("username", "==", seller);
		dbUser.find().then(res => {
			sellerName = res[0].nickName;
		}).then(res => {
			dbUser.equalTo("username", "==", app.globalData.userOpenId);
			return dbUser.find();
		}).then(res => {
			senderName = res[0].nickName;
		}).then(res => {
			dbComments.set("sender", app.globalData.userOpenId);
			dbComments.set("receiver", seller);
			dbComments.set("seller", sellerName);
			dbComments.set("buyer", senderName);
			dbComments.set("goodsID", goodsID);
			dbComments.set("content", that.data.comment);
			dbComments.save().then(res => {
				console.log(res);
			});
		}).then(res => {
      wx.showToast({
        title: '评论成功',
      });
    });
	},

	commentInput: function (e) {
		let that = this;
		that.setData({
			comment: e.detail.value
		});
	},

	//全选
	bindAllSelect: function () {
		let that = this;
		if (!that.data.saveHidden) {
			if (!that.data.allSelected) {
				//全选
				that.setData({
					allSelected: true
				});
				let tmpMessageList = that.data.messageList;
				for (let i = 0; i < that.data.messageList.length; i++) {
					tmpMessageList[i].active = true;
				}
				that.setData({
					messageList: tmpMessageList
				});
			}
			else {
				//取消全选
				that.setData({
					allSelected: false
				});
				let tmpMessageList = that.data.messageList;
				for (let i = 0; i < that.data.messageList.length; i++) {
					tmpMessageList[i].active = false;
				}
				that.setData({
					messageList: tmpMessageList
				});
			}
			that.isNoSelect();
			that.isAllSelected();
		}
	},

	deleteMessage: function () {
		let that = this;
		let tmpMessageList = [];
		let tmpMessageList_2 = [];
		if (!that.data.saveHidden) {
			for (let i = 0; i < that.data.messageList.length; i++) {
				if (!that.data.messageList[i].active) {
					tmpMessageList.push(that.data.messageList[i]);
				}
				else {
					tmpMessageList_2.push(that.data.messageList[i]);
				}
			}

			if (tmpMessageList_2.length > 0) {
				/*
				tmpMessageList_2储存着被选中的消息
				将这些消息从数据库中删除
				然后relaunch消息页
				*/
				let deleteQueue = new Array();
				let db = Bmob.Query("messages");
				for(let item of tmpMessageList_2){
					deleteQueue.push(item.objectId);
				}
				db.containedIn("objectId", deleteQueue);
				db.find().then(res => {
					res.destroyAll();
          that.setData({
            messageList: tmpMessageList,
          });
          wx.reLaunch({
            url: '../../pages/message/message',
          });
				})
			}
			else {
				wx.showModal({
					title: '提示',
					content: '未选中任何消息。'
				});
			}
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		/*
		获取用户的消息列表
		*/
		let that = this;
		let db = Bmob.Query("messages");
		db.equalTo("receiver", "==", app.globalData.userOpenId);
		db.order("-createdAt");
		db.find().then(res => {
			console.log(res);
			that.setData({
				messageListLength: res.length,
			});
			that.data.messageList = res;
			for (let item of that.data.messageList){
				item.active = false;
			}
			that.setData({
				messageList: that.data.messageList,
				remind: ''
			});
		});
		
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	}
})