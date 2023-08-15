<template>
  <view class="container">
    <div class="header">
      <div class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
        <div class="nickname iconfont">{{ userInfo.nickName }}
			<text class="sex" style="color: blueviolet;" v-show="userInfo.sexIndex==1">&#xe8b3;</text>
			<text class="sex" style="color: red;" v-show="userInfo.sexIndex==2">&#xe8b4;</text>
			<text class="sex" style="color: green;" v-show="userInfo.sexIndex==3">&#xe73e;</text>
		</div>
        <div class="getUser">
          <button size="mini" @tap="getLocation">修改个人信息</button>
        </div>
      </div>
    </div>
    <scroll-view class="section">
      <div class="icon">
        <div class="box" @tap="toMyMessage">
          <text class="text" >动态({{myMessage}})</text>
        </div>
		<div class="fenge"></div> 
        <div class="box" @tap="toMyCollect">
          <text class="text">收藏({{myCollect}})</text> 
        </div>
      </div>
      <view class="item" @tap="onServiceTap">
        <text class="text iconfont"><text class="icons">&#xe60b;</text>联系客服</text>
		<text class="text" style="color: #ccc;">></text>
      </view>
	  <view class="item" @tap="onSuggestion">
	    <text class="text iconfont"><text class="icons">&#xe65f;</text>意见反馈</text>
	  		<text class="text" style="color: #ccc;">></text>
	  </view>
     <!-- <div class="item" @tap="onShareTap" open-type="share">
        <text class="text iconfont"><text class="icons">&#xe656;</text>推荐给好友</text>
		<text class="text" style="color: #ccc;">></text>
      </div> -->
	  <view class="item" @tap="onRecommendTap">
	    <text class="text iconfont"><text class="icons">&#xe65a;</text>关于留言板</text>
	  		<text class="text" style="color: #ccc;">></text>
	  </view>
	  <view class="item" @tap="onDonateTap">
	    <text class="text iconfont"><text class="icons">&#xe657;</text>开发者信息</text>
	  		<text class="text" style="color: #ccc;">></text>
	  </view>
      <view class="item" style="border: none;" @tap="onDonateTap">
        <text class="text iconfont"><text class="icons">&#xe685;</text>打赏开发者</text>
		<text class="text" style="color: #ccc;">></text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		myCollect:0,
		myMessage:0,
      userInfo: {
        nickName: '微信用户',
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0' // 默认头像图片地址
      },
    };
  },
  onShareAppMessage: function() { // 分享到微信
    // 更多参数配置，参考文档
    return {
      title: '浩的留言板',
      path: '/pages/index/index'
    }
  },
  onShareTimeline() { // 分享到朋友圈
    return {
      title: '浩的留言板',
      path: '/pages/index/index'
    }
  },
  methods: {
	  //意见反馈
	  onSuggestion(){
		  uni.navigateTo({
		  	url: `../suggestion/suggestion`
		  });
	  },
	  //收藏点击
	  toMyCollect(){
		  uni.navigateTo({
		  	url: `../myCollect/myCollect`
		  });
	  },
	  //动态点击
	  toMyMessage(){
		  uni.navigateTo({
		  	url: `../myMessage/myMessage`
		  });
	  },
	  
	  //修改资料
	  getLocation() {
	  	uni.navigateTo({
	  		url: `../login/login?userInfo=${JSON.stringify(this.userInfo)}`
	  	});
	  },
	  
	  //获取用户信息
	  getUserInfo(){
		  uniCloud
		  	.callFunction({
		  		name: "fun",
		  		data: {
		  			api: "getUserInfo",
		  			token: uni.getStorageSync("token"),
		  		},
		  	})
		  	.then((res) => {
				uni.hideLoading()
		  		this.userInfo = res.result
		  	}).catch(()=>{
				uni.hideLoading()
				uni.showToast({
					title:'加载失败',
					icon:'error'
				})
			})
	  },
	  
	  //获取动态数量
	  getMyMessage() {
	  	console.log("调用了 getMyMessage() 函数！");
	  	uniCloud
	  		.callFunction({
	  			name: "fun",
	  			data: {
	  				api: "getMyMassage",
	  				token: uni.getStorageSync("token"),
	  			},
	  		})
	  		.then((res) => {
	  			this.myMessage = res.result.message.data.length
				this.getMyCollect()
				this.getUserInfo()
	  		}).catch(() => {
	  			uni.hideLoading()
	  			uni.showToast({
	  				title: '获取数据失败',
	  				icon: 'error'
	  			})
	  		})
	  },
	  
	  //获取收藏数量
	  getMyCollect() {
	  	console.log("调用了 getMyCollect() 函数！");
	  	uniCloud
	  		.callFunction({
	  			name: "fun",
	  			data: {
	  				api: "getMyCollect",
	  				token: uni.getStorageSync("token"),
	  			},
	  		})
	  		.then((res) => {
	  			this.myCollect = res.result.message.data.length
	  		}).catch(() => {
	  			uni.hideLoading()
	  			uni.showToast({
	  				title: '获取数据失败',
	  				icon: 'error'
	  			})
	  		})
	  },
  },
  onShow(){
	  uni.showLoading({
	  	title:'加载中...'
	  })
	  this.getMyMessage()
  }
};
</script>

<style lang="less">
	.icons{
		font-size: 42rpx;
		margin-right: 20rpx;
	}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ccc;
  padding-bottom: 150rpx;
  button {
    height: 50rpx;
    width: 180rpx;
    border-radius: 30rpx;
    padding: 0;
    font-size: 22rpx;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
}

.avatar {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  overflow: hidden;
}

.nickname {
  margin-top: 30rpx;
  font-size: 40rpx;
  font-weight: bold;
}

.getUser {
  margin-top: 30rpx;
}

.section {
  border-radius: 50rpx;
  display: flex;
  flex-direction: row;
  margin-top: -100rpx;
  background-color: #fff;
  overflow-x: auto;
  white-space: nowrap;
}

.icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 30rpx;

  .box {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    background-color: #fff;
	margin: 0rpx;
	padding: 20rpx 60rpx;
	&:active{
		  background-color: #fafafa;
	}
	.text{
		margin: 0 40rpx;
	}
  }
  
  .fenge{
	  background-color: #ccc;
	  width: 3rpx;
	  height: 50rpx;
  }
}

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 40rpx 0;
  margin: 0 30rpx;
  border-bottom: 1px solid #eee;
  justify-content: space-between;
  &:active{
	  background-color: #fafafa;
  }
}

.text {
	display: flex;
	align-items: center;
  margin-left: 10rpx;
  font-size: 28rpx;
  margin-right: 10rpx;
}
</style>