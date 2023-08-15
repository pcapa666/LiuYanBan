"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userid: "",
      content: "",
      userInfo: {},
      nowTime: "",
      message: {
        CurrentTime: "",
        content: "内容加载中...",
        userInfo: {
          nickName: "微信用户",
          avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
          // 默认头像图片地址
        },
        commentList: [],
        good: {
          num: 0,
          userid: []
        },
        shouChang: []
      }
    };
  },
  computed: {
    getOnGood() {
      if (this.message.good.userid.indexOf(this.userid) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    //判断收藏
    getOnCollect() {
      if (this.message.shouChang.indexOf(this.userid) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    //消息内时间计算
    getMessageTime() {
      return function(msg) {
        const now = new Date(this.nowTime);
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
        return item.length;
      };
    }
  },
  methods: {
    // 收藏
    onCollect() {
      common_vendor.index.showLoading({
        title: "收藏..."
      });
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "onCollect",
          token: common_vendor.index.getStorageSync("token"),
          _id: this.message._id
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        this.getMessage();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "失败",
          icon: "error"
        });
      });
    },
    // 点赞
    onGood() {
      common_vendor.index.showLoading({
        title: "点赞中..."
      });
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "onGood",
          token: common_vendor.index.getStorageSync("token"),
          _id: this.message._id
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        this.getMessage();
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "失败",
          icon: "error"
        });
      });
    },
    //获取头像昵称数据
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
    //发送评论
    onSend() {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      if (this.content != "") {
        common_vendor.Ds.callFunction({
          name: "fun",
          data: {
            api: "goComment",
            token: common_vendor.index.getStorageSync("token"),
            userInfo: this.userInfo,
            msgTime: this.nowTime,
            content: this.content,
            _id: this.message._id
          }
        }).then(() => {
          this.message.commentList.push(
            {
              userInfo: this.userInfo,
              msgTime: this.nowTime,
              content: this.content
            }
          );
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "发送成功",
            icon: "success"
          });
          this.getMessage();
          this.content = "";
        });
      } else {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "请输入文字",
          icon: "none"
        });
      }
    },
    //获取现在时间
    getCurrentTime() {
      const now = (/* @__PURE__ */ new Date()).getTime();
      this.nowTime = now;
      this.getMessage();
    },
    //拿动态详情
    getMessage() {
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "getDetailedMessage",
          token: common_vendor.index.getStorageSync("token"),
          _id: this.message._id
        }
      }).then((res) => {
        this.message = res.result.message.data[0];
        this.userid = res.result.userId;
      }).catch((err) => {
        console.log(err);
        common_vendor.index.showToast({
          title: "获取画面失败",
          icon: "error"
        });
      });
    }
  },
  onShow() {
    this.getCurrentTime();
  },
  onLoad(option) {
    common_vendor.index.showLoading({
      title: "加载中..."
    });
    const message = JSON.parse(option.message);
    this.message = message;
    this.getUserInfo();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.message.userInfo.avatarUrl,
    b: common_vendor.t($data.message.userInfo.nickName),
    c: $data.message.userInfo.sexIndex == 1,
    d: $data.message.userInfo.sexIndex == 2,
    e: $data.message.userInfo.sexIndex == 3,
    f: common_vendor.t($data.message.content),
    g: common_vendor.t($options.getMessageTime($data.message.CurrentTime)),
    h: common_vendor.o((...args) => $options.onCollect && $options.onCollect(...args)),
    i: $options.getOnCollect,
    j: common_vendor.o((...args) => $options.onCollect && $options.onCollect(...args)),
    k: !$options.getOnCollect,
    l: common_vendor.t($data.message.good.num),
    m: common_vendor.o((...args) => $options.onGood && $options.onGood(...args)),
    n: $options.getOnGood,
    o: common_vendor.t($data.message.good.num),
    p: common_vendor.o((...args) => $options.onGood && $options.onGood(...args)),
    q: !$options.getOnGood,
    r: common_vendor.t($options.getCommentNum($data.message.commentList)),
    s: common_vendor.o((...args) => _ctx.toMessage && _ctx.toMessage(...args)),
    t: common_vendor.f($data.message.commentList, (item, index, i0) => {
      return {
        a: item.userInfo.avatarUrl,
        b: common_vendor.t(item.userInfo.nickName),
        c: item.userInfo.sexIndex == 1,
        d: item.userInfo.sexIndex == 2,
        e: item.userInfo.sexIndex == 3,
        f: common_vendor.t(item.content),
        g: common_vendor.t($options.getMessageTime(item.msgTime)),
        h: index
      };
    }),
    v: $options.getCommentNum($data.message.commentList) == 0
  }, $options.getCommentNum($data.message.commentList) == 0 ? {} : {}, {
    w: $data.content,
    x: common_vendor.o(($event) => $data.content = $event.detail.value),
    y: common_vendor.o((...args) => $options.onSend && $options.onSend(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Not_Happy/Yang/pages/message/message.vue"]]);
wx.createPage(MiniProgramPage);
