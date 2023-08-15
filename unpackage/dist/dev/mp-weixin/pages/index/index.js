"use strict";
const common_vendor = require("../../common/vendor.js");
const Modal = () => "../../components/modal/modal.js";
const _sfc_main = {
  components: {
    Modal
  },
  data() {
    return {
      activeTab: "zuixin",
      show: false,
      content: "",
      list: [],
      onlist: [],
      userid: "",
      CurrentTime: "",
      userInfo: {
        avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
        nickName: "微信用户"
      }
    };
  },
  computed: {
    //消息内时间计算
    getMessageTime() {
      return function(msg) {
        const now = new Date(this.CurrentTime);
        const msgTime = new Date(msg);
        let nowYear = now.getFullYear();
        let msgYear = msgTime.getFullYear();
        let msgMonth = ("0" + (msgTime.getMonth() + 1)).slice(-2);
        let msgDate = ("0" + msgTime.getDate()).slice(-2);
        msgTime.getHours() < 10 ? msgTime.getHours() : ("0" + msgTime.getHours()).slice(-2);
        msgTime.getMinutes() < 10 ? msgTime.getMinutes() : ("0" + msgTime.getMinutes()).slice(-2);
        if (nowYear == msgYear) {
          let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
          if (nowMonth == msgMonth) {
            let nowDate = ("0" + now.getDate()).slice(-2);
            if (nowDate == msgDate) {
              const diff = now.getTime() - msgTime.getTime();
              const minutes = Math.floor(diff / 6e4);
              const hours = Math.floor(minutes / 60);
              if (hours > 0) {
                return `${hours}小时前`;
              } else if (minutes > 0) {
                return `${minutes}分钟前`;
              } else {
                return "刚刚";
              }
            } else if (nowDate - msgDate == 1) {
              return "昨天";
            } else if (nowDate - msgDate == 2) {
              return "前天";
            } else if (nowDate - msgDate >= 3 && nowDate - msgDate <= 7) {
              let num = nowDate - msgDate;
              return num + "天前";
            } else
              return "本月";
          } else
            return msgMonth + "月" + msgDate + "日";
        } else
          return msgYear + "年" + msgMonth + "月" + msgDate + "日";
      };
    },
    //评论数量
    getCommentNum() {
      return function(item) {
        return item.commentList.length;
      };
    },
    //判断点赞
    getOnGood() {
      return function(item) {
        if (item.good.userid.indexOf(this.userid) !== -1) {
          return true;
        } else {
          return false;
        }
      };
    },
    //判断收藏
    getOnCollect() {
      return function(item) {
        if (item.shouChang.indexOf(this.userid) !== -1) {
          return true;
        } else {
          return false;
        }
      };
    }
  },
  onShow() {
    this.getCurrentTime();
    let that = this;
    common_vendor.index.removeStorageSync("token");
    let token = common_vendor.index.getStorageSync("token");
    common_vendor.index.showLoading({
      title: "加载中..."
    });
    if (!token) {
      console.log("妹有token要登录");
      common_vendor.index.login({
        provider: "weixin",
        success(loginRes) {
          let code = loginRes.code;
          common_vendor.Ds.callFunction({
            name: "fun",
            data: {
              api: "goLogin",
              code,
              userInfo: that.userInfo
            }
          }).then((res) => {
            common_vendor.index.hideLoading();
            token = res.result.token;
            common_vendor.index.setStorageSync("token", token);
            that.goList();
          }).catch(() => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "登录失败",
              icon: "error"
            });
          });
        }
      });
    } else {
      console.log("有token");
      this.goList();
    }
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
    // 评论跳转
    toMessage(item) {
      common_vendor.index.navigateTo({
        url: `../message/message?message=${JSON.stringify(item)}`
      });
    },
    // 收藏
    onCollect(item, e) {
      common_vendor.index.showLoading({
        title: "收藏..."
      });
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "onCollect",
          token: common_vendor.index.getStorageSync("token"),
          _id: item._id
        }
      }).then((res) => {
        this.goList();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "失败",
          icon: "error"
        });
      });
    },
    // 点赞
    onGood(item, e) {
      common_vendor.index.showLoading({
        title: "点赞中..."
      });
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "onGood",
          token: common_vendor.index.getStorageSync("token"),
          _id: item._id
        }
      }).then((res) => {
        this.goList();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "失败",
          icon: "error"
        });
      });
    },
    //改变或刷新 最新推荐
    change(value) {
      if (value)
        this.activeTab = value;
      if (this.activeTab === "zuixin") {
        this.onlist = this.list.slice().reverse();
      } else {
        this.onlist.sort((a, b) => {
          return b.good.num - a.good.num;
        });
      }
    },
    //关闭窗口
    closeModal() {
      this.show = false;
    },
    //发表点击
    showModal() {
      this.show = true;
    },
    // 获取时间
    getCurrentTime() {
      const now = (/* @__PURE__ */ new Date()).getTime();
      this.CurrentTime = now;
    },
    // 获取页面数据
    goList(api) {
      console.log("调用了 goList() 函数！");
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: api || "getMassage",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        this.list = res.result.message.data;
        this.onlist = res.result.message.data.slice().reverse();
        this.userInfo = res.result.userInfo;
        this.userid = res.result.userId;
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "获取数据失败",
          icon: "error"
        });
      });
    },
    //发送留言
    publish(message) {
      this.getCurrentTime();
      common_vendor.index.showLoading({
        title: "发送中..."
      });
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "publish",
          content: message,
          userInfo: this.userInfo,
          token: common_vendor.index.getStorageSync("token"),
          CurrentTime: this.CurrentTime
        }
      }).then((res) => {
        this.goList();
        this.change();
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "操作成功",
          icon: "success"
        });
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "error"
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_modal2 = common_vendor.resolveComponent("modal");
  _easycom_modal2();
}
const _easycom_modal = () => "../../components/modal/modal.js";
if (!Math) {
  _easycom_modal();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatarUrl,
    b: common_vendor.t($data.userInfo.nickName),
    c: $data.activeTab == "tuijian" ? 1 : "",
    d: common_vendor.o(($event) => $options.change("tuijian")),
    e: $data.activeTab == "zuixin" ? 1 : "",
    f: common_vendor.o(($event) => $options.change("zuixin")),
    g: common_vendor.f($data.onlist, (item, k0, i0) => {
      return {
        a: item.userInfo.avatarUrl,
        b: common_vendor.t(item.userInfo.nickName),
        c: item.userInfo.sexIndex == 1,
        d: item.userInfo.sexIndex == 2,
        e: item.userInfo.sexIndex == 3,
        f: common_vendor.t(item.content),
        g: common_vendor.t($options.getMessageTime(item.CurrentTime)),
        h: common_vendor.o(($event) => $options.onCollect(item, $event), item._id),
        i: $options.getOnCollect(item),
        j: common_vendor.o(($event) => $options.onCollect(item, $event), item._id),
        k: !$options.getOnCollect(item),
        l: common_vendor.t(item.good.num),
        m: common_vendor.o(($event) => $options.onGood(item, $event), item._id),
        n: $options.getOnGood(item),
        o: common_vendor.t(item.good.num),
        p: common_vendor.o(($event) => $options.onGood(item, $event), item._id),
        q: !$options.getOnGood(item),
        r: common_vendor.t($options.getCommentNum(item)),
        s: common_vendor.o(($event) => $options.toMessage(item), item._id),
        t: item._id
      };
    }),
    h: common_vendor.o((...args) => $options.showModal && $options.showModal(...args)),
    i: common_vendor.o($options.closeModal),
    j: common_vendor.o($options.publish),
    k: $data.show
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/Not_Happy/Yang/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
