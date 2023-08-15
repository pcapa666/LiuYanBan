"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      myCollect: 0,
      myMessage: 0,
      userInfo: {
        nickName: "微信用户",
        avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
        // 默认头像图片地址
      }
    };
  },
  onShareAppMessage: function() {
    return {
      title: "浩的留言板",
      path: "/pages/index/index"
    };
  },
  onShareTimeline() {
    return {
      title: "浩的留言板",
      path: "/pages/index/index"
    };
  },
  methods: {
    //意见反馈
    onSuggestion() {
      common_vendor.index.navigateTo({
        url: `../suggestion/suggestion`
      });
    },
    //收藏点击
    toMyCollect() {
      common_vendor.index.navigateTo({
        url: `../myCollect/myCollect`
      });
    },
    //动态点击
    toMyMessage() {
      common_vendor.index.navigateTo({
        url: `../myMessage/myMessage`
      });
    },
    //修改资料
    getLocation() {
      common_vendor.index.navigateTo({
        url: `../login/login?userInfo=${JSON.stringify(this.userInfo)}`
      });
    },
    //获取用户信息
    getUserInfo() {
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "getUserInfo",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        this.userInfo = res.result;
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error"
        });
      });
    },
    //获取动态数量
    getMyMessage() {
      console.log("调用了 getMyMessage() 函数！");
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "getMyMassage",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        this.myMessage = res.result.message.data.length;
        this.getMyCollect();
        this.getUserInfo();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "error"
        });
      });
    },
    //获取收藏数量
    getMyCollect() {
      console.log("调用了 getMyCollect() 函数！");
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "getMyCollect",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        this.myCollect = res.result.message.data.length;
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "error"
        });
      });
    }
  },
  onShow() {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
    this.getMyMessage();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatarUrl,
    b: common_vendor.t($data.userInfo.nickName),
    c: $data.userInfo.sexIndex == 1,
    d: $data.userInfo.sexIndex == 2,
    e: $data.userInfo.sexIndex == 3,
    f: common_vendor.o((...args) => $options.getLocation && $options.getLocation(...args)),
    g: common_vendor.t($data.myMessage),
    h: common_vendor.o((...args) => $options.toMyMessage && $options.toMyMessage(...args)),
    i: common_vendor.t($data.myCollect),
    j: common_vendor.o((...args) => $options.toMyCollect && $options.toMyCollect(...args)),
    k: common_vendor.o((...args) => _ctx.onServiceTap && _ctx.onServiceTap(...args)),
    l: common_vendor.o((...args) => $options.onSuggestion && $options.onSuggestion(...args)),
    m: common_vendor.o((...args) => _ctx.onRecommendTap && _ctx.onRecommendTap(...args)),
    n: common_vendor.o((...args) => _ctx.onDonateTap && _ctx.onDonateTap(...args)),
    o: common_vendor.o((...args) => _ctx.onDonateTap && _ctx.onDonateTap(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Not_Happy/Yang/pages/my/my.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
