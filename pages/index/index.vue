<template>
	<div class="container">
		<div class="header">
			<image class="avatar" :src="userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
			<div class="user-info">
				<div class="nickname">
					{{ userInfo.nickName }}
				</div>
			</div>
			<div class="navigation">
				<div class="changeMessage" :class="{'yep':activeTab == 'tuijian'}" @click="change('tuijian')">
					推荐
				</div>
				<div>|</div>
				<div class="changeMessage" :class="{'yep':activeTab == 'zuixin'}" @click="change('zuixin')">
					最新
				</div>
			</div>
		</div>
		<div class="main">
			<div class="message-list">
				<div v-for="item in onlist" :key="item._id" class="message-container">
					<div class="message" @click="toMessage(item)">
						<div class="message-header">
							<image class="avatar" :src="item.userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
							<div class="nickname iconfont">{{ item.userInfo.nickName }}
								<text class="sex" style="color: blueviolet;"
									v-show="item.userInfo.sexIndex==1">&#xe8b3;</text>
								<text class="sex" style="color: red;" v-show="item.userInfo.sexIndex==2">&#xe8b4;</text>
								<text class="sex" style="color: green;"
									v-show="item.userInfo.sexIndex==3">&#xe73e;</text>
							</div>
							<text class="more iconfont">&#xe659;</text>
						</div>
						<div class="message-body">
							<div class="message-text">{{ item.content }}</div>
							<div class="message-time">{{ getMessageTime(item.CurrentTime) }}</div>
							<!-- 收藏 -->
							<div @tap.stop='onCollect(item,$event)' v-show="getOnCollect(item)" class="message-right iconfont onCollect">&#xe60e;<text
									class="right-text"></text></div>
							<div @tap.stop='onCollect(item,$event)' v-show="!getOnCollect(item)" class="message-right iconfont">&#xe60f;<text
									class="right-text"></text></div>
							<!-- 点赞 -->
							<div @tap.stop='onGood(item,$event)' v-show="getOnGood(item)" class="message-right iconfont onGood">&#xe654;<text
									class="right-text">{{item.good.num}}</text></div>
							<div @tap.stop='onGood(item,$event)' v-show="!getOnGood(item)" class="message-right iconfont">&#xe655;<text
									class="right-text">{{item.good.num}}</text></div>
							<!-- 评论 -->
							<div class="message-right iconfont">&#xe618;<text class="right-text">{{getCommentNum(item)}}</text></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>
			<button class="fixed-btn iconfont" @click="showModal">&#xe622;</button>
		</div>
	</div>
	<modal @closeModal="closeModal" @publish="publish" v-show="show"></modal>

</template>

