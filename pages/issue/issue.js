// pages/issue/issue.js
let app = getApp();
Page({
  data: {
    urlArr: [],
    tempFilePaths: '',
    value: ['A'],
    items: [{ name: 'A', value: '化妆品' }, { name: 'B', value: '服饰装扮' }, { name: 'C', value: '食品饮料' }, { name: 'D', value: '演出门票' }, { name: 'E', value: '数码电子' }, { name: 'F', value: '其他' }]

  },

  //事件处理函数
  onLoad: function () {

  },
  onModalOpen() {

  },
  onModalClose() {

  },
  bindSelectorChange(e){

    this.setData({

      value: e.detail.value

    })

  },

  deleteImage: function (e) {
    // 获取本地显示的图片数组
    let that = this;
    let index = e.currentTarget.dataset.index;
    let urlArr = that.data.urlArr;
    urlArr.splice(index, 1);
    that.setData({
      urlArr: urlArr
    });
    console.log(that.data.urlArr)
  },

  upImg: function () {
    let that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        let tempFilePaths = res.tempFilePaths;
        let urlArr = that.data.urlArr;
        that.setData({
          tempFilePaths: res.tempFilePaths
        });
        // 启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        let uploadImgCount = 0;
        for (let i = 0, h = tempFilePaths.length; i < h; i++) {
          urlArr.push(tempFilePaths[i]);
          that.setData({
            urlArr: urlArr
        });
        console.log(urlArr);
        wx.uploadFile({
          url: "https://e663c7332cbc5d0c48349e5609048c99.bmobcloud.com",
          filePath: tempFilePaths[i],
          name: 'uploadfile_ant',
          formData: {
            'imgIndex': i
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            uploadImgCount++;
            let data = JSON.parse(res.data);
            //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
            let productInfo = that.data.productInfo;
            if (productInfo.bannerInfo == null) {
              productInfo.bannerInfo = [];
            }

            //返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            wx.uploadFile({
              url: "https://e663c7332cbc5d0c48349e5609048c99.bmobcloud.com",
              // url: 'http://www.website.com/home/api/uploadimg',
              filePath: tempFilePaths[i],
              name: 'file',

              success: function (res) {
                //打印
                console.log(res.data)
              }
            })
          }
        }) 
        }
      }
    })
  },

})