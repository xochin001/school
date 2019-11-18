<template>
	<swiper class="subcard-swiper "  :indicator-dots="false" :circular="true"
	 :autoplay="true" interval="5000" duration="500" @change="cardSwiper" >
		<swiper-item v-for="(item,index) in List" :key="index" :class="cardCur==index?'cur padding-sm':''">
			<view class="swiper-item" @click="gotoCurPage(item ,index)">
					<image :src="item.url" mode="aspectFill"></image>
					<view class="title">{{item.title}}</view>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		name:'contentbanner',
		props:{
			subList:Array
		},
		data(){
			return{
				cardCur:0
			}
		},
		methods:{
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title{
		position: absolute;
		
		background-color: rgba(200,200,200,0.2);
	}
</style>
