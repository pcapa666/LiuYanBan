"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userid: "",
      activeTab: true,
      CurrentTime: "",
      userInfo: {},
      list: [],
      onlist: []
    };
  },
  computed: {
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
    },
    getCommentNum() {
      return function(item) {
        return item.commentList.length;
      };
    },
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
    }
  },
  methods: {
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
    //调转顺序
    unlist() {
      this.activeTab = !this.activeTab;
      if (this.activeTab) {
        this.onlist = this.list.slice().reverse();
      } else {
        this.onlist = this.list;
      }
    },
    // 跳转到message
    toMessage(item) {
      common_vendor.index.navigateTo({
        url: `../message/message?message=${JSON.stringify(item)}`
      });
    },
    // 获取现在时间
    getCurrentTime() {
      const now = (/* @__PURE__ */ new Date()).getTime();
      this.CurrentTime = now;
    },
    goList(api) {
      console.log("调用了 goList() 函数！");
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "getMyCollect",
          token: common_vendor.index.getStorageSync("token")
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        this.list = res.result.message.data;
        this.onlist = res.result.message.data.slice().reverse();
        this.userid = res.result.userId;
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
    this.getCurrentTime();
    this.goList();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.onlist, (item, k0, i0) => {
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
    b: !this.onlist.length
  }, !this.onlist.length ? {} : {}, {
    c: common_vendor.o((...args) => $options.unlist && $options.unlist(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Not_Happy/Yang/pages/myCollect/myCollect.vue"]]);
wx.createPage(MiniProgramPage);
