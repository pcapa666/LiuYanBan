<template>
  <div class="container">
    <div class="form-group">
      <text class="form-label">反馈内容：</text>
      <textarea class="form-input" placeholder="请输入反馈内容" maxlength="200" bindinput="onContentInput"></textarea>
    </div>
    <div class="form-group">
      <text class="form-label">联系方式：</text>
      <input type="text" class="form-input" placeholder="请输入您的联系方式"/>
    </div>
	<div>
		<text class="form-label">反馈图片：</text>
	</div>
	<div>
		<u-button text="月落"></u-button>
	</div>
    <div class="form-group">
      <button class="submit-button" type="primary" disabled="{{submitDisabled}}" bindtap="onSubmit">提交</button>
    </div>
  </div>
</template>

<script>
	import { ref } from 'vue';
	
	const show = ref(true);
export default {
  data() { 
    return { 
		show:true,
		list:[
			{
				text:'ok'
			}
		]
    }
  },
  onLoad(){
	  console.log(uni.$u.config.v)
  }
}
</script>

<style lang="less">
	.container{
		 
	}
</style>