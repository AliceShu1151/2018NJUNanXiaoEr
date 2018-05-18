// pages/myIssuedGood/myIssuedGood.js
let app = getApp();

Page({

  data: {
    allSelected: false,
    saveHidden: true,
    userInfo: {},
    noSelect: true,
    /*
		issuedGood用于存储用户发布的商品信息
		active属性代表着是否被选中
		 */
    issuedGood: [
      {businessId: 0, name: "QAQ", price: 200, img: '../../images/goods01.png', clickTimes: 5, state: 1, active: false },
      {businessId: 1, name: "QAQ", price: 200, img: '../../images/goods02.png', clickTimes: 6, state: 1, active: false }
    ],
    issuedGoodLength: 1,
    totalPrice: ''
  },

  toIssuePage: function() {
    wx.navigateTo({
      url: '../../pages/issue/issue',
    });
  },

  /*下面两个函数用于编辑收藏列表*/
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
    let tmpIssuedGood = that.data.issuedGood;
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      tmpIssuedGood[i].active = false;
    }
    that.setData({
      issuedGood: tmpIssuedGood,
    });
    that.caculateTotalPrice();
    that.isNoSelect();
    that.isAllSelected();
  },

  //计算收藏商品总价，页面加载时调用
  caculateTotalPrice: function () {
    let that = this;
    let total = 0;
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      if (that.data.issuedGood[i].active) {
        total = total + that.data.issuedGood[i].price;
      }
    }
    that.setData({
      totalPrice: total
    });
  },

  //判断有无被选中的商品对象
  isNoSelect: function () {
    let that = this;
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      if (that.data.issuedGood[i].active) {
        that.setData({
          noSelect: false
        });
        return;
      }
      else {
        that.setData({
          allSelected: false
        });
      }
    }
    that.setData({
      noSelect: true,
    });
  },

  //判断是否为全选状态
  isAllSelected: function () {
    let that = this;
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      if (!that.data.issuedGood[i].active) {
        that.setData({
          allSelected: false
        });
        return;
      }
    }
    that.setData({
      allSelected: true
    });
    //console.log(this.data.allSelected);
  },

  //单选
  selectTap: function (e) {
    //console.log(e.currentTarget.id);
    let that = this;
    let tmpIssuedGood = that.data.issuedGood;
    if (!tmpIssuedGood[e.currentTarget.id].active) {
      if(tmpIssuedGood[e.currentTarget.id].state == 0){
        //若商品state为0，则无人想购买，非编辑状态下无法选中
        wx.showModal({
          title: '提示',
          content: '该商品无人求购，在非编辑状态下无法选中',
        });
      }
      else if(tmpIssuedGood[e.currentTarget.id].state == 1){
        tmpIssuedGood[e.currentTarget.id].active = true;
      }
    }
    else {
      tmpIssuedGood[e.currentTarget.id].active = false;
    }
    that.setData({
      issuedGood: tmpIssuedGood,
    });
    that.caculateTotalPrice();
    that.isNoSelect();
    that.isAllSelected();
  },

  bindAllSelect: function () {
    let that = this;
    //count用于判断收藏列表中是否有已被置于待够列表的商品
    let count = 0;
    if (!that.data.allSelected) {
      //全选
      that.setData({
        allSelected: true
      });
      let tmpIssuedGood = that.data.issuedGood;
      for (let i = 0; i < that.data.issuedGood.length; i++) {
        //同上个单选函数，也在第一个if语句进行修改
        if (that.data.saveHidden && that.data.issuedGood[i].state == 1) {
          tmpIssuedGood[i].active = true;
        }
        else if (that.data.saveHidden && that.data.issuedGood[i].state == 0) {
          count += 1;
        }
        else if (!that.data.saveHidden) {
          tmpIssuedGood[i].active = true;
        }
      }
      if (count >= 1) {
        wx.showModal({
          title: '提示',
          content: '存在选中的商品无人求购，在非编辑状态下无法选中',
        })
      }
      that.setData({
        issuedGood: tmpIssuedGood,
      });
    }
    else {
      //取消全选
      that.setData({
        allSelected: false
      });
      let tmpIssuedGood = that.data.issuedGood;
      for (let i = 0; i < that.data.issuedGood.length; i++) {
        tmpIssuedGood[i].active = false;
      }
      that.setData({
        issuedGood: tmpIssuedGood,
      });
    }
    that.caculateTotalPrice();
    that.isNoSelect();
    that.isAllSelected();
  },

  /*
  交易完成方法
  将选中商品的state改为2，即完成交易
  并修改数据库
  然后重新获取issuedGood数据，重新渲染此页面
  */
  completeTransaction: function() {
    let that = this;
    let tmpIssuedGood = [];
    //tmpIssuedGood_2存储被选中的商品信息
    let tmpIssuedGood_2 = [];
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      if (that.data.issuedGood[i].active) {
        tmpIssuedGood_2.push(that.data.issuedGood[i]);
      }
    }

    if(tmpIssuedGood_2.length == 0){
      //没有被选中的商品
      wx.showModal({
        title: '提示',
        content: '没有选中任何商品',
      });
    }
    else{
      wx.showModal({
        title: '提示',
        content: '确认交易完成？',
        success: function(res) {
          /*
          tmpIssuedGood_2存储着被选中的商品信息
          在此处对数据库进行操作
          然后重新获取数据库信息修改data
          */
        }
      });
    }
  },

  /*
  撤销发布商品方法
  将选中的商品从数据库中删除
  再重新获取数据加载页面
  */
  cancelIssued: function() {
    let that = this;
    let tmpIssuedGood = [];
    let tmpIssuedGood_2 = [];
    for (let i = 0; i < that.data.issuedGood.length; i++) {
      if (!that.data.issuedGood[i].active) {
        tmpIssuedGood.push(that.data.issuedGood[i]);
      }
      else {
        tmpIssuedGood_2.push(that.data.issuedGood[i]);
      }
    }

    if(tmpIssuedGood_2.length == 0){
      wx.showModal({
        title: '提示',
        content: '未选中任何收藏商品。'
      });
    }
    else{
      wx.showModal({
        title: '提示',
        content: '撤销发布会将商品从数据库中删除，您确定要撤销吗？',
        success: function(res) {
        /*
        tmpIssuedGood_2存储着被选中的商品信息
        在此处对数据库进行操作
        删除对应商品的数据
        并重新获取数据库数据来渲染页面
        */
        }
      });
    }
  },

  onLoad: function() {
    /*
    从数据库获取商品信息
    */
    this.setData({
      issuedGoodLength: this.data.issuedGood.length,
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})