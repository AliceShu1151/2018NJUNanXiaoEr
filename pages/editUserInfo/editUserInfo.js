// pages/my/mySetting/mySetting.js
let app = getApp();
let Bmob = app.globalData.Bmob;
Page({
	data: {
		userWechat: '',
		userQQ: '',
		userPhone: '',
		userUniversity: '',
		userCollege: '',
		userEducation: '',
		userEntryYear: '',
		buttonLoading: false,
		university: ["南京大学"],
		universityIndex: 0,
		college: ["计算机科学与技术系", "文学院", "哲学系", "历史学院", "物理学院", "数学系", "天文与空间科学学院", "地球科学与工程学院", "大气科学学院", "地理与海洋科学学院", "电子科学与工程学院", "现代工程与应用科学学院", "新闻传播学院", "商学院", "外国语学院", "法学院", "生命科学学院", "政府管理学院", "马克思主义学院", "信息管理学院", "社会学院", "艺术学院", "河仁社会慈善学院", "化学化工学院", "环境学院", "医学院", "软件学院", "工程管理学院", "匡亚明学院", "外语部", "体育部", "艺术研究院", "中美文化研究中心", "建筑与城市规划学院", "海外教育学院", "创新创业学院", "美术研究院", "教育研究院", "中华文化研究院", "能源科学研究院", "模式动物研究所", "人工智能学院"],
		collegeIndex: 0,
		education: ["本科生", "硕士研究生", "博士研究生"],
		educationIndex: 0,
		entryYear: ["2012", "2013", "2014", "2015", "2016", "2017", "2018"],
		entryYearIndex: 4,
		birthdayDate: "1998-7-4",
		userRealName: "",
		selfIntroduction: "",
		userMail: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		let that = this;
		this.setData({
			userUniversity: this.data.university[0],
			userCollege: this.data.college[0],
			userEducation: this.data.education[0],
			userEntryYear: this.data.entryYear[4],
			userWechat: '',
			userQQ: '',
			userPhone: ''
		})
		let db = Bmob.Query("_User");
		db.get(app.globalData.userObjectId).then(res => {
			if (res.university) {
				that.setData({
					userUniversity: res.university,
					universityIndex: that.data.university.indexOf(res.university)
				});
			}
			if (res.college) {
				that.setData({
					userCollege: res.college,
					collegeIndex: that.data.college.indexOf(res.college)
				});
			}
			if (res.education) {
				that.setData({
					userEducation: res.education,
					educationIndex: that.data.education.indexOf(res.education)
				});
			}
			if (res.entryYear) {
				that.setData({
					userEntryYear: res.entryYear,
					entryYearIndex: that.data.entryYear.indexOf(res.entryYear)
				});
			}
			if (res.birthdayDate){
				that.setData({
					birthdayDate: res.birthdayDate
				});
			}
			if (res.wechatId) {
				that.setData({
					userWechat: res.wechatId,
				});
			}
			if (res.QQ) {
				that.setData({
					userQQ: res.QQ,
				});
			}
			if (res.mobilePhoneNumber) {
				that.setData({
					userPhone: res.mobilePhoneNumber,
				});
			}
			if(res.email){
				that.setData({
					userMail: res.email
				});
			}
			if (res.selfIntroduction){
				that.setData({
					selfIntroduction: res.selfIntroduction
				});
			}
			if (res.userRealName){
				that.setData({
					userRealName: res.userRealName
				});
			}
		});		
	},

	/*
	bindUniversityChange: function (e) {
		console.log(university);
		this.setData({
			universityIndex: e.detail.value,
			userUniversity: this.data.university[this.data.universityIndex]
		})
	},*/

	bindCollegeChange: function (e) {
		this.setData({
			collegeIndex: e.detail.value,
			userCollege: this.data.college[e.detail.value]
		});
		//console.log(this.data.userCollege);
	},

	bindEducationChange: function (e) {
		this.setData({
			educationIndex: e.detail.value,
			userEducation: this.data.education[e.detail.value]
		});
		//console.log(this.data.userEducation);
	},

	bindEntryYearChange: function (e) {
		this.setData({
			entryYearIndex: e.detail.value,
			userEntryYear: this.data.entryYear[e.detail.value]
		});
		//console.log(this.data.userEntryYear);
	},

	bindBirthdayDateChange: function (e) {
		this.setData({
			birthdayDate: e.detail.value,
		});
		//console.log(this.data.birthdayDate);
	},

	bindEmailInput: function(e) {
		this.setData({
			userMail: e.detail.value
		});
		//console.log(this.data.userMail);
	},

	/*
	yhr 5-20:
	邮箱验证
	*/
	toVerifyEmail: function() {
		let reg = /^([0-9])+@smail.nju.edu.cn+/;
		//console.log(reg.test(this.data.userMail));
		if(reg.test(this.data.userMail)){
			/*
			正则表达匹配成功
			调用云函数进行邮箱验证
			*/
		}
		else{
			wx.showModal({
				title: '提示',
				content: '您填入的不是南京大学学生邮箱地址！请重新填写。',
			});
		}
	},

	bindSelfIntroduction: function (e) {
		this.setData({
			selfIntroduction: e.detail.value
		});
		//console.log(this.data.selfIntroduction)
	},

	bindRealNameInput: function(e) {
		this.setData({
			userRealName: e.detail.value
		});
		//console.log(this.data.userRealName);
	},

	bindWechatInput: function (e) {
		this.setData({
			userWechat: e.detail.value
		});
		//console.log(this.data.userWechat);
	},

	bindQQInput: function (e) {
		this.setData({
			userQQ: e.detail.value
		});
	},

	bindPhoneInput: function (e) {
		this.setData({
			userPhone: e.detail.value
		});
	},
	
	bindSubmit: function () {
		let that = this;
		this.setData({
			buttonLoading: true
		})
		let db = Bmob.Query("_User");
		db.get(app.globalData.userObjectId).then(res => {
			res.set("wechatId", that.data.userWechat);
			res.set("QQ", that.data.userQQ);
			res.set("mobilePhoneNumber", that.data.userPhone);
			res.set("university", that.data.userUniversity);
			res.set("college", that.data.userCollege);
			res.set("education", that.data.userEducation);
			res.set("entryYear", that.data.userEntryYear);
			res.set("email", that.data.userMail);
			res.set("selfIntroduction", that.data.selfIntroduction);
			res.set("userRealName", that.data.userRealName);
			res.set("birthdayDate", that.data.birthdayDate);
			res.save();
			that.setData({
				buttonLoading: false
			});
			wx.showToast({
				title: '修改成功',
				icon: 'success',
				duration: 1500,
			});
		});
	},
})