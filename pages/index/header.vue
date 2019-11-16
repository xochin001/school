<template>
		<view class="navbg">
			<view class="logo-title">
				<image :src="info.logo" mode="widthFix" class="logo "></image>
			</view>
			<view class="music-view">
				<image :src="info.music" mode="widthFix" class="music-btn"></image>
			</view>
			<view class="word-view">
				<image :src="info.wordleft" mode="widthFix" class="word-left "></image>
					<image :src="info.wordright" mode="widthFix" class="word-right"></image>
			</view>
		</view>
</template>

<script>
	export default {
		name:'homepageheader',
		props: {
			info:Object,
		},
		created() {
			
		}
		
	}
</script>

<style>
	.navbg{
		height: 399upx;
		width: 100vw;
		background-image: url("http://q0w0nmycu.bkt.clouddn.com/%E8%83%8C%E6%99%AF@3x.png");
		background-size: cover;
		position: absolute;
	}
	.logo-title{
		position: relative;
		top:80upx;
		left:10upx;
	}
	.logo{
		width: 356upx;
		height: 48upx;
	}
	.music-view{
		width: 56upx;
		height: 56upx;
		 position: relative;
		 top:260upx;
		left: 26upx;
	}
	.music-btn{
		width: 100%;
		height: 100%;
	}
	.word-view{
		position: relative;
		top:40upx;
		left:592upx;
	}
	.word-left{
		width:24upx;
		height: 400upx;
		position: absolute;
		top:5upx;
		left: 0;
	}
	.word-right{
		width:24upx;
		height: 400upx;
		position: absolute;
		top: 30upx;
		margin-left:60upx;
	}
</style>
