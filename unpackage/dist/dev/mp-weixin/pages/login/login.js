"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "",
      age: ["保密", "80后", "90后", "00后", "10后", "20后", "永远18"],
      sex: ["保密", "男", "女", "沃尔玛购物袋"],
      userInfo: {
        introduction: "",
        ageIndex: 0,
        sexIndex: 0,
        nickName: "微信用户",
        avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"
        // 默认头像图片地址
      }
    };
  },
  methods: {
    //性别和年龄的获取
    onSexChange(e) {
      this.userInfo.sexIndex = e.detail.value;
    },
    onAgeChange(e) {
      this.userInfo.ageIndex = e.detail.value;
    },
    // 处理选择的头像图片、昵称
    onChooseAvatar(e) {
      this.userInfo.avatarUrl = e.detail.avatarUrl;
    },
    bindblur(e) {
      console.log(e.detail.value);
      this.userInfo.nickName = e.detail.value;
    },
    bindinput(e) {
      console.log(e);
      this.userInfo.nickName = e.detail.value;
    },
    //上传头像
    async ok() {
      const result = await common_vendor.Ds.uploadFile({
        filePath: this.userInfo.avatarUrl,
        cloudPath: "TouXiang.jpg"
      }).catch((err) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "头像修改失败",
          icon: "error"
        });
        return;
      });
      return result.fileID;
    },
    // 提交修改
    async onEdit() {
      common_vendor.index.showLoading({
        title: "上传中..."
      });
      const token = common_vendor.index.getStorageSync("token");
      if (this.userInfo.avatarUrl != this.avatarUrl) {
        let url = await this.ok();
        this.userInfo.avatarUrl = url;
      }
      common_vendor.Ds.callFunction({
        name: "fun",
        data: {
          api: "changeUserInfo",
          token,
          userInfo: this.userInfo
        }
      }).then((res) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "修改资料成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: `../my/my`
          });
        }, 1e3);
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "修改资料失败",
          icon: "error"
        });
      });
    }
  },
  onLoad(option) {
    const userInfo = JSON.parse(option.userInfo);
    this.userInfo = userInfo;
    this.avatarUrl = userInfo.avatarUrl;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatarUrl,
    b: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    c: common_vendor.o((...args) => $options.bindblur && $options.bindblur(...args)),
    d: common_vendor.o([($event) => $data.userInfo.nickName = $event.detail.value, (...args) => $options.bindinput && $options.bindinput(...args)]),
    e: $data.userInfo.nickName,
    f: common_vendor.t($data.sex[$data.userInfo.sexIndex]),
    g: $data.sex,
    h: common_vendor.o((...args) => $options.onSexChange && $options.onSexChange(...args)),
    i: common_vendor.t($data.age[$data.userInfo.ageIndex]),
    j: $data.age,
    k: common_vendor.o((...args) => $options.onAgeChange && $options.onAgeChange(...args)),
    l: $data.userInfo.introduction,
    m: common_vendor.o(($event) => $data.userInfo.introduction = $event.detail.value),
    n: common_vendor.o((...args) => $options.onEdit && $options.onEdit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Not_Happy/Yang/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
