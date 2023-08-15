"use strict";const e=require("../../common/vendor.js"),t={components:{Modal:()=>"../../components/modal/modal.js"},data:()=>({activeTab:"zuixin",show:!1,content:"",list:[],onlist:[],userid:"",CurrentTime:"",userInfo:{avatarUrl:"https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",nickName:"微信用户"}}),computed:{getMessageTime:()=>function(e){const t=new Date(this.CurrentTime),n=new Date(e);let o=t.getFullYear(),i=n.getFullYear(),s=("0"+(n.getMonth()+1)).slice(-2),a=("0"+n.getDate()).slice(-2);if(n.getHours()<10?n.getHours():("0"+n.getHours()).slice(-2),n.getMinutes()<10?n.getMinutes():("0"+n.getMinutes()).slice(-2),o==i){if(("0"+(t.getMonth()+1)).slice(-2)==s){let e=("0"+t.getDate()).slice(-2);if(e==a){const e=t.getTime()-n.getTime(),o=Math.floor(e/6e4),i=Math.floor(o/60);return i>0?`${i}小时前`:o>0?`${o}分钟前`:"刚刚"}if(e-a==1)return"昨天";if(e-a==2)return"前天";if(e-a>=3&&e-a<=7){return e-a+"天前"}return"本月"}return s+"月"+a+"日"}return i+"年"+s+"月"+a+"日"},getCommentNum:()=>function(e){return e.commentList.length},getOnGood:()=>function(e){return-1!==e.good.userid.indexOf(this.userid)},getOnCollect:()=>function(e){return-1!==e.shouChang.indexOf(this.userid)}},onShow(){this.getCurrentTime();let t=this;e.index.removeStorageSync("token");let n=e.index.getStorageSync("token");e.index.showLoading({title:"加载中..."}),n?(console.log("有token"),this.goList()):(console.log("妹有token要登录"),e.index.login({provider:"weixin",success(o){let i=o.code;e.Ds.callFunction({name:"fun",data:{api:"goLogin",code:i,userInfo:t.userInfo}}).then((o=>{e.index.hideLoading(),n=o.result.token,e.index.setStorageSync("token",n),t.goList()})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"登录失败",icon:"error"})}))}}))},onShareAppMessage:function(){return{title:"浩的留言板",path:"/pages/index/index"}},onShareTimeline:()=>({title:"浩的留言板",path:"/pages/index/index"}),methods:{toMessage(t){e.index.navigateTo({url:`../message/message?message=${JSON.stringify(t)}`})},onCollect(t,n){e.index.showLoading({title:"收藏..."}),e.Ds.callFunction({name:"fun",data:{api:"onCollect",token:e.index.getStorageSync("token"),_id:t._id}}).then((e=>{this.goList()})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"失败",icon:"error"})}))},onGood(t,n){e.index.showLoading({title:"点赞中..."}),e.Ds.callFunction({name:"fun",data:{api:"onGood",token:e.index.getStorageSync("token"),_id:t._id}}).then((e=>{this.goList()})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"失败",icon:"error"})}))},change(e){e&&(this.activeTab=e),"zuixin"===this.activeTab?this.onlist=this.list.slice().reverse():this.onlist.sort(((e,t)=>t.good.num-e.good.num))},closeModal(){this.show=!1},showModal(){this.show=!0},getCurrentTime(){const e=(new Date).getTime();this.CurrentTime=e},goList(t){console.log("调用了 goList() 函数！"),e.Ds.callFunction({name:"fun",data:{api:t||"getMassage",token:e.index.getStorageSync("token")}}).then((t=>{e.index.hideLoading(),this.list=t.result.message.data,this.onlist=t.result.message.data.slice().reverse(),this.userInfo=t.result.userInfo,this.userid=t.result.userId})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"获取数据失败",icon:"error"})}))},publish(t){this.getCurrentTime(),e.index.showLoading({title:"发送中..."}),e.Ds.callFunction({name:"fun",data:{api:"publish",content:t,userInfo:this.userInfo,token:e.index.getStorageSync("token"),CurrentTime:this.CurrentTime}}).then((t=>{this.goList(),this.change(),e.index.hideLoading(),e.index.showToast({title:"操作成功",icon:"success"})})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"发送失败",icon:"error"})}))}}};if(!Array){e.resolveComponent("modal")()}Math;const n=e._export_sfc(t,[["render",function(t,n,o,i,s,a){return{a:s.userInfo.avatarUrl,b:e.t(s.userInfo.nickName),c:"tuijian"==s.activeTab?1:"",d:e.o((e=>a.change("tuijian"))),e:"zuixin"==s.activeTab?1:"",f:e.o((e=>a.change("zuixin"))),g:e.f(s.onlist,((t,n,o)=>({a:t.userInfo.avatarUrl,b:e.t(t.userInfo.nickName),c:1==t.userInfo.sexIndex,d:2==t.userInfo.sexIndex,e:3==t.userInfo.sexIndex,f:e.t(t.content),g:e.t(a.getMessageTime(t.CurrentTime)),h:e.o((e=>a.onCollect(t,e)),t._id),i:a.getOnCollect(t),j:e.o((e=>a.onCollect(t,e)),t._id),k:!a.getOnCollect(t),l:e.t(t.good.num),m:e.o((e=>a.onGood(t,e)),t._id),n:a.getOnGood(t),o:e.t(t.good.num),p:e.o((e=>a.onGood(t,e)),t._id),q:!a.getOnGood(t),r:e.t(a.getCommentNum(t)),s:e.o((e=>a.toMessage(t)),t._id),t:t._id}))),h:e.o(((...e)=>a.showModal&&a.showModal(...e))),i:e.o(a.closeModal),j:e.o(a.publish),k:s.show}}],["__scopeId","data-v-a208143d"]]);t.__runtimeHooks=6,wx.createPage(n);
