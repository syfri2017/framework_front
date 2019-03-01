<template>
<!--列表底部工具条和分页符-->
	<el-col :span="18">
		<el-pagination @size-change="pageSizeChange"
			@current-change="currentPageChange" 
			:current-page="this.$parent.$parent.currentPage"
			:page-sizes="[10, 20, 30]" 
			:page-size="this.$parent.pageSize" 
			layout="total, sizes, prev, pager, next, jumper" 
			:total=parseInt(this.$parent.$parent.total)>
		</el-pagination>
	</el-col>
</template>

<script>
export default {
	methods: {
		//当前页修改事件
        currentPageChange : function(val) {
            if(this.$parent.$parent.currentPage != val){
                this.$parent.$parent.currentPage = val;
                this.$parent.$parent.searchClick('page');
            }
        },
        //分页大小修改事件
        pageSizeChange : function(val) {
            this.$parent.$parent.pageSize = val;
            if(val == 10){
                this.$parent.$parent.tableheight = this.CONSTANT.tableheight10;
            }else if(val == 20){
                this.$parent.$parent.tableheight = this.CONSTANT.tableheight20;
            }else if(val == 30){
                this.$parent.$parent.tableheight = this.CONSTANT.tableheight30;
            }
            this.$parent.$parent.searchClick('page');
        },
	}
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>