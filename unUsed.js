	/**岳翔 5-19
	 * 之前用云函数成功造了个getOpenId的轮子，现在直接改为用官方接口，以下是旧代码
	 * 不禁吐槽一句：这个api只在一个过时的小程序demo中出现过，一次偶然被强行检索到了
	 * 没有任何文档记录这个神奇的接口，包括官网的官方文档
	 * 而且这个requestOpenId在Demo中的用法是两个参数
	 * 实际应该只填一个参数然后返回Promise结果
	 * 这些开源api的工作者对于维护文档工作任重而道远……
	 * 如果说有什么值得纪念，应该是看懂了微信获取openid的流程
	 * wx.login() -> 获取登录态code -> 发送code至微信服务器 ->获取openId
	 * 如果深入研究还可以获取到unionId，不过流程更繁琐
		getUserOpenId() {
			let that = this;
			wx.login({
				success: res => {
					let appID = "wx210839d33ea2e4dc";
					let appSecret = "307e15cfe15abbc9cd6321adbf73b205";
					let code = res.code;
					//let url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appID + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=authorization_code";
					let url = 'https://cloud.bmob.cn/c415a33732ba7759/getOpenID?appid=' + appID + '&appsecret=' + appSecret + '&code=' + code;
					//console.log(url);
					//console.log(Bmob);
					wx.request({
						//format: http://cloud.bmob.cn/{Secret Key}/{云函数名}?{参数名}={值}&{参数名}={值}…
						url: url,
						success: res => {
							//let that = this;
							that.globalData.userOpenId = res.data.openid;
							//console.log(that.globalData.userOpenId);
							let Bmob = that.globalData.Bmob;
							const db = Bmob.Query("users");
							let userOpenId = that.globalData.userOpenId;
							//console.log(userOpenId);
							db.equalTo("userOpenId", "==", userOpenId);
							db.find().then(res => {
								if (res.length == 0) {
									res.set("userOpenId", userOpenId);
									res.save();
								}
							});
						},
					})
				}
			});

		},
	*/
