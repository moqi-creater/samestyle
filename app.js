App({
  onLaunch() {
    // 检查用户是否已登录
    const sessionKey = wx.getStorageSync('session_key');
    if (sessionKey) {
      // 用户已登录，可以进行后续操作
    } else {
      this.login();
    }
  },

  login() {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'https://your-server.com/login', // 替换为后端接口
            method: 'POST',
            data: {
              code: res.code
            },
            success: response => {
              if (response.data.success) {
                wx.setStorageSync('session_key', response.data.session_key);
                wx.setStorageSync('openid', response.data.openid);
                // 登录成功后可以跳转到其他页面
                wx.redirectTo({
                  url: '/pages/home/home' // 跳转到首页
                });
              }
            },
            fail: error => {
              console.error('请求失败', error);
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  }
});
