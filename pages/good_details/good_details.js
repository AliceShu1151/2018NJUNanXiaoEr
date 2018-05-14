//获取小程序实例
var app = getApp();

Page({
  data: {
    businessId: '',
    //此处good_data只是一个demo
    good_data: {
      name: '香水',
      price: '200',
      viewTimes: '12',
      seller: '翔哥',
      describe_text: 'qwiuyewq yesh  qe wqoue wqoe ',
      pics: ['../../images/goods01.png', '../../images/goods02.png']
    },
    userInfo: {}
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      businessId: options.businessId,
      userInfo: app.globalData.userInfo
    });
    //console.log(that.data.userInfo);

    /*
    此处编写函数来获取data中的good_data
    这是一个object类型的变量
    他的properties有名称、文字描述、图片等
    */
  },

   /*
    seller为用户的唯一标识
    并传递到卖家信息页面
    */
  toSellerInfo: function() {
    var that = this;
    console.log(that.data.good_data.seller);
    wx.navigateTo({
      url: '../../pages/sellerInfo/sellerInfo?seller='+that.data.good_data.seller
    });
  },

  /*
  跳转到收藏页面
  不需要传参
    */
  toMyCollection: function() {
    wx.navigateTo({
      url: '../../pages/myCollection/myCollection'
    });
  },

  /*
  把商品添加到个人收藏列表
  */
  toAddCollection: function() {
    /*
    使用userInfo和businessId查询收藏表
    检测是否收藏过
    若未收藏过则往表中添加数据
    */
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1000
    })
  },

  /*
  将物品置为待购状态
  商品不会再被其他用户设为代购状态
  同时修改商品表中的属性
  */
  toBuy: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '点击“我想购买”后，该商品将无法被其他用户购买，请务必尽快与卖家联系。',
      success: function(res){
        if(res.confirm){
          //对商品表进行修改
          //并跳转至卖家信息页
          wx.navigateTo({
            url: '../../pages/sellerInfo/sellerInfo?seller=' + that.data.good_data.seller
          });
        }
        else if(res.cancel){
        }
      }
    })
  }
})