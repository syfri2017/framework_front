<template>
  <div id="statisAreaList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">产品类型</label>
              <el-select size="small" v-model="searchForm.cplx" placeholder="全部" class="searchSelect" clearable>
                <el-option v-for="item in cplxData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">光地展位面积</label>
              <el-select size="small" v-model="searchForm.zwmjfw" placeholder="全部" class="searchSelect" clearable>
                <el-option v-for="item in zwmjfwData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <div>
            <el-form>
              <el-col :span="12" class="btnEditDelete">
                <el-button type="success" icon="el-icon-download" size="small" @click="exportClick">导出</el-button>
              </el-col>
              <el-col :span="12" class="btnSearchPlus">
                <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
                <el-button type="clear" icon="el-icon-refresh" size="small" @click="clearClick">重置</el-button>
              </el-col>
            </el-form>
          </div>
        </el-form>
        </el-row>
        <div class="table_container" id="singleRow">
          <el-table id="table" border class="tableStyle" :height="tableheight" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" :row-style="rowStyle">
            <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
            <el-table-column prop="zwgsmc" label="中文公司名称" show-overflow-tooltip min-width="20%" align="center"></el-table-column>
            <el-table-column prop="ywgsmc" label="英文公司名称" show-overflow-tooltip min-width="20%" align="center"></el-table-column>
            <el-table-column prop="lxr" label="联系人" show-overflow-tooltip min-width="8%" align="center"></el-table-column>
            <el-table-column prop="lxrsj" label="联系人手机" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
            <!-- <el-table-column prop="codeName" label="产品类型" show-overflow-tooltip min-width="10%" align="center"></el-table-column> -->
            <el-table-column prop="bzzwgs" label="标准展位(个)" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
            <el-table-column prop="sngdzw" label="室内光地展位(m²)" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
            <el-table-column prop="swgdzw" label="室外光地展位(m²)" show-overflow-tooltip min-width="10%" align="center"></el-table-column>
          </el-table>

          <!--翻页组件-->
          <el-row type="flex" justify="end">
            <paginator></paginator>
          </el-row>
        </div>
      </div>
      <!--导出界面-->
      <el-dialog title="选择产品类型" :visible.sync="chooseCplxVisible" @close="closeDialog" width="35%" :close-on-click-modal="false">
        <div id="selectCplx">
          <el-row>
            <el-col :span="7">&nbsp;</el-col>
            <el-col :span="10">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item in cplxData" :label="item.codeValue" :key="item.codeValue">{{item.codeName}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-button type="success" icon="el-icon-download" size="small" @click="exportExs">导出Excel至本地</el-button>
          </el-row>
        </div>
      </el-dialog>
		</div>
  </div>
</template>
<script>
//引入翻页 paginator
import paginator from '@/components/paginator'
export default {
  components: {
    paginator
  },
  data() {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //搜索表单
      searchForm: {
          cplx: '',
          zwmjfw: ''
      },
      tableData: [],//列表信息
      //tablegaodu
      tableheight: this.CONSTANT.tableheigh10,
      cplxData: [],//产品类型大类
      zwmjfwData: [],
      allCplxCode: [],
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      chooseCplxVisible: false,//选择产品类型弹出页
      checkList: [],//选中的产品类型
      isIndeterminate: false,//全选按钮
      checkAll: false
    };
  },
  created: function() {
    this.searchForm.cplx = this.$route.query.cplx;
    this.searchForm.zwmjfw = this.$route.query.zwmjfw;
    //产品类型下拉框
    this.getCplxData();
    this.getZwmjfwData();
    this.searchClick();
  },
  methods: {
    //产品类型下拉框
    getCplxData: function () {
      let vm = this;
      vm.$axios.get('/codelist/getCplxSelect/CPLX').then(function (res) {
        this.cplxData = res.data.result;
        for (var i in this.cplxData) {
          this.allCplxCode.push(this.cplxData[i].codeValue)
        }
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //展位面积范围下拉框
    getZwmjfwData: function () {
      let vm = this;
      vm.$axios.get('/codelist/getCodetype/ZWMJFW').then(function (res) {
          this.zwmjfwData = res.data.result;
      }.bind(this), function (error) {
          console.log(error);
      })
    },
    //表格查询事件
    searchClick: function (type) {
      let vm = this;
      vm.tableData = [];
      if (type != 'page') {
        vm.currentPage = 1;   
      }
      vm.loading = true;//表格重新加载
      var params = {
        cplx: vm.searchForm.cplx,
        zwmjfw: vm.searchForm.zwmjfw,
        pageSize: vm.pageSize,
        pageNum: vm.currentPage
      }
      vm.$axios.post('/qyzwyx/doFindQyzwyxByCplx', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage - 1) * vm.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        vm.total = res.data.result.total;
        vm.loading = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },
    //清空查询条件
    clearClick: function () {
      this.searchForm.cplx = this.$route.query.cplx;
      this.searchForm.zwmjfw = this.$route.query.zwmjfw;
      this.searchClick('reset');
    },
    //点击导出按钮，显示弹出页
    exportClick: function () {
      this.chooseCplxVisible = true;
    },
    //全选按钮change事件
    handleCheckAllChange(event) {
      this.checkList = event ? this.allCplxCode : [];
      this.isIndeterminate = false;
    },
    //产品类型选择change事件
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allCplxCode.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allCplxCode.length;
    },
    //点击导出至本地按钮
    exportExs: function () {
      if (this.checkList.length == 0) {
        this.$message.error('至少选择一个产品类型');
      } else {
        window.open(window.config.domain + "/qyzwyx/doExportQyzwyxByCplx/" + this.checkList);
      }
    },
    //关闭弹出页
    closeDialog: function () {
      this.checkList = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    }
  }
};
</script>

