<template>
	<view >
		<headers  :info="infos"/>
		<view class="content ">
			<title-Info />
				<view class="banner-content ">
					<swiper class="card-swiper " :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
					 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
					 indicator-active-color="#B01C11">
						<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur padding-sm':''">
							<view class="swiper-item">
									<image :src="item.url" mode="aspectFill"></image>
								<view class="infomation bg-white">
									<view class="menu-title">
										<view class="title text-xxl text-bold">
											{{item.title}}
										</view>
										<view class="sub-title text-lg text-bold margin-tb-sm">
											{{item.subtitle}}
										</view>
									</view>
									<view class="go-btn">
										<text class="cuIcon-back_android text-bold" style=" transform: rotateY(180deg); " ></text>
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			<view class="footer-content" :style="'background-image: url('+footurl+');background-size:cover'" >
				<image :src="footimg"  class="fooimg"></image>

			</view>
		</view>
	</view>
</template>

<script>
	import headers from './header'
	import titleInfo from './titleinfo'
	export default {
		components:{
			headers,
			titleInfo
		},
		data() {
			return {
				infos:{
					logo:'/static/logo.png',
					music:'/static/music-btn.png',
					wordleft:'/static/wordleft.png',
					wordright:'/static/wordright.png',
				},
				dotStyle: false,
				cardCur:0,
				swiperList:[{
					id:0,
					title:'学校篇',
					subtitle:'巍巍学府，源远流长',
					url:'/static/test1.png'
				},{
					id:1,
					title:'学校篇',
					subtitle:'巍巍学府，源远流长',
					url:'/static/test1.png'
				},{
					id:2,
					title:'学校篇',
					subtitle:'巍巍学府，源远流长',
					url:'/static/test1.png'
				}],
				footurl:'/static/footerbg.png',
				footimg:'/static/footitle.png',
			}
		},
		onLoad() {

		},
		methods: {
			DotStyle(e) {
				this.dotStyle = e.detail.value
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
		}
	}
</script>

<style lang="scss">
	.content{
		position: absolute;
		top:400upx;
		
	}
	.banner-content{
		height: 720upx;
		width: 100vw;
		background: #F7F7F7;
	}
	.images{
		width: 606upx;
		height: 440upx;
		overflow: hidden;
	}
	.infomation {
		height: 34%;
		width: 100%;
		display: flex;
		align-items: center;
		
	}
	.menu-title {
		height: 90upx;
		flex-basis: 80%;
		.title{
			margin-left: 42upx;
			color:#B01C11;
		}
		.sub-title{
			margin-left:42upx;
			color: #A1A1A1;
			letter-spacing: 2upx;
		}
	}
	.go-btn {
		height: 90upx;
		flex-basis: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		color:#B01C11;
		font-size: 38upx;
	}
	.footer-content{
		width: 100vw;
		height: 80upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.fooimg{
			width: 400upx;
			height: 44upx;	
		}
	}
</style>
