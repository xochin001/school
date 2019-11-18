<template>
	<view class="title-img  bg-white">
			<image :src="url" mode="widthFix" class="title"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				url:'',
			}
		},
		methods:{
			async defaultset(){
				this.url = await this.$api.base('hometitle')
			}
		},
		mounted(){
			this.defaultset()
		}
	}
</script>

<style>
	.title-img {
		height: 104upx;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.title{
		height: 72upx;
		width: 704upx;
	}
</style>
