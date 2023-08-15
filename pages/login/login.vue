<template>
	<view class="personal">
		<view class="info">
			<view class="avatar-wrapper">
				<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar" :src="userInfo.avatarUrl" alt="avatar" mode="aspectFill" />
				</button>
				<!-- <image class="avatar" :src="avatarUrl" alt="avatar" mode="aspectFill" /> -->
			</view>
			<view class="name">昵称：</view>
			<view class="name-ipt"> 
				<input class="input-box" type="nickname" v-model="userInfo.nickName" @blur="bindblur"
					placeholder="请输入昵称" @input="bindinput">
			</view>
			<view class="location">
				<view class="location-label">性别：</view>
				<view class="location-value">
					<picker mode="selector" :range="sex" @change="onSexChange">
						<view>{{sex[userInfo.sexIndex]}}<text class="xiangyou">></text></view>
					</picker>
				</view>
			</view>
			<view class="location">
				<view class="location-label">年龄：</view>
				<view class="location-value">
					<picker mode="selector" :range="age" @change="onAgeChange">
						<view>{{age[userInfo.ageIndex]}}<text class="xiangyou">></text></view>
					</picker>
				</view>
			</view>
			<view class="name">个性签名：</view>
			<view class=".modal-body">
				<textarea v-model="userInfo.introduction" placeholder="填写你的个性签名..."></textarea>
			</view>
			<button class="edit-btn" @tap="onEdit">修改资料</button>
		</view>
	</view>
</template>

 
<script>
	export default {
		data() {
			return {
				avatarUrl:'',
				age: ['保密', '80后', '90后', '00后', '10后', '20后', '永远18'],
				sex: ['保密', '男', '女', '沃尔玛购物袋'],
				userInfo: {
					introduction: '',
					ageIndex: 0,
					sexIndex: 0,
					nickName: '微信用户',
					avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0' // 默认头像图片地址
				},
			}
		},
		methods: {
			//性别和年龄的获取
			onSexChange(e) {
				this.userInfo.sexIndex = e.detail.value
			},
			onAgeChange(e) {
				this.userInfo.ageIndex = e.detail.value
			},

			// 处理选择的头像图片、昵称
			onChooseAvatar(e) {
				this.userInfo.avatarUrl = e.detail.avatarUrl
			},
			bindblur(e) {
				console.log(e.detail.value)
				this.userInfo.nickName = e.detail.value
			},
			bindinput(e) {
				console.log(e)
				this.userInfo.nickName = e.detail.value
			},

			//上传头像
			async ok() {
				const result = await uniCloud.uploadFile({
					filePath: this.userInfo.avatarUrl,
					cloudPath: 'TouXiang.jpg',
				}).catch((err)=>{
					uni.hideLoading()
					uni.showToast({
						title:'头像修改失败',
						icon:'error'
					})
					return
				})
				return result.fileID
			},

			// 提交修改
			async onEdit() {
				uni.showLoading({
					title:'上传中...'
				})
				const token = uni.getStorageSync("token")
				if(this.userInfo.avatarUrl!=this.avatarUrl){
				let url = await this.ok()
				this.userInfo.avatarUrl = url
				}

				uniCloud
					.callFunction({
						name: "fun",
						data: {
							api: "changeUserInfo",
							token,
							userInfo: this.userInfo
						},
					})
					.then((res) => {
						uni.hideLoading()
						uni.showToast({
							title:'修改资料成功',
							icon:'success'
						})
						setTimeout(()=>{
						uni.switchTab({
							url: `../my/my`
						});
						},1000)
					}).catch(()=>{
						uni.hideLoading()
						uni.showToast({
							title:'修改资料失败',
							icon:'error'
						})
					})

			}
		},
		onLoad(option) {
			const userInfo = JSON.parse(option.userInfo)
			this.userInfo = userInfo
			this.avatarUrl = userInfo.avatarUrl
		}
	}
</script>

<style lang="less">
	.xiangyou {
		margin-left: 20rpx;
		color: #ccc;
	}

	.personal {
		font-size: 32rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.avatar-wrapper {
		margin-bottom: 50rpx;

		button {
			width: 220rpx;
			height: 220rpx;
			padding: 0;
			border-radius: 50%;
		}
	}

	.avatar {
		width: 220rpx;
		height: 220rpx;
		border-radius: 50%;
	}



	.info {
		margin-top: 40rpx;
		text-align: center;
		background-color: #ffffff;
		padding: 30rpx;

		.modal-body {
			// padding: 0 20rpx;
		}

		.modal-body textarea {
			// background-color: #cccccc;
			padding: 30rpx 20rpx;
			width: 100%;
			height: 120px;
			resize: none;
			text-align: left;
			border-top: 2rpx solid #cccccc;
			border-bottom: 2rpx solid #cccccc;
		}

	}

	.name {
		float: left;
		font-weight: bold;
		color: #333333;
		margin-bottom: 20rpx;
	}

	.name-ipt {
		margin-bottom: 60rpx;
		text-align: left;

	}

	.input-box {
		width: 650rpx;
		border: none;
		border-bottom: 2rpx solid #cccccc;
		line-height: 54rpx;
		color: #333333;
		background-color: transparent;
		outline: none;
		padding: 10rpx;
	}

	.location {
		margin-bottom: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		button {
			height: 60rpx;
			width: 150rpx;
			border-radius: 25rpx;
			font-size: 23rpx;
			padding: 0;
		}
	}

	.location-label {}

	.btn-location {
		margin-left: 20rpx;
		font-size: 24rpx;
		outline: none;
	}

	.location-value {
		color: #333333;
	}

	.edit-btn {
		position: fixed;
		bottom: 60rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 600rpx;
		height: 80rpx;
		background-color: #42b983;
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
		border-radius: 40rpx;
		border: none;
		outline: none;
		box-shadow: 0px 2px 4px rgba(0, 0, 0.1, 0.2);

		&:active {
			box-shadow: none;
			background-color: #2e854b;
		}
	}
</style>