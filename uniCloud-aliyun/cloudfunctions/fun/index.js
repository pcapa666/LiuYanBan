let jwt = require('jsonwebtoken')
let db = uniCloud.database({
	throwOnNotFound: false
})

exports.main = async (event, context) => {
	//event为客户端上传的参数

	// }
	let appid = 'wx75df72d7d152b737'
	let secret = '86b88cc61e9387f54bbcdbdf9c88d0b6'
	let jwtSecret = 'yang'

	if (event.api === 'goLogin') {
		let wxRes = await uniCloud.httpclient.request(
			`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${event.code}&grant_type=authorization_code`, {
				dataType: 'json',
			})

		//得到userId	
		let userId = wxRes.data.openid

		if (!userId) {
			throw Error(wxRes.data.errmsg)
		}

		//在云端寻找相同的userid
		let user = await db.collection('user').doc(userId).get()

		// 声明token变量
		let token = 'bearer ' + jwt.sign({
			userId
		}, jwtSecret)


		//找到相同userid，没找到就创建新的
		if (user.data[0]) {
			return {
				user: user.data[0],
				token
			}
		} else {
			let data = {
				_id: userId,
				createAt: Date.now(),
				userInfo: event.userInfo
			}
			await db.collection('user').add(data)
			return {
				user: data,
				token
			}
		}
	}

	//验证有没有token，没有报错，有就用verify函数验证并返回加密数据
	if (!event.token) {
		throw Error('未登录')
	}
	let auth = jwt.verify(event.token.replace('bearer ', ''), jwtSecret)
	let userId = auth.userId

	//发送消息
	if (event.api === 'publish') {
		return await db.collection('message').add({
			content: event.content,
			userInfo: event.userInfo,
			userId,
			CurrentTime: event.CurrentTime,
			commentList: [],
			good: {
				num: 0,
				userid: []
			},
			shouChang: []
		})
	}

	//获取列表数据
	if (event.api === 'getMassage') {
		let message = await db.collection('message').get()
		let userInfos = await db.collection('user').get()
		let users = userInfos.data
		let userInfo
		users.forEach((item) => {
			console.log(item._id == userId)
			if (item._id == userId) {
				userInfo = item.userInfo
			}
		})
		return {
			message,
			userInfo,
			userId
		}
	}

	// 获取动态详情
	if (event.api === 'getDetailedMessage') {
		let message = await db.collection('message').where({
			_id: event._id,
		}).get()
		return {
			message,
			userId
		}
	}

	// 获取我的动态
	if (event.api === 'getMyMassage') {
		let message = await db.collection('message').where({
			userId: userId
		}).get()
		console.log(message)
		return {
			message,
			userId
		}
	}
	// 获取我的收藏
	if (event.api === 'getMyCollect') {
		let message = await db.collection('message').where({
			shouChang:[userId]
		}).get()
		console.log(message)
		return {
			message,
			userId
		}
	}
	//更改头像昵称
	if (event.api === 'changeUserInfo') {
		//在云端寻找相同的userid
		let user = await db.collection('user').doc(userId).update({
			userInfo: event.userInfo
		})
		console.log(user, 'ffffffffffff')
	}

	//获取头像昵称
	if (event.api === 'getUserInfo') {
		let userInfos = await db.collection('user').get()
		let users = userInfos.data
		let userInfo
		users.forEach((item) => {
			if (item._id == userId) {
				userInfo = item.userInfo
			}
		})
		return userInfo
	}

	//发送评论
	if (event.api === 'goComment') {
		console.log(event.userInfo, '----------')
		let _id = event._id
		let a = await db.collection('message').doc(_id)
		const newComment = {
			userInfo: event.userInfo,
			msgTime: event.msgTime,
			content: event.content
		}
		a.update({
			commentList: db.command.push(newComment)
		}).then(res => {
			return '成功'
		}).catch(err => {
			return '失败'
		})
	}

	//删除消息
	if (event.api === 'deleteMessage') {
		let message = await db.collection('message').doc(event._id).remove()
		return message
	}

	//获取点赞信息
	if (event.api === 'onGood') {
		let onGood = await db.collection('message').where({
			_id: event._id,
			good: {
				userid: [userId]
			}
		}).get()

		const message = onGood.data[0]

		if (message) {
			const userIds = message.good.userid
			// 找到要删除的元素在数组中的索引位置
			const index = userIds.indexOf(userId);
			// 如果找到了要删除的元素，则从数组中删除该元素
			if (index !== -1) {
				userIds.splice(index, 1);
			}
			// 更新对象中 good 对象和 userid 数组的值
			onGood.data = message;
			onGood.data.good.userid = userIds;
			onGood.data.good.num = onGood.data.good.num - 1;
			console.log(onGood.data)
			// 将更新后的数据对象保存回云数据库中
			const res = await db.collection('message').where({
				_id: event._id,
				good: {
					userid: [userId]
				}
			}).update({
				good: onGood.data.good
			});
			return 'ok'
		} else {
			onGood = await db.collection('message').doc(event._id).get()
			const message = onGood.data[0]

			onGood.data = message;
			onGood.data.good.userid.push(userId);
			onGood.data.good.num = onGood.data.good.num + 1;
			console.log(onGood.data.good)
			// 将更新后的数据对象保存回云数据库中
			const res = await db.collection('message').doc(event._id).update({
				good: onGood.data.good
			});
			return 'good'
		}
	}

	//收藏
	if (event.api === 'onCollect') {
		let onGood = await db.collection('message').where({
			_id: event._id,
			shouChang: [userId]
		}).get()

		const message = onGood.data[0]

		if (message) {
			const userIds = message.shouChang
			// 找到要删除的元素在数组中的索引位置
			const index = userIds.indexOf(userId);
			// 如果找到了要删除的元素，则从数组中删除该元素
			if (index !== -1) {
				userIds.splice(index, 1);
			}
			// 更新对象中 good 对象和 userid 数组的值
			onGood.data = message;
			onGood.data.shouChang = userIds;
			// console.log(onGood.data)
			// 将更新后的数据对象保存回云数据库中
			const res = await db.collection('message').where({
				_id: event._id,
				shouChang: [userId]
			}).update({
				shouChang: onGood.data.shouChang
			});
			return 'ok'
		} else {
			onGood = await db.collection('message').doc(event._id).get()
			const message = onGood.data[0]

			onGood.data = message;
			onGood.data.shouChang.push(userId);
			// console.log(onGood.data.good)
			// 将更新后的数据对象保存回云数据库中
			const res = await db.collection('message').doc(event._id).update({
				shouChang: onGood.data.shouChang
			});
			return 'good'
		}
	}
};