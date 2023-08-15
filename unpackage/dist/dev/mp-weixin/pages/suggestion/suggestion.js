"use strict";
const common_vendor = require("../../common/vendor.js");
common_vendor.ref(true);
const _sfc_main = {
  data() {
    return {
      show: true,
      list: [
        {
          text: "ok"
        }
      ]
    };
  },
  onLoad() {
    console.log(common_vendor.index.$u.config.v);
  }
};
if (!Array) {
  const _easycom_u_button2 = common_vendor.resolveComponent("u-button");
  _easycom_u_button2();
}
const _easycom_u_button = () => "../../uni_modules/uview-plus/components/u-button/u-button.js";
if (!Math) {
  _easycom_u_button();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      text: "月落"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/Not_Happy/Yang/pages/suggestion/suggestion.vue"]]);
wx.createPage(MiniProgramPage);
