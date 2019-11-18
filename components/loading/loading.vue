<template>
	<view class="cu-load load-modal" v-if="loadModal">
		<image :src="loadingurl" mode="aspectFit"></image>
		<view class="gray-text">加载中...</view>
	</view>
</template>

<script>
	export default {
		 name: "loading",
		// props:{
		// 	loadModal: {
		// 		type:Boolean,
		// 		default: false,
		// 	}
		// },
		data(){
			return {
				loadingurl:'/static/base/biaozhi.jpg',
				loadModal : false
			}
		},
		methods:{
			open(){
				this.loadModal = true
			},
			close(){
				this.loadModal = false
			}
		}
	}
</script>

<style>
	
</style>
