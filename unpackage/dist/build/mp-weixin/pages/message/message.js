"use strict";const e=require("../../common/vendor.js"),t={data:()=>({userid:"",content:"",userInfo:{},nowTime:"",message:{CurrentTime:"",content:"内容加载中...",userInfo:{nickName:"微信用户",avatarUrl:"https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0"},commentList:[],good:{num:0,userid:[]},shouChang:[]}}),computed:{getOnGood(){return-1!==this.message.good.userid.indexOf(this.userid)},getOnCollect(){return-1!==this.message.shouChang.indexOf(this.userid)},getMessageTime:()=>function(e){const t=new Date(this.nowTime),n=new Date(e);let o=t.getFullYear(),s=n.getFullYear(),i=("0"+(n.getMonth()+1)).slice(-2),a=("0"+n.getDate()).slice(-2);if(n.getHours()<10?n.getHours():("0"+n.getHours()).slice(-2),n.getMinutes()<10?n.getMinutes():("0"+n.getMinutes()).slice(-2),o==s){if(("0"+(t.getMonth()+1)).slice(-2)==i){let e=("0"+t.getDate()).slice(-2);if(e==a){const e=t.getTime()-n.getTime(),o=Math.floor(e/6e4),s=Math.floor(o/60);return s>0?`${s}小时前`:o>0?`${o}分钟前`:"刚刚"}if(e-a==1)return"昨天";if(e-a==2)return"前天";if(e-a>=3&&e-a<=7){return e-a+"天前"}return"本月"}return i+"月"+a+"日"}return s+"年"+i+"月"+a+"日"},getCommentNum:()=>function(e){return e.length}},methods:{onCollect(){e.index.showLoading({title:"收藏..."}),e.Ds.callFunction({name:"fun",data:{api:"onCollect",token:e.index.getStorageSync("token"),_id:this.message._id}}).then((t=>{e.index.hideLoading(),this.getMessage()})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"失败",icon:"error"})}))},onGood(){e.index.showLoading({title:"点赞中..."}),e.Ds.callFunction({name:"fun",data:{api:"onGood",token:e.index.getStorageSync("token"),_id:this.message._id}}).then((t=>{e.index.hideLoading(),this.getMessage()})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"失败",icon:"error"})}))},getUserInfo(){e.Ds.callFunction({name:"fun",data:{api:"getUserInfo",token:e.index.getStorageSync("token")}}).then((t=>{e.index.hideLoading(),this.userInfo=t.result})).catch((()=>{e.index.hideLoading(),e.index.showToast({title:"加载失败",icon:"error"})}))},onSend(){e.index.showLoading({title:"加载中..."}),""!=this.content?e.Ds.callFunction({name:"fun",data:{api:"goComment",token:e.index.getStorageSync("token"),userInfo:this.userInfo,msgTime:this.nowTime,content:this.content,_id:this.message._id}}).then((()=>{this.message.commentList.push({userInfo:this.userInfo,msgTime:this.nowTime,content:this.content}),e.index.hideLoading(),e.index.showToast({title:"发送成功",icon:"success"}),this.getMessage(),this.content=""})):(e.index.hideLoading(),e.index.showToast({title:"请输入文字",icon:"none"}))},getCurrentTime(){const e=(new Date).getTime();this.nowTime=e,this.getMessage()},getMessage(){e.Ds.callFunction({name:"fun",data:{api:"getDetailedMessage",token:e.index.getStorageSync("token"),_id:this.message._id}}).then((e=>{this.message=e.result.message.data[0],this.userid=e.result.userId})).catch((t=>{console.log(t),e.index.showToast({title:"获取画面失败",icon:"error"})}))}},onShow(){this.getCurrentTime()},onLoad(t){e.index.showLoading({title:"加载中..."});const n=JSON.parse(t.message);this.message=n,this.getUserInfo()}};const n=e._export_sfc(t,[["render",function(t,n,o,s,i,a){return e.e({a:i.message.userInfo.avatarUrl,b:e.t(i.message.userInfo.nickName),c:1==i.message.userInfo.sexIndex,d:2==i.message.userInfo.sexIndex,e:3==i.message.userInfo.sexIndex,f:e.t(i.message.content),g:e.t(a.getMessageTime(i.message.CurrentTime)),h:e.o(((...e)=>a.onCollect&&a.onCollect(...e))),i:a.getOnCollect,j:e.o(((...e)=>a.onCollect&&a.onCollect(...e))),k:!a.getOnCollect,l:e.t(i.message.good.num),m:e.o(((...e)=>a.onGood&&a.onGood(...e))),n:a.getOnGood,o:e.t(i.message.good.num),p:e.o(((...e)=>a.onGood&&a.onGood(...e))),q:!a.getOnGood,r:e.t(a.getCommentNum(i.message.commentList)),s:e.o(((...e)=>t.toMessage&&t.toMessage(...e))),t:e.f(i.message.commentList,((t,n,o)=>({a:t.userInfo.avatarUrl,b:e.t(t.userInfo.nickName),c:1==t.userInfo.sexIndex,d:2==t.userInfo.sexIndex,e:3==t.userInfo.sexIndex,f:e.t(t.content),g:e.t(a.getMessageTime(t.msgTime)),h:n}))),v:0==a.getCommentNum(i.message.commentList)},(a.getCommentNum(i.message.commentList),{}),{w:i.content,x:e.o((e=>i.content=e.detail.value)),y:e.o(((...e)=>a.onSend&&a.onSend(...e)))})}]]);wx.createPage(n);