<template>
  <div id="positionAnalysis">
     <div class="main-container" v-loading="loading" element-loading-text="加载中">
                <div id="tableView">
                    <el-row>
                        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
                            <el-form-item label="展馆名称" prop=searchForm.zgmc>
                                <el-checkbox-group v-model="selectedZg">
                                    <el-checkbox v-for="item in zgData" :label="item.zgmc" :key="item.uuid" checked>{{item.zgmc}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                           <div>
								<el-form>
									<el-col :span="12" align="left">
                                        <el-form-item>
                                            <el-button type="success" icon="el-icon-download" size="small" @click="exportClick">导出</el-button>
                                        </el-form-item>
                                    </el-col>
									<el-col :span="12" class="btnSearchPlus">
										<el-form-item>
											<el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
											<el-button type="clear" icon="el-icon-refresh" size="small" @click="clearClick">重置</el-button>
										</el-form-item>
									</el-col>
								</el-form>
							</div>
                        </el-form>
                    </el-row>
                    <div class="table_container">
                        <el-table id="table" border class="tableStyle" :height="tableheight" :row-style="rowStyle" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                            <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
                            <el-table-column prop="gsmc" label="公司名称" show-overflow-tooltip min-width="25%" align="center">
                            </el-table-column>
                            <el-table-column prop="lxr" label="联系人" show-overflow-tooltip min-width="12%" align="center"></el-table-column>
                            <el-table-column prop="lxrsj" label="联系人电话" show-overflow-tooltip min-width="13%" align="center"></el-table-column>
                            <el-table-column prop="zwnum" label="展位数量" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
                            <el-table-column prop="zwh" label="展位号" show-overflow-tooltip min-width="32%" align="center"></el-table-column>
                        </el-table>
                        <!--翻页组件-->
                        <el-row type="flex" justify="end">
                          <paginator></paginator>
                        </el-row>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
//引入翻页 paginator
import paginator from "@/components/paginator";
export default {
  name: "positionType",
  components: {
    paginator
  },
  data: function () {
        return {
            //搜索表单
            searchForm: {
                zgmc:'',
            },
            tableData: [],//列表信息
              //table高度
            tableheight: this.CONSTANT.tableheight10,
            zgData:[],//展馆名称
            selectedZg:[],//选中展馆
            exportSelectedZg:[],//导出时选中的展馆号
            //显示加载中样
            loading: false,
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
        }
    },
    created: function () {
        this.getZgmc();
        this.searchClick();
    },
    methods: {
        //获取展馆名称
        getZgmc: function (){
            let vm = this;
	          vm.$axios.get('/zgjbxx/getZgmc').then(function (res) {
                this.zgData = res.data.result;
                this.zgData.push({
                    zgmc:"W3"
                });
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //表格查询事件
        searchClick: function () {
            this.loading = true;//表格重新加载
            var param={
                zgList:this.selectedZg,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
            let vm = this;
	          vm.$axios.post('/zwjbxx/doFindQyZwNumDesc', param).then(function (res) {
                this.exportSelectedZg = this.selectedZg;
                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                this.loading = false;
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //重置
        clearClick: function () {
            this.selectedZg = [];
            for(var i in this.zgData){
                this.selectedZg.push(this.zgData[i].zgmc);
            }
            this.searchClick();
        },
        //导出 add by yushch 20190107
        exportClick: function () {
            var param = '';
            for(var i in this.exportSelectedZg){
                param += this.exportSelectedZg[i];
                if(i < this.exportSelectedZg.length-1){
                    param += ',';
                }
            }
           window.open(window.config.domain+"/zwjbxx/doExporTanalysis/" + param);
        },
    }
};
</script>
