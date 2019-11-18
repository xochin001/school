<template>
	<view>
		<swiper class="card-swiper " :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
		 indicator-active-color="#B01C11">
			<swiper-item v-for="(item,index) in List" :key="index" :class="cardCur==index?'cur padding-sm':''">
				<view class="swiper-item" @click="gotoCurPage(item ,index)">
						<image :src="item.url" mode="aspectFill"></image>
					<view class="infomation bg-white">
						<view class="menu-title">
							<view class="title text-xxl ">
								{{item.title}}
							</view>
							<view class="sub-title text-lg  margin-tb-sm">
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
</template>

<script>
	export default {
		name:'swperbanner',
		props:{
			List:Array,
		},
		data(){
			return{
				dotStyle: true,
				cardCur:0,
			}
		},
		methods:{
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			gotoCurPage(e , p){
				// let datainfo = JSON.stringify(e)
				if(this.cardCur == p){
					let address = e.address
					let type= e.title
					uni.navigateTo({
						url: address +'?datainfo=' +type
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			font-weight: 530;
		}
		.sub-title{
			margin-left:42upx;
			color: #A1A1A1;
			letter-spacing: 1upx;
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
</style>
