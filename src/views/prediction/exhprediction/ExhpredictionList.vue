<template>
  <div id="exhpredictionList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">公司名称</label>
              <el-input size="small" v-model="searchForm.gsmc" placeholder="公司名称" clearable></el-input>
            </el-col>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">数据状态</label>
              <el-select size="small" v-model="searchForm.sjzt" placeholder="全部" class="searchSelect" clearable>
                <el-option v-for="item in sjztData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">审核状态</label>
              <el-select size="small" v-model="searchForm.shzt" placeholder="全部" class="searchSelect" clearable>
                <el-option v-for="item in shztData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <div>
            <el-form>
              <el-col :span="12" class="btnEditDelete">
                <el-form-item align="left">
                  <el-button v-if="hasPermission('prediction/exhprediction:add')" type="success" icon="el-icon-plus" size="small" @click="addClick('init')">新增</el-button>
                  <el-button v-if="hasPermission('prediction/exhprediction:delete')" type="danger" icon="el-icon-delete" size="small" @click="deleteClick">删除</el-button>
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
        <el-table class="tableStyle" border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="selectionChange"
          :height="tableheight" tooltip-effect="dark" :row-style="rowStyle">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
          <el-table-column prop="zwgsmc" label="公司名称" show-overflow-tooltip min-width="34%" align="center">
            <template slot-scope="scope">
              <a v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc" @click="qyDetails(scope.row)"></a>
              <a v-else v-text="scope.row.zwgsmc" @click="qyDetails(scope.row)"></a>
            </template>
          </el-table-column>
          <el-table-column prop="lxr" label="联系人" show-overflow-tooltip min-width="13%" align="center"></el-table-column>
          <el-table-column prop="lxrsj" label="联系人手机" show-overflow-tooltip min-width="19%" align="center"></el-table-column>
          <el-table-column prop="sjztmc" label="数据状态" show-overflow-tooltip min-width="13%" align="center"></el-table-column>
          <el-table-column prop="shztmc" label="审核状态" show-overflow-tooltip min-width="13%" align="center">
            <template slot-scope="scope">
              <el-popover placement="bottom" width="100" trigger="click" v-if="scope.row.reserve1!=null && scope.row.reserve1!=''">
                <el-row>审核意见:
                  <span v-text="scope.row.reserve1"></span>
                </el-row>
                <a type="text" slot="reference" v-if="scope.row.shzt == '01'" v-text="scope.row.shztmc" style="color:#e40613"></a>
                <a type="text" slot="reference" v-else-if="scope.row.shzt == '02'" v-text="scope.row.shztmc" style="color:#f7962f"></a>
                <a type="text" slot="reference" v-else-if="scope.row.shzt == '03'" v-text="scope.row.shztmc" style="color:#42D885"></a>
                <a type="text" slot="reference" v-else v-text="scope.row.shztmc"></a>
              </el-popover>
              <div v-else>
                <span v-if="scope.row.shzt == '01'" v-text="scope.row.shztmc" style="color:#e40613"></span>
                <span v-else-if="scope.row.shzt == '02'" v-text="scope.row.shztmc" style="color:#f7962f"></span>
                <span v-else-if="scope.row.shzt == '03'" v-text="scope.row.shztmc" style="color:#42D885"></span>
                <span v-else v-text="scope.row.shztmc"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="75" align="center" v-if="hasPermission('prediction/exhprediction:edit')">
            <template slot-scope="scope">
              <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--翻页组件-->
        <el-row type="flex" justify="end">
          <paginator></paginator>
          <div class="buttonExport">
            <el-button type="warning" icon="el-icon-download" size="small" @click="exportClick">导出</el-button>
          </div>
        </el-row>
			</div>

      <!-- 编辑-->
      <el-dialog title="选择展商用户" :visible.sync="userListVisible" :close-on-click-modal="false">
        <div v-loading="loading_user" element-loading-text="加载中">
          <el-row>
            <el-col :span="12" class="searchInline">
              <label class="el-form-item__label searchLabel" style="width:95px;">用户名</label>
              <el-input size="small" v-model="userForm.username" placeholder="用户名" clearable></el-input>
            </el-col>
            <el-col :span="12" style="text-align: right;">
              <el-button type="primary" icon="el-icon-search" size="small" @click="addClick('click')">查询</el-button>
              <el-button type="clear" icon="el-icon-refresh" size="small" @click="clearUserList">重置</el-button>
            </el-col>
          </el-row>
          <div class="table_container">
            <el-table border id="tableUser" :data="tableData_user.slice((currentPage_user-1)*pageSize_user,currentPage_user*pageSize_user)"
              class="tableStyle" :height="tableheight_user" @row-click="selectUser" :row-style="rowStyle">
              <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
              <el-table-column prop="username" label="用户名" show-overflow-tooltip min-width="30%" align="center"></el-table-column>
              <el-table-column prop="zwgsmc" label="公司名称" show-overflow-tooltip min-width="30%" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc"></span>
                  <span v-else v-text="scope.row.zwgsmc"></span>
                </template>
              </el-table-column>
              <el-table-column prop="dzyx" label="电子邮箱" show-overflow-tooltip min-width="30%" align="center"></el-table-column>
            </el-table>
            <el-row type="flex" justify="end">
              <el-col :span="18">
                <el-pagination @current-change="currentPageChange_user" :current-page="currentPage_user" :page-size="pageSize_user" layout="total, prev, pager, next, jumper"
                  :total=parseInt(total_user)>
                </el-pagination>
              </el-col>
            </el-row>
          </div>
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
        gsmc: '',
        // yjdz: '',
        sjzt: '',
        shzt: ''
      },
      exportForm: [],
      tableData: [],
      //表高度变量
      tableheight: this.CONSTANT.tableheight10,
      shztData: [],//审核状态下拉框
      sjztData: [],//数据状态下拉框
      imgViewVisible: false,
      //多选值
      multipleSelection: [],
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      //用户dialog
      userForm: {
        username: ''
      },
      tableData_user: [],
      userListVisible: false,
      tableheight_user: 251,
      //显示加载中样
      loading_user: false,
      //当前页
      currentPage_user: 1,
      //分页大小
      pageSize_user: 5,
      //总记录数
      total_user: 0
    };
  },
  created: function() {
    //审核状态下拉框
    this.getShztData();
    //数据状态下拉框
    this.getSjztData();
    this.searchClick('click');
  },
  methods: {
    //审核状态下拉框
    getShztData: function () {
      let vm = this;
      vm.$axios.get('/codelist/getCodetype/SHZT').then(function (res) {
        vm.shztData = res.data.result;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //数据状态下拉框
    getSjztData: function () {
      let vm = this;
      vm.$axios.get('/codelist/getCodetype/SJZT').then(function (res) {
        vm.sjztData = res.data.result;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //表格查询事件
    searchClick: function(type) {
      let vm = this;
      this.tableData = [];
      if (type != 'page') {
        this.currentPage = 1;
      }
      vm.loading = true;//表格重新加载
      var params = {
        gsmc: vm.searchForm.gsmc.replace(/%/g, "\\%"),
        shzt: vm.searchForm.shzt,
        sjzt: vm.searchForm.sjzt,
        pageSize: vm.pageSize,
        pageNum: vm.currentPage
      }
      vm.$axios.post('/qyjbxx/page', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage-1)*vm.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        this.total = res.data.result.total;
        this.exportForm = [this.searchForm.gsmc, this.searchForm.sjzt, this.searchForm.shzt];
        this.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },

    //清空查询条件
    clearClick: function() {
      this.searchForm.gsmc = '';
      this.searchForm.yjdz = '';
      this.searchForm.shzt = '';
      this.searchForm.sjzt = '';
      this.searchClick('reset');
    },

    //表格勾选事件
    selectionChange: function(val) {
      this.multipleSelection = val;
    },

    //企业详情跳转
    qyDetails: function (val) {
      this.$router.push({name:"exhpredictionDetail", query: {id: val.qyid, type: 'search'}});
    },
   
    //新增事件
    addClick: function(type) {
      let vm = this;
      vm.tableData_user = [];
      if (type == 'init') {
        vm.userForm.username = '';
      }
      if (type != 'page') {
        vm.currentPage_user = 1;
      }
      vm.loading_uesr = true;
      var params = {
        username: vm.userForm.username,
        pageSize: vm.pageSize_user,
        pageNum: vm.currentPage_user
      };
      vm.$axios.post('/qyjbxx/doFindZsxxByQyjbxx', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage_user - 1) * vm.pageSize_user);
        vm.tableData_user = tableTemp.concat(res.data.result.list);
        vm.total_user = res.data.result.total;
        vm.userListVisible = true;
        vm.loading_user = false;
      }.bind(this), function (error) {
        console.log(error);
      })
    },

    //表格修改事件
    editClick: function(val, index) {
      if (val.usertype == 'CHN') {
        this.$router.push({name:"exhpredictionUpdate", query: {id: val.qyid, type: 'BJ'}});
      } else if (val.usertype == 'ENG') {
        this.$router.push({name:"exhpredictionUpdate_ENG", query: {id: val.qyid, type: 'BJ'}});
      }
    },

    //删除所选，批量删除
    deleteClick: function() {
      this.$confirm('确定删除已选中报名信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let vm = this;
        for (var i in this.multipleSelection) {
          vm.multipleSelection[i].xgrid = this.currentUser.userid;
          vm.multipleSelection[i].xgrmc = this.currentUser.username;
          vm.multipleSelection[i].deleteFlag = 'Y';
        }
        vm.$axios.post('/qyjbxx/doDeleteJbxx', vm.multipleSelection).then(function (res) {
          vm.$message({
            message: "成功删除" + res.data.result + "条报名信息",
            showClose: true,
            onClose: this.searchClick('delete')
          });
        }.bind(this), function (error) {
          console.log(error)
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    //查询展商信息
    selectUser: function (val) {
      if (val.qyid == null || val.qyid == '') {
        this.userListVisible = false;
        if (val.usertype == 'CHN') {
          this.$router.push({name:"exhpredictionInsert", query: {userid: val.userid, type: 'XZ'}});
        } else if (val.usertype == 'ENG') {
          this.$router.push({name:"exhpredictionInsert_ENG", query: {userid: val.userid, type: 'XZ'}});
        }
      } else {
        this.$confirm('选中展商已有报名信息，是否进入编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.userListVisible = false;
          if (val.usertype == 'CHN') {
            this.$router.push({name:"exhpredictionUpdate", query: {userid: val.userid, type: 'BJ'}});
          } else if (val.usertype == 'ENG') {
            this.$router.push({name:"exhpredictionUpdate_ENG", query: {userid: val.userid, type: 'XZ'}});
          }
        }).catch(() => {
            
        });
      }
    },
  
    //用户弹出页翻页
    currentPageChange_user: function (val) {
      if (this.currentPage_user != val) {
        this.currentPage_user = val;
        this.addClick('page');
      }
    },

    //清除用户列表
    clearUserList: function () {
      this.userForm.username = '';
      this.addClick('reset');
    },

    //导出
    exportClick: function () {
      window.open("/qyjbxx/doExportJbxx/" + this.exportForm);
    }
  }
};
</script>

