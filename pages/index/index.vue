<template>
	<view class="page ">
		<skele-ton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></skele-ton>
			<headers  :info="infos"/>
			<view class="content tui-skeleton">
				<title-Info />
					<view class="banner-content tui-skeleton-rect">
					<swper-banner :List="swiperList" />
					</view>
				<view class="footer-content tui-skeleton-rect" :style="'background-image: url('+footbg+');background-size:cover'" >
					<image :src="foot.foottitle"  class="fooimg"></image>
				</view>
			</view>
		<Loading  ref="loading"/>
	</view>
</template>

<script>
	import headers from './header'
	import titleInfo from './titleinfo'
	import swperBanner from '@/pages/component/swper-banner'
	import skeleTon from '@/components/tui-skeleton/tui-skeleton'
	import {get }from '@/pages/utils/request'
	export default {
		components:{
			headers,
			titleInfo,
			swperBanner,
			skeleTon,
		},
		data() {
			return {
				infos:{},
				swiperList:[],
				foot:{},
				footbg:'',
				skeletonShow:true,
			}
		},
		mounted() {
			this.defaultSet()
		},
		methods: {
			async defaultSet(){
				this.$refs.loading.open()
				this.infos = await this.$api.base('homeheader')
				const swiperList = await get('/api/30/showbanner')
				this.swiperList = swiperList.res
				this.foot = await this.$api.base('foot')
				this.footbg = this.foot.footbg
				this.skeletonShow = false
				 this.$refs.loading.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		height: 100vh;
	}
	.content{
		position: absolute;
		top:400upx;
		
	}
	.banner-content{
		height: 720upx;
		width: 100vw;
		background: #F7F7F7;
	}
	
	.footer-content{
		width: 100vw;
		height: 110upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.fooimg{
			width: 400upx;
			height: 44upx;	
		}
	}
</style>
