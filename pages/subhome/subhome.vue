<template>
	<view class="pages">
		<view class="navbg" >
			<view class="navicon" >
				<image :src="back" mode="aspectFill" @tap="getback"></image>
			</view>
			<view class="title-content">
					<image :src="titles.schooltitle" mode="aspectFit" class="logo-title"></image>
					<image :src="titles.schoolsubtitle" mode="aspectFit" class="sub-title"></image>
				</view>
			</view>
		<view class="content">
			<view class="swper-content">
				<swper-banner :List="List" />
			</view>
			<view class="footer-content" :style="'background-image: url('+footbg+');background-size:cover'" >
				<image :src="foot.foottitle"  class="fooimg"></image>
			</view>
		</view>
	<Loading  ref="loading"/>
	</view>
</template>

<script>
	import swperBanner from '@/pages/component/swper-banner'
	export default {
		name:'subhome',
		components:{
			swperBanner,
		},
		data() {
			return {
				titles:{},
				List:[],
				data:'',
				foot: { },
				footbg:'',
				back: '/static/base/reback.png',
				
			}
		},
		onLoad(options){
			this.data = options.datainfo
			this.defaultset()
		},
		methods: {
			async defaultset(){
				this.$refs.loading.open()
				const temp  = await this.$api.base('subtitle')
				temp.info.forEach( item=>{
					if(this.data == item.name){
						this.titles = item
					}
				})
				// this.List = await this.$api.base('homebanner')
				const p = await this.$api.base('subpage')
				p.info.forEach( item =>{
					if(this.data == item.name){
						this.List = item.children
					}
				})
				this.foot = await this.$api.base('subfoot')
				this.footbg = this.foot.footbg
				this.$refs.loading.close()
			},
			getback(){
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.pages{
		 height: 100vh;
	}
	.navbg{
		height: 399upx;
		width: 100vw;
		background-image: url("https://30img.indoormap.com.cn/%E8%83%8C%E6%99%AF@3x.png");
		background-size: cover;
		position: absolute;
	
	}
	.navicon {
		position: relative;
		top:60upx;
		left:20upx;
		image{
			width: 25upx;
			height: 36upx;
		}
	}
	.title-content {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		top:62upx;
		height: 286upx;
	}
	.logo-title{
		height: 80upx;
		width: 164upx;
	}
	.sub-title{
		margin-top: 20upx;
		height: 56upx;
		width: 350upx;
	}
	.content{
		position: absolute;
		width: 100vw;
		top: 400upx;
		background: #F7F7F7;
	}
	.swper-content{
		position: relative;
		top:0;
		height: 720upx;
		width: 100vw;
		background: #F7F7F7;
	}
	.footer-content{
		position: relative;
		top:54upx;
		width: 100vw;
		height: 164upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.fooimg{
			width: 498upx;
			height: 60upx;	
		}
	}
</style>
