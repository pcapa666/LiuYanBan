"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      message: ""
    };
  },
  methods: {
    //关掉
    closeModal() {
      this.$emit("closeModal");
    },
    // 发送
    publish() {
      if (this.message != "") {
        this.$emit("publish", this.message);
        this.closeModal();
        this.message = "";
      } else {
        common_vendor.index.showToast({
          title: "请输入文字",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.message,
    b: common_vendor.o(($event) => $data.message = $event.detail.value),
    c: common_vendor.o((...args) => $options.closeModal && $options.closeModal(...args)),
    d: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ef206254"], ["__file", "D:/Not_Happy/Yang/components/modal/modal.vue"]]);
wx.createComponent(Component);
