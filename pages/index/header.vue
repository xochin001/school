<template>
		<view class="navbg" :style="'background-image:url('+navbg+')'">
			<view class="logo-title">
				<image :src="infos.logo" mode="widthFix" class="logo "></image>
			</view>
			<view class="music-view">
				<image :src="infos.music" mode="widthFix" class="music-btn"></image>
			</view>
			<view class="word-view">
				<image :src="infos.wordleft" mode="widthFix" class="word-left "></image>
					<image :src="infos.wordright" mode="widthFix" class="word-right"></image>
			</view>
		</view>
</template>

<script>
	export default {
		name:'homepageheader',
		props: {
			info:Object,
		},
		watch:{
			info(val){
				this.infos = val
				this.navbg = this.infos.navbg
			}
		},
		created() {

		},
		data(){
			return{
				infos:{},
				navbg:'',
			}
		}
		
	}
</script>

<style>
	.navbg{
		height: 399upx;
		width: 100vw;
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
		top:30upx;
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
