<template>
	<div class="myMessage">
		<div v-for="item in onlist" :key="item._id" class="message-container">
			<div class="message" @click="toMessage(item)">
				<div class="message-header">
					<image class="avatar" :src="item.userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
					<div class="nickname iconfont">{{ item.userInfo.nickName }}
						<text class="sex" style="color: blueviolet;" v-show="item.userInfo.sexIndex==1">&#xe8b3;</text>
						<text class="sex" style="color: red;" v-show="item.userInfo.sexIndex==2">&#xe8b4;</text>
						<text class="sex" style="color: green;" v-show="item.userInfo.sexIndex==3">&#xe73e;</text>
					</div>
					<text @tap.stop='onDelete(item._id)' class="more iconfont">&#xe645;</text>
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
					<div class="message-right iconfont">&#xe618;<text class="right-text">{{getCommentNum(item)}}</text>
					</div>
				</div>
			</div>
		</div>
		<div v-if="!this.onlist.length" class="none">
			您发送任何消息
		</div>
	</div>
	<div>
		<button class="fixed-btn iconfont" @click="unlist">&#xe611;</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				userid:'',
				activeTab:true,
				CurrentTime: '',
				userInfo: {},
				list: [],
				onlist: []
			};
		},
		computed: {
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
					// console.log(item.shouChang.indexOf(this.userid))
					if(item.shouChang.indexOf(this.userid)!==-1){
						return true
					}else{
						return false
					}
				}
			},
			
			getCommentNum() {
				return function(item) {
					return item.commentList.length
				}
			},
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
		},
		methods: {
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
			//调转顺序
			unlist(){
				this.activeTab =!this.activeTab
				if (this.activeTab) {
					this.onlist = this.list.slice().reverse();
				} else {
					this.onlist = this.list
				}
			},
			
			//删除消息
			onDelete(_id){
				const that = this
				uni.showModal({
				  title: '确认删除',
				  content: '您确定要删除这条记录吗？',
				  success: function (res) {
				    if (res.confirm) {
				      console.log('用户点击了确认按钮');
					  uniCloud
					  	.callFunction({
					  		name: "fun",
					  		data: {
					  			api: "deleteMessage",
					  			token: uni.getStorageSync("token"),
								_id,
					  		},
					  	}).then(()=>{
							that.goList()
							uni.showToast({
								title:'删除成功',
								icon:'success'
							})
						}).catch((err)=>{
							uni.showToast({
								title:'删除失败',
								icon:'error'
							})
						})
				    } else if (res.cancel) {
				      console.log('用户点击了取消按钮');
				    }
				  }
				});
			},
			
			// 跳转到message
			toMessage(item) {
				uni.navigateTo({
					url: `../message/message?message=${JSON.stringify(item)}`
				});
			},

			// 获取现在时间
			getCurrentTime() {
				const now = new Date().getTime();
				this.CurrentTime = now
			},

			goList(api) {
				console.log("调用了 goList() 函数！");
				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "getMyMassage",
							token: uni.getStorageSync("token"),
						},
					})
					.then((res) => {
						uni.hideLoading()
						this.list = res.result.message.data
						this.onlist = res.result.message.data.slice().reverse();
						this.userid = res.result.userId
					}).catch(() => {
						uni.hideLoading()
						uni.showToast({
							title: '获取数据失败',
							icon: 'error'
						})
					})
			},
		},
		onShow() {
			uni.showLoading({
				title:'加载中...'
			})
			this. getCurrentTime()
			this.goList()
		}
	}
</script>

<style lang="less">
	.fixed-btn {
		position: fixed;
		top: 100px;
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
	.myMessage {
		overflow-y: auto;
.none{
			display: flex;
			justify-content: center;
			margin-top: 120rpx;
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
					font-size: 40rpx;
					color: red;
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
	}
</style>