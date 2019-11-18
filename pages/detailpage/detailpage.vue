<template>
	<view class="pages tui-skeleton">
		<view class="navbg" >
			<view class="navicon" >
				<image :src="back" mode="aspectFill" @click="getback()" ></image>
			</view>
			<view class="title-content">
				<view class="logo-content">
					<image :src="logo" mode="aspectFit" class="logo " @click="abc"></image>
					<image :src="titles.schooltitle" mode="aspectFit" class="logo-title"></image>
				</view>
					<image :src="titles.schoolsubtitle" mode="aspectFit" class="sub-title"></image>
				</view>
		</view>
			<view class="swper-content">
				<sub-banner :subList="subList" /> 
			</view>
			<view class="prase-content">
				<!-- 内容标题 -->
				<view class="content-title margin-tb-sm ">
					<text class="cuIcon-title text-red" />
					<text class="title margin-lr-xs text-red text-bold">改革开放中诞生</text>
					<text class="cuIcon-title text-red"/>
				</view>
			</view>
			<!-- 左回退图标 -->
			<view class="leftback">
				<image src="/static/base/next.png" mode="aspectFit"></image>
			</view>
			<!-- 右前进图标 -->
			<view class="rightfont">
				<image src="/static/base/nextpre.png" mode="aspectFit"></image>
			</view>
		<skele-ton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></skele-ton>
			<Loading  ref="loading"/>
	</view>
</template>

<script>
	import skeleTon from '@/components/tui-skeleton/tui-skeleton'
	import subBanner from '@/pages/component/content-banner'
	export default {
		name:'detailpage',
		components:{
			skeleTon,
			subBanner,
		},
		data() {
			return {
				logo: '',
				skeletonShow:true,
				titles:{},
				back: '/static/base/reback.png',
				subList:[],
			};
		},
		onLoad(options){
			this.defaultset()
			this.info = options.datainfo
		},
		methods:{
			 async defaultset(){
				this.$refs.loading.open()
				const Logo=  await this.$api.base('detaillogo')
				this.logo = Logo.detaillogo
				const temp  = await this.$api.base('subtitle')
				temp.info.forEach( item=>{
					if(this.info == item.name){
						this.titles = item
					}
				})
				const infos = await this.$api.base('detailbanner')
				this.subList = infos
				 this.$refs.loading.close()
				this.skeletonShow = false
			},
			getback(){
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pages{
		background: #F7F7F7;
	}
	.navbg{
		height: 242upx;
		width: 100vw;
		background-image: url("https://30img.indoormap.com.cn/%E8%83%8C%E6%99%AF@3x.png");
		background-size: cover;
		position: relative;
	
	}
	.navicon {
		position: absolute;
		top:60upx;
		left:20upx;
		width:50upx;
		image{
			width: 25upx;
			height: 36upx;
			
		}
	}
	.title-content {
		width: 100%;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		 flex-direction: column;
		top:100upx;
		height: 140upx;	
	}
	.logo-content {
		display: flex;
		flex-direction: row;
	}
	.logo{
		height: 60upx;
		width: 60upx;
	}
	.logo-title{
		margin-left:10upx;
		height: 60upx;
		width: 90upx;
	}
	.sub-title{
		display: block;
		height: 44upx;
		width: 288upx;
	}
	.swper-content{
		position: relative;
		top:0upx;
		height: 300upx;
		width: 100vw;
		background: #F7F7F7;
	}
	.prase-content{
		position: relative;
		margin: 0upx auto;
		width: 98%;
		height: 500upx;
	}
	.content-title {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.leftback {
		position: fixed;
		top:1000upx;
		left:14upx;
		image{
			width: 36upx;
			height: 152upx;
		}
	}
	.rightfont {
		position: fixed;
		top:1000upx;
		right:14upx;
		image{
			width: 36upx;
			height: 152upx;
		}
	}
</style>
