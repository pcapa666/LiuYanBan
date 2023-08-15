<template>
	<div class="modal">
		<div class="modal-overlay"></div>
		<div class="modal-dialog">
			<div class="modal-header">
				<h3>留言窗口</h3>
			</div>
			<div class="modal-body">
				<textarea v-model="message" placeholder="请输入留言内容"></textarea>
			</div>
			<div class="modal-footer">
				<button class="modal-Lbutton iconfont" @click="closeModal">&#xe630;</button>
				<button class="modal-Rbutton iconfont" @tap="publish">&#xe60d;</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				message: ''
			}
		},
		methods: {
			//关掉
			closeModal() {
				this.$emit('closeModal')
				// document.body.style.overflow = ''; // 恢复背景滚动
			},

			// 发送
			publish() {
				if (this.message != '') {
					this.$emit('publish', this.message)
					this.closeModal()
					this.message = ''
				} else {
					uni.showToast({
						title:'请输入文字',
						icon:'none'
					})
				}
			}
		}
	};
</script>

<style scoped lang="less">
	.iconfont {
		font-size: 40rpx;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;

		.modal-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(5rpx);
		}

		.modal-dialog {
			position: relative;
			width: 85%;
			background-color: #fff;
			border-radius: 50rpx;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
			overflow: hidden;

			.modal-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 16px;
				background-color: #e6e6e6;
				border-bottom: 1px solid #ddd;
			}

			.modal-header h3 {
				margin: 0;
			}

			.modal-body {
				padding: 16px;
			}

			.modal-body textarea {
				width: 100%;
				height: 120px;
				padding: 8px;
				border: none;
				resize: none;
			}

			.modal-footer {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 16px;
				border-top: 1px solid #ddd;

				.modal-Lbutton,
				.modal-Rbutton {
					padding: 5rpx 40rpx;
					border: none;
					border-radius: 35rpx;
					color: #fff;
				}

				.modal-Rbutton {
					margin-left: 250rpx;
					background-color: #42b983;
				}

				.modal-Lbutton {
					background-color: #999999;
				}
			}
		}
	}
</style>