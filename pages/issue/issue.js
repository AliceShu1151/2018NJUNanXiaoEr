// pages/issue/issue.js
let app = getApp();
let Bmob = app.globalData.Bmob;
Page({
	data: {
		/*
		yhr 5-17：
		在data中定义商品名、商品描述、商品价格、商品种类
		方便在函数方法中修改
		tempFilePaths应为列表而不是字符串，因为可能都是选择多个图片
		isFull用来判断是否已选择9张图，并隐藏上传图片按钮
    yhr 5-18:
    添加ableToClick，默认值为true
    点击提交后置位false
		*/
    ableToClick: true,
		isFull: false,
		product_name: '',
		product_description: '',
		product_price: null,
		//化妆品种类是默认值
		product_category: '化妆品',
		//urlArr: [],
		tempFilePaths: [],
		value: [],
		items: [{ name: 'A', value: '化妆品' }, { name: 'B', value: '服饰装扮' }, { name: 'C', value: '食品饮料' }, { name: 'D', value: '演出门票' }, { name: 'E', value: '数码电子' }, { name: 'F', value: '其他' }]

	},

	//事件处理函数
	onLoad: function () {

	},
	onModalOpen() {

	},
	onModalClose() {

	},

	/*
	yhr 5-17:
	获取商品名函方法
	*/
	productTitle: function (e) {
		let that = this;
		that.setData({
			product_name: e.detail.value
		});
		//console.log(that.data.product_name);
	},

	/*
	yhr 5-17:
	获取商品描述方法
	*/
	productDetail: function (e) {
		let that = this;
		that.setData({
			product_description: e.detail.value
		});
		//console.log(that.data.product_description);
	},

	/*
	yhr 5-17:
	获取商品价格方法
	*/
	productPrice: function (e) {
		let that = this;
		if (isNaN(Number(e.detail.value))) {
			wx.showModal({
				title: '提示',
				content: '价格输入必须为数字！',
			});
			that.setData({
				product_price: null
			});
			console.log(that.data.product_price);
		}
		else {
			that.setData({
				product_price: Number(e.detail.value)
			});
			//console.log(that.data.product_price);
		}
	},

	/*
	yhr 5-17:
	获取商品种类方法
	*/
	bindCheckboxChange: function (e) {
		let that = this;
		console.log(e.detail.value);
		if (e.detail.value.length != 0) {
			for (let i = 0; i < that.data.items.length; i++) {
				if (that.data.items[i].name == e.detail.value) {
					that.setData({
						product_category: that.data.items[i].value
					});
				}
			}
		}
		else {
			that.setData({
				product_category: '化妆品'
			});
		}
		console.log(that.data.product_category);
	},

	//上传图片的方法
	/*
	yhr 5-17:
	删除上传Loading框
	删除wx.uploadFile，应该在提交方法中调用该功能更为合适
	当已经选择9张图片时应隐藏上传按钮
	*/
	upImg: function () {
		let that = this;
		wx.chooseImage({
			count: 9, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				console.log(res);
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        let tempFilePaths = that.data.tempFilePaths;
        tempFilePaths.push(res.tempFilePaths);
				that.setData({
					tempFilePaths: tempFilePaths
				});
				if (res.tempFilePaths.length == 9) {
					that.setData({
						isFull: true
					});
				}
			}
		})
	},

	//删除已上传图片的方法
	/*
	yhr 5-17:
	不使用urlArr（有错）
	直接使用tempFilePaths
	*/
	deleteImage: function (e) {
		// 获取本地显示的图片数组
		let that = this;
		let index = e.currentTarget.dataset.index;
		let imagePaths = that.data.tempFilePaths;
		imagePaths.splice(index, 1);
		that.setData({
			tempFilePaths: imagePaths,
			isFull: false
		});
		//console.log(that.data.tempFilePaths);
	},

	/*
	yhr 5-17:
	新增提交方法
	为修改数据库的入口
	*/
	submit: function () {
    let that = this;
    if(that.data.ableToClick){
      if (that.data.tempFilePaths.length == 0) {
        wx.showModal({
          title: '提示',
          content: '上传的图片数量至少为一张！',
        });
      }
      else if (that.data.product_price == null || that.data.product_price <= 0) {
        wx.showModal({
          title: '提示',
          content: '请重新输入价格！',
        });
      }
      else if (that.data.product_description == '') {
        wx.showModal({
          title: '提示',
          content: '请输入商品描述！',
        });
      }
      else if (that.data.product_name == '') {
        wx.showModal({
          title: '提示',
          content: '请输入商品标题！',
        })
      }
      else {
        that.setData({
          ableToClick: false
        });
        /*
        对数据库的操作写在这里
        */
        let tempFilePaths = that.data.tempFilePaths;
        let file;
        let db = Bmob.Query("goods");
        console.log(that.data.product_name, that.data.product_price, that.data.product_description, that.data.product_category, app.globalData.userOpenId);
        db.set("name", that.data.product_name);
        db.set("price", that.data.product_price);
        db.set("description", that.data.product_description);
        db.set("category", that.data.product_category);
        db.set("seller", app.globalData.userOpenId);
        db.set("state", 0);
        db.set("clicks", 0);
        console.log("okokokokokokok");
        db.save().then(res => {
          let objectId = res.objectId;
          for (let item of tempFilePaths) {
            //console.log(item);
            file = Bmob.File("upload.jpg", item[0]);
          }
          console.log(file);
          file.save().then(res => {
            let db = Bmob.Query("goodsImgs");
            for (let item of res) {
              item = JSON.parse(item);
              //console.log(item);
              //console.log(item.url, objectId);
              db.set("imgUrl", item.url);
              db.set("goodsObjectId", objectId);
              db.save();
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1000
              });
              that.sleep(1200);
              wx.reLaunch({
                url: '../../pages/index/index',
              });
            }
          });
        });
      }
    }
	},

  sleep: function(sleepTime) {
    for(var start = Date.now(); Date.now() - start <= sleepTime; ) { } 
}

})