<script>
	import Modal from '../../components/modal/modal.vue'
	export default {
		components: {
			Modal
		},
		data() {
			return {
				activeTab: 'zuixin',
				show: false,
				content: "",
				list: [],
				onlist: [],
				userid:'',
				CurrentTime: '',
				userInfo: {
					avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
					nickName: "微信用户",
				},
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
					let msgMonth = ('0' + (msgTime.getMonth() + 1)).slice(-2);
					let msgDate = ('0' + msgTime.getDate()).slice(-2);
					let msgHours = msgTime.getHours() < 10 ? msgTime.getHours() : ('0' + msgTime.getHours()).slice(-2);
					let msgMinutes = msgTime.getMinutes() < 10 ? msgTime.getMinutes() : ('0' + msgTime.getMinutes())
						.slice(-2);

					if (nowYear == msgYear) {
						let nowMonth = ('0' + (now.getMonth() + 1)).slice(-2);
						if (nowMonth == msgMonth) {
							let nowDate = ('0' + now.getDate()).slice(-2);

							// 如果是同一天，返回时间或者几个小时、几分钟前
							if (nowDate == msgDate) {
								const diff = now.getTime() - msgTime.getTime();
								const minutes = Math.floor(diff / 60000);
								const hours = Math.floor(minutes / 60);
								if (hours > 0) {
									return `${hours}小时前`;
								} else if (minutes > 0) {
									return `${minutes}分钟前`;
								} else {
									return '刚刚';
								}
							}
							// 如果相差一天，返回昨天
							else if (nowDate - msgDate == 1) {
								return '昨天';
							}
							// 如果相差两天，返回前天
							else if (nowDate - msgDate == 2) {
								return '前天';
							}
							// 如果相差三天到七天，返回本周
							else if (nowDate - msgDate >= 3 && nowDate - msgDate <= 7) {
								let num = nowDate - msgDate
								return num + '天前';
							}
							// 如果相差超过七天，返回本月
							else return '本月';
						} else return msgMonth + '月' + msgDate + '日';
					} else return msgYear + '年' + msgMonth + '月' + msgDate + '日';
				}
			},
			
			//评论数量
			getCommentNum(){
				return function(item){
					return item.commentList.length
				}
			},
			
			//判断点赞
			getOnGood(){
				return function(item){
					if(item.good.userid.indexOf(this.userid)!==-1){
						return true
					}else{
						return false
					}
				}
			},
			
			//判断收藏
			getOnCollect(){
				return function(item){
					if(item.shouChang.indexOf(this.userid)!==-1){
						return true
					}else{
						return false
					}
				}
			}
		},
		onShow() {
			// 获取当前时间
			this.getCurrentTime()

			let that = this;
			//获取本地保存的token，判断没有就登录
			uni.removeStorageSync('token')
			let token = uni.getStorageSync("token");
			
			
			
			uni.showLoading({
				title: '加载中...'
			})
			if (!token) {
				console.log('妹有token要登录')
				uni.login({
					provider: "weixin",
					success(loginRes) {
						let code = loginRes.code;
						uniCloud
							.callFunction({
								name: "fun",
								data: {
									api: "goLogin",
									code: code,
									userInfo: that.userInfo
								},
							})
							.then((res) => {
								uni.hideLoading()
								token = res.result.token;
								uni.setStorageSync("token", token);
								that.goList();
							}).catch(() => {
								uni.hideLoading()
								uni.showToast({
									title: '登录失败',
									icon: 'error'
								})
							})
					},
				});
			} else {
				console.log("有token");
				this.goList();
			}
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
			// 评论跳转
			toMessage(item) {
				uni.navigateTo({
					url: `../message/message?message=${JSON.stringify(item)}`
				});
			},
			// 收藏
			onCollect(item, e) {
				uni.showLoading({
					title:'收藏...'
				})
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "onCollect",
							token: uni.getStorageSync("token"),
							_id:item._id
						},
					}).then((res)=>{
						this.goList()
					}).catch(()=>{
						uni.hideLoading()
						uni.showToast({
							title: '失败',
							icon: 'error'
						})
					})
			},
			// 点赞
			onGood(item, e) {
				uni.showLoading({
					title:'点赞中...'
				})
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "onGood",
							token: uni.getStorageSync("token"),
							_id:item._id
						},
					}).then((res)=>{
						this.goList()
					}).catch(()=>{
						uni.hideLoading()
						uni.showToast({
							title: '失败',
							icon: 'error'
						})
					})
			},

			//改变或刷新 最新推荐
			change(value) {
				if (value) this.activeTab = value
				if (this.activeTab === 'zuixin') {
					this.onlist = this.list.slice().reverse();
				} else {
					this.onlist.sort((a,b)=>{
						return b.good.num - a.good.num
					})
				}
			},

			//关闭窗口
			closeModal() {
				this.show = false
			},

			//发表点击
			showModal() {
				this.show = true;
			},

			// 获取时间
			getCurrentTime() {
				const now = new Date().getTime();
				this.CurrentTime = now
			},

			// 获取页面数据
			goList(api) {
				console.log("调用了 goList() 函数！");
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: api || "getMassage",
							token: uni.getStorageSync("token"),
						},
					})
					.then((res) => {
						uni.hideLoading()
						this.list = res.result.message.data
						this.onlist = res.result.message.data.slice().reverse();
						this.userInfo = res.result.userInfo
						this.userid = res.result.userId
						// this.change() 
					}).catch(() => {
						uni.hideLoading()
						uni.showToast({
							title: '获取数据失败',
							icon: 'error'
						})
					})
			},

			//发送留言
			publish(message) {
				//获取时间
				this.getCurrentTime()
				uni.showLoading({
					title: '发送中...'
				})
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "publish",
							content: message,
							userInfo: this.userInfo,
							token: uni.getStorageSync("token"),
							CurrentTime: this.CurrentTime
						},
					})
					.then((res) => {
						this.goList()
						this.change()
						uni.hideLoading()
						uni.showToast({
							title: '操作成功',
							icon: 'success',
						})
					}).catch(() => {
						uni.hideLoading()
						uni.showToast({
							title: '发送失败',
							icon: 'error'
						})
					})
			},


		},
	};
