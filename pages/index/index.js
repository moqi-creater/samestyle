Page({
  data: {
    phone: '',     // 用户输入的手机号
    code: '',      // 用户输入的验证码
    isCodeSent: false,  // 是否已发送验证码
    errorMsg: '',  // 错误信息
  },

  // 处理手机号输入
  onPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value,
    });
  },

  // 处理验证码输入
  onCodeInput: function (e) {
    this.setData({
      code: e.detail.value,
    });
  },

  // 获取验证码
  getCode: function () {
    const { phone } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      });
      return;
    }

    wx.request({
      url: '/user/code',  // 后端接口（这里到底该怎么写）
      method: 'POST',
      data: { phone },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
          });
          this.setData({
            isCodeSent: true,  // 更新验证码已发送
          });
        } else {
          wx.showToast({
            title: '发送失败，请重试',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none',
        });
      },
    });
  },

  // 登录操作
  login: function () {
    const { phone, code } = this.data;
    if (!phone || !code) {
      wx.showToast({
        title: '请输入手机号和验证码',
        icon: 'none',
      });
      return;
    }

    wx.request({
      url: '/user/login',  // 后端接口
      method: 'POST',
      data: { phone, code },
      success: (res) => {
        if (res.data.success) {
          // 登录成功，保存 token
          wx.setStorageSync('token', res.data.data.token);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
          });
          // 跳转到首页或者其他页面
          wx.reLaunch({
            url: '/pages/home/home',  // 跳转主页
          });
        } else {
          wx.showToast({
            title: res.data.errorMsg || '登录失败，请重试',
            icon: 'none',
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none',
        });
      },
    });
  },
});
