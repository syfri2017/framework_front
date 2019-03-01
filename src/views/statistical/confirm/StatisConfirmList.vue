<template>
  <div id="statisConfirmList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">确认时间</label>
              <el-date-picker v-model="dataRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']" size="small">
              </el-date-picker>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">是否确认</label>
              <el-select size="small" v-model="searchForm.qrzt" placeholder="全部" class="searchSelect">
                <el-option label="已确认" value="1"></el-option>
                <el-option label="未确认" value="0"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="tr">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
            <el-button type="clear" icon="el-icon-refresh" size="small" @click="clearClick">重置</el-button>
        </el-row>
        </el-form>
      </el-row>
        <div class="table_container" id="singleRow">
          <el-table id="table" border class="tableStyle" :height="tableheight" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" :row-style="rowStyle">
            <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
            <el-table-column prop="zwgsmc" label="公司名称" show-overflow-tooltip min-width="30%" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc" @click="qyDetails(scope.row)"></span>
                    <span v-else v-text="scope.row.zwgsmc"></span>
                </template>
            </el-table-column>
            <el-table-column prop="lxr" label="联系人" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
            <el-table-column prop="lxrsj" label="联系人手机" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
            <el-table-column prop="qrsj" label="上次确认时间" show-overflow-tooltip min-width="20%" align="center"></el-table-column>
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
export default {
  data() {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
			//搜索表单
      searchForm: {
        qrsj_start: '',
        qrsj_end: '',
        qrzt: ''
      },
      dataRange: [],
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      exportForm: [],
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0
    };
  },
  created: function() {
    this.searchForm.qrsj_start = this.$route.query.qrsj_start;
    this.searchForm.qrsj_end = this.$route.query.qrsj_end;
    if (getQueryString("qrsj_start") != null && getQueryString("qrsj_start") != '' && getQueryString("qrsj_start") != undefined &&
      getQueryString("qrsj_end") != null && getQueryString("qrsj_end") != '' && getQueryString("qrsj_end") != undefined) {
      this.dataRange = [getQueryString("qrsj_start"), getQueryString("qrsj_end")];
    }
    this.searchClick('click');
  },
  methods: {
    //表格查询事件
    searchClick: function (type) {
      let vm = this;
      vm.tableData = [];
      if (type != 'page') {
        this.currentPage = 1; 
      }
      this.loading = true;//表格重新加载
      this.searchForm.qrsj_start = '';
      this.searchForm.qrsj_end = '';
      if (this.dataRange != null && this.dataRange.length > 0) {
        var date = new Date(this.dataRange[0]);
        this.searchForm.qrsj_start = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var date2 = new Date(this.dataRange[1]);
        this.searchForm.qrsj_end = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds();
      }
      var params = {
        qrsj_start: this.searchForm.qrsj_start,
        qrsj_end: this.searchForm.qrsj_end,
        qrzt: this.searchForm.qrzt,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      vm.$axios.post('/qyjbxx/ifConfirmedTjfxDetail', params).then(function (res) {
        var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
        this.tableData = tableTemp.concat(res.data.result.list);
        this.total = res.data.result.total;
        this.exportForm = [this.searchForm.qrzt, this.searchForm.qrsj_start, this.searchForm.qrsj_end];
        this.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },

    //清空查询条件
    clearClick: function () {
      if (getQueryString("qrsj_start") != null && getQueryString("qrsj_start") != '' && getQueryString("qrsj_start") != undefined &&
          getQueryString("qrsj_end") != null && getQueryString("qrsj_end") != '' && getQueryString("qrsj_end") != undefined) {
          this.dataRange = [getQueryString("qrsj_start"), getQueryString("qrsj_end")];
      } else {
          this.dataRange = [];
      }
      this.searchForm.qrzt = getQueryString("qrzt");
      this.searchClick('reset');
    },
        
    //导出EXCEL
    exportClick: function () {
			window.open(window.config.domain + "/qyzwyx/doExportConfirmDetail" + this.exportForm);
		}
  }
};
</script>

