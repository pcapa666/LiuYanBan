"use strict";const e=require("../../common/vendor.js"),s={data:()=>({message:""}),methods:{closeModal(){this.$emit("closeModal")},publish(){""!=this.message?(this.$emit("publish",this.message),this.closeModal(),this.message=""):e.index.showToast({title:"请输入文字",icon:"none"})}}};const o=e._export_sfc(s,[["render",function(s,o,t,a,i,l){return{a:i.message,b:e.o((e=>i.message=e.detail.value)),c:e.o(((...e)=>l.closeModal&&l.closeModal(...e))),d:e.o(((...e)=>l.publish&&l.publish(...e)))}}],["__scopeId","data-v-aa3f3668"]]);wx.createComponent(o);
