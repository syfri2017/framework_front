<template>
  <div id="positionList" class="ploterstyle">
   <div class="main-container" v-loading="loading" element-loading-text="加载中">
				<div id="tableView">
					<el-row>
						<el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
							<el-row>
								<el-col :span="8" class="searchInline">
									<label class="el-form-item__label searchLabel">展位编号</label>
									<el-input size="small" v-model="searchForm.zwh" placeholder="展位编号" clearable></el-input>
								</el-col>
								<el-col :span="8" class="searchInline">
									<label class="el-form-item__label searchLabel">公司名称</label>
									<el-input size="small" v-model="searchForm.qymc" placeholder="公司名称" clearable></el-input>
								</el-col>
								<el-col :span="8" class="searchInline">
									<label class="el-form-item__label searchLabel">展位类型</label>
									<el-select size="small" v-model="searchForm.zwlb" placeholder="全部" class="searchSelect" clearable>
										<el-option v-for="item in zwlbData" :key="item.name" :label="item.name" :value="item.name"></el-option>
									</el-select>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="8" class="searchInline">
									<label class="el-form-item__label searchLabel">出口类型</label>
									<el-select size="small" v-model="searchForm.cklx" placeholder="全部" class="searchSelect" clearable>
										<el-option v-for="item in cklxData" :key="item.codeValue" :label="item.codeName" :value="item.codeName"></el-option>
									</el-select>
								</el-col>
								<el-col :span="8" class="searchInline">
									<label class="el-form-item__label searchLabel">展位状态</label>
									<el-select size="small" v-model="searchForm.zwzt" placeholder="全部" class="searchSelect" clearable>
										<el-option v-for="item in dataStatus" :key="item.value" :label="item.name" :value="item.value"></el-option>
									</el-select>
								</el-col>
							</el-row>
							<div>
								<el-form>
									<el-col :span="12">
										<el-form-item align="left">
											<el-button type="success" icon="el-icon-download" size="small" @click="exportClick">导出</el-button>
											<el-button type="warning" icon="el-icon-document" size="small" @click="analysisClick">分析</el-button>
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
						<el-table border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" class="tableStyle" :height="tableheight"
						   :row-style="rowStyle">
							<!-- modify by yushch 20181218
							<el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
							<el-table-column prop="zwh" show-overflow-tooltip label="展位编号" min-width="15%" align="center"></el-table-column>
							<el-table-column prop="zwmc" show-overflow-tooltip label="展位名称" min-width="15%" align="center"></el-table-column>
							<el-table-column prop="zwmj" show-overflow-tooltip label="展位面积" min-width="15%" align="center"></el-table-column>
							<el-table-column prop="zwzt" label="展位状态" show-overflow-tooltip min-width="10%" align="center">
								<template slot-scope="scope">
									<div>
										<span v-if="scope.row.zwzt == 'completed'" v-text="scope.row.zwztmc" style="color:#199200"></span>
										<span v-else-if="scope.row.zwzt == 'allotted'" v-text="scope.row.zwztmc" style="color:#f00000"></span>
										<span v-else-if="scope.row.zwzt == 'bespoke'" v-text="scope.row.zwztmc" style="color:#827700"></span>
										<span v-else-if="scope.row.zwzt == 'normal'" v-text="scope.row.zwztmc" style="color:#666"></span>
										<span v-else v-text="scope.row.zwztmc"></span>
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="qymc" show-overflow-tooltip label="公司名称" min-width="15%" align="center">
								<template slot-scope="scope">
									<a v-if="scope.row.usertype == 'ENG'" v-text="scope.row.qymc" @click="qyDetails(scope.row)"></a>
									<a v-else v-text="scope.row.qymc" @click="qyDetails(scope.row)"></a>
								</template> 
							</el-table-column>
						-->
							<el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
							<el-table-column prop="zwh" show-overflow-tooltip label="展位编号" min-width="8%" align="center"></el-table-column>
							<el-table-column prop="qymc" show-overflow-tooltip label="公司名称" min-width="22%" align="center">
								<template slot-scope="scope">
									<a v-if="scope.row.usertype == 'ENG'" v-text="scope.row.qymc" @click="qyDetails(scope.row)"></a>
									<a v-else v-text="scope.row.qymc" @click="qyDetails(scope.row)"></a>
								</template>
							</el-table-column>
							<el-table-column prop="zwmj" show-overflow-tooltip label="展位面积" min-width="8%" align="center"></el-table-column>
							<el-table-column prop="zwlb" show-overflow-tooltip label="展位类型" min-width="8%" align="center"></el-table-column>
							<el-table-column prop="cklx" show-overflow-tooltip label="出口类型" min-width="8%" align="center"></el-table-column>
							<el-table-column prop="zwztmc" show-overflow-tooltip label="展位状态" min-width="10%" align="center">
								<template slot-scope="scope">
                                    <div>
										<span v-text="scope.row.zwztmc" :style="changeFontColor(scope.row)"></span>
                                    </div>
                                </template>
							</el-table-column>
							<!--
							<el-table-column prop="lxr" show-overflow-tooltip label="联系人名称" min-width="10%" align="center"></el-table-column>
							<el-table-column prop="lxrsj" show-overflow-tooltip label="联系人电话" min-width="10%" align="center"></el-table-column>
							<el-table-column prop="yjdzxx" show-overflow-tooltip label="联系地址" min-width="10%" align="center"></el-table-column>
							-->
							<el-table-column label="付款操作" width="80" align="center">
								<template slot-scope="scope">
									<el-button v-if="scope.row.zwzt=='bespoke'" type="text" @click="changePaid(scope.row,'1')">付款</el-button>
									<el-button v-if="scope.row.zwzt=='completed'" type="text" @click="changePaid(scope.row,'2')">取消付款</el-button>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="80" align="center">
								<template slot-scope="scope">
									<el-button v-if="scope.row.zwzt=='bespoke'" type="text" @click="cancleVenue(scope.row)">取消指定</el-button>
								</template>
							</el-table-column>
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
  name: "positionList",
  components: {
    paginator
  },
  data: function () {
        return {
            //搜索表单
            searchForm: {
                //zwmc: "",
                //zwzt: "",
                //qymc: ""
                zwh: "",
                qymc: "",
                zwlb: "",
                cklx: "",
                zwzt: ""
            },
            //导出条件
            exportForm: {
                zwh: "",
                qymc: "",
                zwlb: "",
                cklx: "",
                zwzt: ""
            },
            //表数据
            tableData: [],
              //table高度
            tableheight: this.CONSTANT.tableheight10,
            allRoles: [],
            //显示加载中样
            loading: false,
            labelPosition: 'right',
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total: 0,
            // //表高度变量
            // tableheight: 291,
            //序号
            indexData: 0,
            //登陆用户
            dataStatus: [{
                name: '新建展位',
                value: 'normal'
            }, {
                name: '已分配展位',
                value: 'allotted'
            }, {
                name: '已预定展位',
                value: 'bespoke'
            }, {
                name: '已确定展位',
                value: 'completed'
            }],
            //出口类型下拉框
            cklxData: [],
            //展位类型下拉框
            zwlbData: [{
                name:'标准展位'
                
            },{
                name:'光地'
                
            }]
        }
    },
    created: function () {
        //展位类型
        //this.getZwlb();
        //出口类型
        this.getCklx();
        this.searchClick('click');
        /**delete by yushch 20181218 前台报错暂时注掉 */
        //this.closeleft();
    },

    methods: {
        //展位类别下拉框
        /*光地区分室内室外，不查代码集
        getZwlb: function () {
              let vm = this; 	  
              vm.$axios.get('/codelist/getCodetype/ZWLX').then(function (res) {
                this.zwlbData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        */
        //出口类型下拉框
        getCklx: function () {
              let vm = this; 	  
              vm.$axios.get('/codelist/getCodetype/CKLX').then(function (res) {
                this.cklxData = res.data.result;
            }.bind(this), function (error) {
                console.log(error);
            })
        },
        //企业详情跳转
        qyDetails: function (val) {
        this.$router.push({name:"exhpredictionDetail", query: {id: val.qyid, type: 'search'}});
        },
        //表格查询事件
        searchClick: function (type) {
            //按钮事件的选择
            this.tableData = [];
            if (type != 'page') {
              this.currentPage = 1;
            }
            var _self = this;
            _self.loading = true;//表格重新加载
            var params = {
                zwh: this.searchForm.zwh.replace(/%/g, "\\%"),
                qymc: this.searchForm.qymc.replace(/%/g, "\\%"),
                zwlb: this.searchForm.zwlb.replace(/%/g, "\\%"),
                cklx: this.searchForm.cklx.replace(/%/g, "\\%"),
                zwzt: this.searchForm.zwzt.replace(/%/g, "\\%"),
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
              let vm = this; 	 
               vm.$axios.post('/zwjbxx/doSearchListQyByVO', params).then(function (res) {

                var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
                this.tableData = tableTemp.concat(res.data.result.list);
                this.total = res.data.result.total;
                _self.loading = false;
                //add by yushch 20181219 查询成功后保存查询条件到变量用作导出条件
                this.exportForm.zwh = this.searchForm.zwh.replace(/%/g, "\\%");
                this.exportForm.qymc = this.searchForm.qymc.replace(/%/g, "\\%");
                this.exportForm.zwlb = this.searchForm.zwlb.replace(/%/g, "\\%");
                this.exportForm.cklx = this.searchForm.cklx.replace(/%/g, "\\%");
                this.exportForm.zwzt = this.searchForm.zwzt.replace(/%/g, "\\%");
            }.bind(this), function (error) {
                console.log(error)
            })
        },
        //清空查询条件
        clearClick: function () {
            this.searchForm.zwh = "";
            this.searchForm.zwzt = "";
            this.searchForm.qymc = "";
            this.searchForm.zwlb = "";
            this.searchForm.cklx = "";
            this.searchClick('reset');
        },
        //表格重新加载数据
        loadingData: function () {
            var _self = this;
            _self.loading = true;
            setTimeout(function () {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },
        //展位管理导出功能 add by yushch 20181219
        exportClick: function () {
            var param = this.exportForm.zwh + "," + this.exportForm.zwzt + "," + this.exportForm.qymc + "," + this.exportForm.zwlb + "," + this.exportForm.cklx;
            window.open(window.config.domain+"/zwjbxx/doExport/" + param);
        },
        //展位分析功能 add by yushch 20181228
        analysisClick: function () {
            this.$router.push({ path: '/booth/position/analysis'});            
        },
        //取消指定
        cancleVenue: function (val) {
            this.$confirm('展位 ' + val.zwh + ' 确定取消指定?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    uuid: val.uuid
                }
                  let vm = this; 	  
                  vm.$axios.post('/zwjbxx/doCancelByVO', params).then(function (res) {
                    if (res.data.result.qyid == null && res.data.result.zwzt == 'normal') {
                        this.$message.success('展位 ' + res.data.result.zwh + ' 已成功取消指定');
                        this.searchClick('page');
                    }
                }.bind(this), function (error) {
                    console.log(error)
                })
            }).catch(() => {
                // this.$message.info('已取消删除');
            });
        },
        //更改字体颜色
        changeFontColor: function(val){
            if(val.zwzt == 'normal'){
                return 'color:#e40613';
            }else if(val.zwzt == 'bespoke'){
                return 'color:#f7962f';
            }else if(val.zwzt == 'completed'){
                return 'color:#42D885';
            }
        },
        //更改付款状态
        changePaid: function (val,operation) {
            //完成付款
            if(operation == '1'){
                this.$confirm('展位 ' + val.zwh + ' 确定修改展位状态为【已确定展位】?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = {
                        uuid: val.uuid,
                        zwzt:'completed',
                    }
                      let vm = this; 	 
                       vm.$axios.post('/zwjbxx/changePaid', params).then(function (res) {
                        if (res.data.result.zwzt == 'completed') {
                            this.$message.success('展位 ' + res.data.result.zwh + ' 展位状态修改成功');
                            this.searchClick('page');
                        }else{
                            this.$message.error('展位 ' + res.data.result.zwh + ' 展位状态修改失败');
                            this.searchClick('page');
                        }
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }).catch(() => {
                    // this.$message.info('已取消删除');
                });
            }else{//取消付款
                this.$confirm('展位 ' + val.zwh + ' 确定修改展位状态为【已预定展位】?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = {
                        uuid: val.uuid,
                        zwzt:'bespoke',
                    }
                      let vm = this; 	 
                       vm.$axios.post('/zwjbxx/changePaid', params).then(function (res) {
                        if (res.data.result.zwzt == 'bespoke') {
                            this.$message.success('展位 ' + res.data.result.zwh + ' 展位状态修改成功');
                            this.searchClick('page');
                        }else{
                            this.$message.error('展位 ' + res.data.result.zwh + ' 展位状态修改失败');
                            this.searchClick('page');
                        }
                    }.bind(this), function (error) {
                        console.log(error)
                    })
                }).catch(() => {
                    // this.$message.info('已取消删除');
                });
            }
            
        },
    }
};
</script>