</script>

<style scoped lang="less">
	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	.fixed-btn {
		position: fixed;
		bottom: 30px;
		right: 25px;
		width: 60px;
		height: 60px;
		line-height: 60px;
		text-align: center;
		background-color: #42b983;
		color: #fff;
		font-size: 30px;
		border-radius: 30px;
		cursor: pointer;
		box-shadow: 0px 2px 4px rgba(0, 0, 0.1, 0.2);

		&:active {
			box-shadow: none;
			transform: translateY(2rpx);
			background-color: #3ba773;
		}
	}

	.header {
		justify-content: space-between;
		position: fixed;
		top: 0;
		display: flex;
		align-items: center;
		margin: 0;
		padding: 0px 20px;
		padding-top: 10px;
		padding-bottom: 30px;
		background-color: #ccc;
		width: 100%;
		padding-bottom: 100rpx;

		.navigation {
			transform: translate(50%, 0);
			position: fixed;
			top: 53px;
			right: 50%;
			display: flex;
			align-items: center;
			text-align: center;
			margin: 0;
			background-color: #ccc;
			justify-content: space-evenly;

			.changeMessage {
				font-size: 15px;
				padding: 5px 15px;
				border-bottom: 2px solid #ccc
			}

			.yep {
				border-bottom-color: #42b983;
				font-weight: bold;
			}
		}

		.avatar {
			border-radius: 50%;
			width: 45px;
			height: 45px;
			margin-right: 10px;
		}

		.user-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;

			.nickname {
				font-size: 13px;
				font-weight: bold;

				.sex {
					font-size: 14px;
				}
			}
		}
	}

	.main {
		background-color: #fff;
		top: 10rpx;
		border-radius: 50rpx;
		width: 100%;
		position: fixed;
		margin-top: 80px;
		overflow-y: auto;
		height: calc(100vh - 80px);
	}

	.message-list {
		margin-top: 20px;
	}

	.message-container {
		margin-bottom: 20px;
	}

	.message {
		display: flex;
		flex-direction: column;
		box-shadow: 0px 2px 4px rgba(0, 0, 0.1, 0.2);
		background-color: #fff;
		border-radius: 20px;
		padding: 20px;
		margin: 30px 20px;

		&:active {
			background-color: #fafafa;
		}

		.message-header {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			position: relative;
			.more {
				position: absolute;
				right: 0rpx;
				top: 15rpx;
				font-size: 50rpx;
			}
		}

		.avatar {
			border-radius: 50%;
			width: 50px;
			height: 50px;
			margin-right: 20px;
		}

		.nickname {
			font-size: 20px;
			font-weight: bold;
			margin-bottom: 5px;
		}

		.message-body {
			margin-top: 10px;
			.onGood{
				color: red;
			}
			.onCollect{
				color: #FFA500;
			}
		}

		.message-text {
			font-size: 18px;
			line-height: 1.5;
			margin-top: 5px;
			margin-left: 5px;

		}

		.message-time {
			font-size: 14px;
			color: #666;
			margin-top: 30px;
			float: left;
		}

		.message-right {
			color: #666;
			margin-top: 30px;
			float: right;
			font-size: 20px;
			margin-left: 25px;

			.right-text {
				font-size: 14px;
				margin-left: 5px;
			}
		}
	}

	.content {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 100%;
		padding: 10px 5%;
		background-color: #ccc;

		input {
			margin-left: 5%;
			border: none;
			border: 1px solid #ccc;
			padding: 10px;
			font-size: 18px;
			flex: 1;
			margin-right: 5%;
			background-color: #dcdcdc;
		}

		button {
			z-index: 999;
			margin-right: 5%;
			width: 100px;
			height: 40px;
			background-color: #42b983;
			color: #fff;
			font-size: 20px;
			border: none;
			border-radius: 4px;
			cursor: pointer;

			&:hover {
				background-color: #36a974;
			}
		}
	}
</style>