<template>
  <div id="statisConfirmList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row class="mb5">
        <el-form>
          <el-form-item label="确认时间">
            <el-date-picker v-model="dataRange" @change="getAllData" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" size="small"></el-date-picker>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="echartsBox staticStyle" style="relative">
        <div id="bar" class="echartsBoxLeft"></div>
        <div id="pie" class="echartsBoxRight"></div>
      </div>
      <div class="inform-content">
        <div class="table_container">
          <el-table id="table" border class="tableStyle" :height="tableheight" :data="tjfxtabledata" :row-style="rowStyle">
            <el-table-column prop="qrztmc" label="是否进行信息确认" show-overflow-tooltip min-width="30%" align="center">
              <template slot-scope="scope">
                <a v-text="scope.row.qrztmc" @click="toCompanyList(scope.row)"></a>
              </template>
            </el-table-column>
            <el-table-column prop="qrztsl" label="企业数量" show-overflow-tooltip min-width="30%" align="center"></el-table-column>
            <el-table-column prop="qrztpercent" label="比重" show-overflow-tooltip min-width="30%" align="center">
              <template slot-scope="scope">
                <span v-text="scope.row.qrztpercent+'%'"></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
		</div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
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
      dataRange: [],
			date_start: '',
			date_end: '',
			//tabledata
			tjfxtabledata: [],
			//柱图
			name_X: [],
			value_Y: [],
			//饼图
			pieTitle: '是否信息确认企业数量比例图',
			pieDataz: [],
			//总记录数
			total: 0,
			//显示加载中样
			loading: false,
			//表高度变量
			tableheight: 291
    };
  },
  created: function() {
    this.getAllData();
  },
  methods: {
    //获取数据
		getAllData: function () {
      let vm = this;
			this.date_start = '';
			this.date_end = '';
			var params = {};
			if (this.dataRange != null && this.dataRange.length > 0) {
				//往详情页传的参数
				this.date_start = this.dataRange[0];
				this.date_end = this.dataRange[1];
				//查询用参数
				var date = new Date(this.dataRange[0]);
				var date1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
				var date2 = new Date(this.dataRange[1]);
				var date3 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds();
				var params = {
					qrsj_start: date1,
					qrsj_end: date3
				};
			}
			vm.$axios.post('/qyjbxx/ifConfirmedTjfx', params).then(function (res) {
				this.name_X = [];
				this.value_Y = [];
				this.pieDataz = [];
				this.tjfxtabledata = res.data.result;
				for (var i in this.tjfxtabledata) {
					//柱状图数据
					this.name_X.push(this.tjfxtabledata[i].qrztmc);
					this.value_Y.push(this.tjfxtabledata[i].qrztsl)
					//饼状图数据
					var arr1 = {
						name: this.tjfxtabledata[i].qrztmc,
						value: this.tjfxtabledata[i].qrztsl
					}
					this.pieDataz.push(arr1);
				}
				//画柱状图
				this.barChart();
				//画饼图
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
					text: '按是否信息确认统计企业数量',
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
					top: '20',
					bottom: '10',
					left: '20',
					right: '50',
					containLabel: true
				},
				xAxis: [
					{
						name: '数量',
						type: 'value',
						minInterval: 1,
						splitLine: {
							show: false
						},
					}
				],
				yAxis: [
					{
						type: 'category',
						data: this.name_X,
						axisLabel: {
							interval: 0,
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
						data: this.value_Y,
						smooth: true,
						itemStyle: {
							normal: {
								barBorderRadius: [5, 5, 0, 0],
								color: function (params) {
									// build a color map as your need.
									var colorList = [
										'#C1232B', '#B5C334'
									];
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
					data: this.pieDataz.name,
					align: 'right',
					itemGap: 8,
				},
				series: [
					{
						name: this.pieTitle,
						type: 'pie',
						radius: '46.5%',
						center: ['35%', '50%'],
						data: this.pieDataz,
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
				color: ['#C1232B', '#B5C334']
			};

			myChart.setOption(optionPie);
    },
    
    //导出EXCEL
    exportClick: function () {
			window.open(window.config.domain + "/qyzwyx/doExportTjfxByZwmjfw");
    },
    
    //跳转到企业列表
		toCompanyList: function (val) {
      this.$router.push({name:"statisConfirmList", query: {qrsj_start: this.date_start, qrsj_end: this.date_end, qrzt: val.qrzt}});
		}
  }
};
</script>

