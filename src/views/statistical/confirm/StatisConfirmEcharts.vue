<template>
  <div id="statisConfirmList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<div class="echartsBox staticStyle">
        <div id="bar" class="echartsDiv"></div>
      </div>
      <div class="inform-content">
        <div class="table_container">
          <el-table border id="table" class="tableStyle" :data="this.tjfxdata" :height="tableheight" :row-style="rowStyle">
            <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
            <el-table-column prop="cplxmc" label="产品类型" show-overflow-tooltip min-width="28%" align="center">
              <template slot-scope="scope">
                <a v-text="scope.row.cplxmc" @click="toCompanyList(scope.row)"></a>
              </template>
            </el-table-column>
            <el-table-column prop="czqysl" label="参展企业数量" show-overflow-tooltip min-width="28%" align="center"></el-table-column>
            <el-table-column prop="bwzwgssl" label="标准展位数量" show-overflow-tooltip min-width="28%" align="center"></el-table-column>
            <el-table-column prop="gdzwmj" label="光地展位面积m²" show-overflow-tooltip min-width="28%" align="center"></el-table-column>
          </el-table>
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
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //页面获取的uuid
			uuid: "",
			//搜索表单
			searchForm: {
				dateStart: "",
				dateEnd: "",
			},
			//统计分析的数据
			tjfxdata: [],
			tjfxname: [],
			tjfxczqysl: [],
			tjfxgdzwmj: [],
			tjfxbwzwgssl: [],
			tabledata: [],
			total: 0,
			//表高度变量
			tableheight: 331,
			//显示加载中样
			loading: false,
			labelPosition: 'right',
    };
  },
  created: function() {
    this.getCPLX();
  },
  methods: {
    //获取统计分析图表数据
		getCPLX: function () {
      var params = {};
      let vm = this;
			vm.$axios.post('/qyzwyx/dofindtjfx', params).then(function (res) {
				this.tjfxdata = res.data.result;
				this.total = res.data.result.length;
				for (var i = 0; i < this.tjfxdata.length; i++) {
					this.tjfxname.push(this.tjfxdata[i].cplxmc)
					this.tjfxczqysl.push(this.tjfxdata[i].czqysl)
					this.tjfxgdzwmj.push(this.tjfxdata[i].gdzwmj)
					this.tjfxbwzwgssl.push(this.tjfxdata[i].bwzwgssl)
				}
				this.loading = false;
				this.echarts1();
			}.bind(this), function (error) {
				console.log(error)
			})
		},

		// 中央下部按产品分类柱状图
		echarts1: function () {
			var myBarChart = echarts.init(document.getElementById('bar'));
			var option = {
				title: {
					text: '按产品类型统计展会报名情况',
					x: 'center',
					y: '-3',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {            // 坐标轴指示器，坐标轴触发有效
						type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					orient: 'horizontal',
					top: 20,
					right: 80,
					iGap: 16,
					iWidth: 18,
					align: 'left',
					iGap: 8,
				},
				color: ['#C1232B', '#B5C334', '#FCCE10'],
				grid: {
					top: '50',
					bottom: '10',
					left: '15',
					right: '20',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: this.tjfxname,
						axisLabel: {
							interval: 0,
							rotate: 15,
						},
					}
				],

				yAxis: [
					{
						type: 'value',
						name: '企业',
						position: 'left',
						offset: 28,
						minInterval: 1,
						axisLine: {
							lineStyle: {
								color: '#C1232B'
							}
						},
						splitLine: {
							show: false
						}
					},
					{
						type: 'value',
						name: '展位',
						position: 'left',
						minInterval: 1,//设置为整数的刻度值
						axisLine: {
							lineStyle: {
								color: '#B5C334'
							}
						},
						splitLine: {
							show: false
						}
					},
					{
						type: 'value',
						name: '面积m²',
						axisLine: {
							lineStyle: {
								color: '#FCCE10'
							}
						},
						splitLine: {
							show: false
						}
					}
				],
				series: [
					{
						name: '参展企业数量',
						type: 'bar',
						data: this.tjfxczqysl,
						itemStyle: {
							normal: {
								barBorderRadius: [5, 5, 0, 0],
								opacity: 0.85
							}
						},
					},
					{
						name: '标准展位数量',
						type: 'bar',
						yAxisIndex: 1,
						data: this.tjfxbwzwgssl,
						itemStyle: {
							normal: {
								barBorderRadius: [5, 5, 0, 0],
								opacity: 0.85
							}
						},
					},
					{
						name: '光地展位面积m²',
						type: 'bar',
						yAxisIndex: 2,
						data: this.tjfxgdzwmj,
						itemStyle: {
							normal: {
								barBorderRadius: [5, 5, 0, 0],
								opacity: 0.85
							}
						},
					}
				]
			};
			myBarChart.setOption(option);
		},
    exportClick: function () {
			window.open(window.config.domain + "/qyzwyx/doExportTjfxByCplx");
		},
		toCompanyList: function (val) {
			var params = {
				cplx: val.cplx
			}
			loadDivParam("statistical/exhprediction_product", params);
		}
  }
};
</script>

