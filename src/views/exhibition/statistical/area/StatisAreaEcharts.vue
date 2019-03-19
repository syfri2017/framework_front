<template>
  <div id="statisAreaList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<div class="echartsBox staticStyle" style="relative">
        <div id="bar" class="echartsBoxLeft"></div>
        <div id="pie" class="echartsBoxRight"></div>
      </div>
      <div class="inform-content">
        <div class="table_container">
          <el-table id="table" border class="tableStyle" :height="tableheight" :data="this.tjfxtabledata" :row-style="rowStyle">
            <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
            <el-table-column prop="zwmjfwmc" label="展位面积范围" show-overflow-tooltip min-width="28%" align="center">
              <template slot-scope="scope">
                <a v-text="scope.row.zwmjfwmc" @click="toCompanyList(scope.row)"></a>
              </template>
            </el-table-column>
            <el-table-column prop="sl" label="展位数量" show-overflow-tooltip min-width="28%" align="center"></el-table-column>
          </el-table>
        </div>
        <el-row type="flex" justify="end" class="mt10 mb10">
          <el-col :span="15">
            <el-pagination layout="total" :total=parseInt(total)></el-pagination>
          </el-col>
          <div class="buttonExport">
            <el-button type="success" icon="el-icon-download" size="small" @click="exportClick">导出</el-button>
          </div>
        </el-row>
      </div>
		</div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入饼状图
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  data() {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
			//搜索表单
			searchForm: {
				dateStart: "",
				dateEnd: "",
			},
			tjfxbarData:"",
			//tabledata
			tjfxtabledata:[],
			//展位面积范围
			zwmjfwmc:[],
			zwmjfwmcsl:[],
			//pieTitle
			pieTitle: '',
			pieTitle0: '光地展位面积范围比例图',
		  pieDataz:[],
			//bardata
			tjfxname:[],
			//总记录数
			total: 0,
			//显示加载中样
			loading: false,
			//表高度变量
      tableheight: 291
    };
  },
  created: function() {
    this.getCPLX();
  },
  methods: {
    getCPLX: function () {
      let vm = this;
			var params = {};
			vm.$axios.post('/qyzwyx/dofindtjfxsj',params).then(function (res) {	
				this.tjfxtabledata = res.data.result;
				this.total = res.data.result.length;
				for(var i=0; i<this.tjfxtabledata.length;i++){
					this.zwmjfwmc.push(this.tjfxtabledata[i].zwmjfwmc)				
					this.zwmjfwmcsl.push(this.tjfxtabledata[i].sl)
					var arr1={};
					arr1.value=this.tjfxtabledata[i].sl
					arr1.name=this.tjfxtabledata[i].zwmjfwmc	
					//饼状图数据
					this.pieDataz.push(arr1)
				}
				//画柱状图
				this.barChart();
				//画饼图
				this.pieTitle=this.pieTitle0;
			  this.pieChart();
				this.loading = false;			
			}.bind(this), function (error) {
				console.log(error)
			})
		},

		// 左侧柱状图
		barChart: function () {
			var myChart = echarts.init(document.getElementById('bar'));
			var optionBar = {
				title: {
					text: '按光地展位面积范围统计展位数量',
					x: 'center',
					y: '-3'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					top: '30',
					bottom: '10',
					left: '15',
					right: '20',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: this.zwmjfwmc,
						axisLabel: {
							interval: 0,
						},
					}
				],
				yAxis: [
					{ 
						name:'数量',
						type: 'value',
						minInterval : 1,
						splitLine: {
							show: false
						},
					}
				],
				
				series: [
					{
						name: '数量',
						type: 'bar',
						barWidth: '100%',
						stack: '面积',
						barWidth: '45',
						//柱状图
						data:this.zwmjfwmcsl,
						smooth: true,
						// color: ['#ff6364', '#fdc107', '#29bb9d'],
						itemStyle: {
							normal: {
								barBorderRadius: [5, 5, 0, 0],
								color: function(params) {
									var colorList = ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B','#FE8463'];
									return colorList[params.dataIndex]
								},
								opacity: 0.85
							}
						}
					}
				]
			};
			myChart.setOption(optionBar);
		},

		// 右侧玫瑰图
		pieChart: function () {
			var myChart = echarts.init(document.getElementById('pie'));
			var optionPie = {
				title: {
					text: this.pieTitle,
					left: 'center',
					top: -3,
				},
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					x: '68%',
					y: 'center',
					itemGap: 16,
					itemWidth: 18,
					data:this.pieDataz.name,
					align: 'right',
					itemGap: 8,
				},
				series: [
					{
						name: this.pieTitle,
						type: 'pie',
						radius: '46.5%',
						center: ['35%', '50%'],
						data:this.pieDataz,
						label: {
							show: true,
							formatter: '{d}%',
						},
						labelLine: {
							show: true,
							length: 5
						},
						animationType: 'scale',
						animationEasing: 'elasticOut',
						animationDelay: function (idx) {
							return Math.random() * 200;
						},
						itemStyle: {
							normal: {
								opacity: 0.85
							}
						}
					}
				],
				color: ['#C1232B','#B5C334','#FCCE10','#E87C25','#27727B','#FE8463']
			};
			myChart.setOption(optionPie);
    },
    
    //导出EXCEL
    exportClick: function () {
			window.open(window.config.domain + "/qyzwyx/doExportTjfxByZwmjfw");
    },
    
    //跳转到企业列表
		toCompanyList: function (val) {
      this.$router.push({name:"statisAreaList", query: {zwmjfw: val.zwmjfw}});
		}
  }
};
</script>

