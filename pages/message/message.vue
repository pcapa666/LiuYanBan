<template>
	<div class="all">
		<div class="message">
			<div class="message-header">
				<image class="avatar" :src="message.userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
				<div class="nickname iconfont">{{ message.userInfo.nickName }}
					<text class="sex" style="color: blueviolet;" v-show="message.userInfo.sexIndex==1">&#xe8b3;</text>
					<text class="sex" style="color: red;" v-show="message.userInfo.sexIndex==2">&#xe8b4;</text>
					<text class="sex" style="color: green;" v-show="message.userInfo.sexIndex==3">&#xe73e;</text>
				</div>
				<text class="more iconfont">&#xe659;</text>
			</div>
			<div class="message-body">
				<div class="message-text">{{message.content}}</div>
				<div class="message-time">{{getMessageTime(message.CurrentTime)}}</div>
				<!-- 收藏 -->
				<div @tap.stop='onCollect' v-show="getOnCollect" class="message-right iconfont onCollect">&#xe60e;<text
						class="right-text"></text></div>
				<div @tap.stop='onCollect' v-show="!getOnCollect" class="message-right iconfont">&#xe60f;<text
						class="right-text"></text></div>
				<!-- 点赞 -->
				<div @tap.stop='onGood' v-show="getOnGood" class="message-right iconfont onGood">&#xe654;<text
						class="right-text">{{message.good.num}}</text></div>
				<div @tap.stop='onGood' v-show="!getOnGood" class="message-right iconfont">&#xe655;<text
						class="right-text">{{message.good.num}}</text></div>
						
				<div @tap='toMessage' class="message-right iconfont">&#xe618;<text
						class="right-text">{{getCommentNum(message.commentList)}}</text></div>
			</div>
		</div>
		<div class="color"></div>
		<div class="comment">
			<div class="comment-header">
				<div class="color"></div>
				<text>评论</text>
			</div>
			<div class="comment-body">
				<div class="box" v-for="(item,index) in message.commentList" :key="index">
					<div class="box-header">
						<image class="avatar" :src="item.userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
						<div class="nickname iconfont">{{ item.userInfo.nickName }}
							<text class="sex" style="color: blueviolet;"
								v-show="item.userInfo.sexIndex==1">&#xe8b3;</text>
							<text class="sex" style="color: red;" v-show="item.userInfo.sexIndex==2">&#xe8b4;</text>
							<text class="sex" style="color: green;" v-show="item.userInfo.sexIndex==3">&#xe73e;</text>
						</div>
						<text class="more iconfont">&#xe659;</text>
					</div>
					<div class="box-body">
						<div class="box-text">{{item.content}}</div>
						<div class="box-time">{{getMessageTime(item.msgTime)}}</div>
					</div>
				</div>
				<div class="noComment" v-if="getCommentNum(message.commentList)==0">
					本贴暂时没有评论
				</div>
			</div>
		</div>
		<view class="input-box">
			<input type="text" placeholder="善于结善缘, 恶语伤人心..." class="input" v-model="content" />
			<button class="send-button iconfont" @tap="onSend">&#xe60d;</button>
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userid:'',
				content: '',
				userInfo: {},
				nowTime: '',
				message: {
					CurrentTime: '',
					content: '内容加载中...',
					userInfo: {
						nickName: '微信用户',
						avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0' // 默认头像图片地址
					},
					commentList: [],
					good: {
						num:0,
						userid:[]
					},
					shouChang:[]
				},
			};
		},
		computed: {
			getOnGood(){
					if(this.message.good.userid.indexOf(this.userid)!==-1){
						return true
					}else{
						return false
					}
			},
			
			//判断收藏
			getOnCollect(){
					if(this.message.shouChang.indexOf(this.userid)!==-1){
						return true
					}else{
						return false
					}
			},
			//消息内时间计算
			getMessageTime() {
				return function(msg) {
					const now = new Date(this.nowTime);
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
			getCommentNum() {
				return function(item) {
					return item.length
				}
			}
		},
		methods: {
			// 收藏
			onCollect() {
				uni.showLoading({
					title:'收藏...'
				})
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "onCollect",
							token: uni.getStorageSync("token"),
							_id:this.message._id
						},
					}).then((res)=>{
						uni.hideLoading()
						this.getMessage()
					}).catch(()=>{
						uni.hideLoading()
						uni.showToast({
							title: '失败',
							icon: 'error'
						})
					})
			},
			// 点赞
			onGood() {
				uni.showLoading({
					title:'点赞中...'
				})
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "onGood",
							token: uni.getStorageSync("token"),
							_id:this.message._id
						},
					}).then((res)=>{
						uni.hideLoading()
						this.getMessage()
					}).catch(()=>{
						uni.hideLoading()
						uni.showToast({
							title: '失败',
							icon: 'error'
						})
					})
			},
			//获取头像昵称数据
			getUserInfo() {
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
					}).catch(() => {
						uni.hideLoading()
						uni.showToast({
							title: '加载失败',
							icon:'error'
						})
					})
			},
			//发送评论
			onSend() {
				uni.showLoading({
					title:'加载中...'
				})
				if (this.content != '') {
					uniCloud.callFunction({
						name: "fun",
						data: {
							api: 'goComment',
							token: uni.getStorageSync("token"),
							userInfo: this.userInfo,
							msgTime: this.nowTime,
							content: this.content,
							_id: this.message._id
						}
					}).then(()=>{
						this.message.commentList.push(
							{
								userInfo: this.userInfo,
								msgTime: this.nowTime,
								content: this.content
							}
						)
						uni.hideLoading()
						uni.showToast({
							title:'发送成功',
							icon:'success'
						})
						this.getMessage()
					this.content = ''
					})
				}else{
					uni.hideLoading()
					uni.showToast({
						title:'请输入文字',
						icon:'none'
					})
				}
			},
			
			//获取现在时间
			getCurrentTime() {
				const now = new Date().getTime();
				this.nowTime = now
				this.getMessage()
			},
			//拿动态详情
			getMessage(){
				uniCloud.callFunction({
					name: "fun",
					data: {
						api: 'getDetailedMessage',
						token: uni.getStorageSync("token"),
						_id: this.message._id
					}
				}).then((res)=>{
					this.message=res.result.message.data[0]
					this.userid = res.result.userId
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:'获取画面失败',
						icon:'error'
					})
				})
			}
		},
		onShow() {
			this.getCurrentTime()
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中...'
			})
			//拿传参数据
			const message = JSON.parse(option.message)
			this.message = message

			this.getUserInfo()
		}
	};
