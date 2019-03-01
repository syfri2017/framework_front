<template>
  <div id="permission">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">展位号</label>
              <el-input size="small" v-model="searchForm.zwh" placeholder="全部" clearable></el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">企业名称</label>
              <el-input size="small" v-model="searchForm.qymc" placeholder="全部" clearable></el-input>
            </el-col>
          </el-row>
          <div>
            <el-form>
              <el-col :span="12">
                <el-form-item align="left">
                  <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteClick">清空日志</el-button>
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
				<el-table border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" class="tableStyle" :height="tableheight" :row-style="rowStyle">
          <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
          <el-table-column prop="zwh" show-overflow-tooltip label="展位号" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="qymc" show-overflow-tooltip label="企业名称" min-width="20%" align="center"></el-table-column>
          <el-table-column prop="czlx" show-overflow-tooltip label="操作类型" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="czrmc" show-overflow-tooltip label="操作人" min-width="10%" align="center"></el-table-column>
          <el-table-column prop="czsjStr" show-overflow-tooltip label="操作时间" min-width="15%" align="center"></el-table-column>
          <el-table-column prop="rzsjStr" show-overflow-tooltip label="日志时间" min-width="15%" align="center"></el-table-column>
        </el-table>
        <!--翻页组件-->
        <el-row type="flex" justify="end">
          <paginator></paginator>
        </el-row>
			</div>

      <!-- 编辑-->
      <el-dialog title="清空日志" :visible.sync="deleteFormVisible" @close="closeDialog('deleteForm')" :close-on-click-modal="false">
        <el-form :model="deleteForm" label-width="120px" :rules="deleteFormRules" ref="deleteForm" label-position="right">
          <el-row class="mt20">
            <el-col :span="22">
              <el-form-item label="日志时间" prop="rzsj">
                <el-date-picker style="width:100%;" v-model="deleteForm.rzsj" type="daterange" size="small" start-placeholder="开始日期" end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-button type="clear" icon="el-icon-close" size="small" @click="closeDialog('deleteForm')">取消</el-button>
            <el-button type="success" icon="el-icon-delete" size="small" @click="deleteSubmit('deleteForm')">清空</el-button>
          </el-row>
        </el-form>
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
          zwh: "",
          qymc: "",
      },
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      ///清空日志弹出页
      deleteFormVisible: false,
      deleteForm: {
        rzsj: []
      },
      deleteFormRules: {
        rzsj: [
          { required: true, message: '请选择清空日志日期范围', trigger: 'blur' }
        ]
      }
    };
  },
  created: function() {
    this.searchClick("click");
  },
  methods: {
    //表格查询事件
    searchClick: function(type) {
      let vm = this;
      this.tableData = [];
      if (type != 'page') {
        this.currentPage = 1;
      }
      vm.loading = true;//表格重新加载
      var params = {
        zwh: vm.searchForm.zwh,
        qymc: vm.searchForm.qymc,
        pageSize: vm.pageSize,
        pageNum: vm.currentPage
      }
      vm.$axios.post('/zwlog/page', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage - 1) * vm.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        vm.total = res.data.result.total;
        vm.loading = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },

    //清空查询条件
    clearClick: function() {
      this.searchForm.zwh = "";
      this.searchForm.qymc = "";
      this.searchClick('reset');
    },
   
    //点击清空日志
    deleteClick: function () {
      this.deleteFormVisible = true;
    },
    //清空日志提交
    deleteSubmit: function (val) {
      this.$refs[val].validate((valid) => {
        if (valid) {
          let vm = this;
          var date = new Date(vm.deleteForm.rzsj[0]);
          var date1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
          var date2 = new Date(vm.deleteForm.rzsj[1]);
          var date3 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate() + ' ' + date2.getHours() + ':' + date2.getMinutes() + ':' + date2.getSeconds();
          vm.$confirm('确定清空' + date1 + '至' + date3 + '的日志信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var params = {
              rzsj_begin: date1,
              rzsj_end: date3,
              xgrid: vm.currentUser.userid,
              xgrmc: vm.currentUser.username
            }
            vm.$axios.post('/zwlog/doDeleteByRzsj', params).then(function (res) {
              vm.$message.success("成功清空" + res.data.result + "条日志信息");
              vm.closeDialog('deleteForm');
              vm.searchClick('delete');
            }.bind(this), function (error) {
              console.log(error)
            })
          }).catch(() => {
            vm.$message.info('已取消清空');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //关闭Dialog
    closeDialog: function (val) {
      this.deleteForm = {
          rzsj: []
      };
      this.$refs[val].resetFields();
      this.deleteFormVisible = false;
    }
  }
};
</script>
<style>

</style>