</script>

<style lang="less">
	.all {
		overflow-y: auto;
		height: calc(100vh - 63px);

		.message {
			display: flex;
			flex-direction: column;
			background-color: #fff;
			padding: 40rpx 40rpx;

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
			}

			.message-body {
				margin-top: 10px;
				.onGood{
					color: red  !important;
				}
				.onCollect{
					color: #FFA500 !important;
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
		}

		.color {
			background-color: #e5e5e5;
			height: 20rpx;
			width: 100%;
		}

		.comment {
			.comment-header {
				background-color: #fff;
				padding: 20rpx 25rpx;
				position: relative;
				font-size: 25rpx;
				margin: auto;

				.color {
					position: absolute;
					background-color: #42b983;
					width: 10rpx;
					height: 45rpx;
					border-radius: 5rpx;
					left: -5rpx;
					top: auto;
				}
			}

			.comment-body {
				display: flex;
				flex-direction: column;
				background-color: #fff;
				padding: 0rpx 40rpx;

				.noComment {
					justify-content: center;
					display: flex;
					margin-top: 80rpx;
				}

				.box {
					border-bottom: 1rpx solid #eee;

					.box-header {
						margin-top: 30rpx;
						display: flex;
						align-items: center;
						margin-bottom: 10px;
						position: relative;

						.more {
							position: absolute;
							right: 0rpx;
							top: 15rpx;
							font-size: 40rpx;
						}

						.avatar {
							border-radius: 50%;
							width: 40px;
							height: 40px;
							margin-right: 18px;
						}

						.nickname {
							font-size: 15px;
							font-weight: bold;
							margin-bottom: 5px;
						}
					}

					.box-body {
						margin-top: 10px;

						.box-text {
							font-size: 18px;
							line-height: 1.5;
							margin-top: 5px;
							margin-left: 55px;

						}

						.box-time {
							font-size: 14px;
							color: #666;
							margin-top: 20px;
							float: left;
							margin-bottom: 30rpx;
						}

						.box-right {
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
				}
			}
		}

		.input-box {
			display: flex;
			align-items: center;
			// background-color: #f0f0f0;
			background-color: #ccc;
			padding: 15px;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			font-size: 15px;

			.input {
				flex: 1;
				height: 30px;
				border: none;
				outline: none;
				padding: 2px 10px;
				background-color: #fff;
				border-radius: 5px;
			}

			.send-button {
				font-size: 15px;
				margin-left: 10px;
				height: 30px;
				line-height: 30px;
				padding: 0 20px;
				border: none;
				outline: none;
				background-color: #42b983;
				color: #fff;
				border-radius: 5px;

				&:active {
					box-shadow: none;
					background-color: #3ba773;
				}
			}
		}

	}
</style>