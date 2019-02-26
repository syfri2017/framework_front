<template>
  <div id="codelistDetail">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">权限名称</label>
              <el-input size="small" v-model="searchForm.permissionname" placeholder="权限名称"></el-input>
            </el-col>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">权限描述</label>
              <el-input size="small" v-model="searchForm.permissioninfo" placeholder="权限描述"></el-input>
            </el-col>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">创建时间</label>
              <el-date-picker type="daterange" format="yyyy/MM/dd" value-format="yyyy/MM/dd" size="small" v-model="searchForm.createTime"
                range-separator="~" placeholder="创建时间" start-placeholder="开始日期" end-placeholder="结束日期" class="searchDatePicker">
              </el-date-picker>
            </el-col>
          </el-row>
          <div>
            <el-form>
              <el-col :span="12" class="btnEditDelete">
                <el-form-item align="left">
                  <el-button v-if="hasPermission('system/permission:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
                  <el-button v-if="hasPermission('system/permission:delete')" type="danger" icon="el-icon-delete" size="small" @click="removeSelection">删除</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12"></el-col>
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
          :height="tableheight">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="65"></el-table-column>
          <el-table-column prop="permissionname" show-overflow-tooltip label="权限名称" min-width="20%" align="center"></el-table-column>
          <el-table-column prop="permissioninfo" show-overflow-tooltip label="权限描述" min-width="15%" align="center"></el-table-column>
          <el-table-column prop="createName" show-overflow-tooltip label="创建人" min-width="12%" align="center"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="13%" align="center" :formatter="tableDateFormat"></el-table-column>
          <el-table-column prop="alterName" show-overflow-tooltip label="修改人" min-width="12%" align="center"></el-table-column>
          <el-table-column prop="alterTime" show-overflow-tooltip label="修改时间" min-width="13%" align="center" :formatter="tableDateFormat"></el-table-column>
          <el-table-column label="操作" width="65" align="center" v-if="hasPermission('system/permission:edit')">
            <template slot-scope="scope">
              <el-button type="text" @click="editClick(scope.row, scope.$index)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <paginator></paginator>
				
			</div>

      <!-- 编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <div v-show="false" v-once v-model="permissionnameOld"></div>
          <el-row>
            <el-col :span="23">
              <el-form-item label="权限名称" prop="permissionname">
                <el-input v-model="editForm.permissionname" auto-complete="off" placeholder="权限名称" size="small" maxlength="15"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="权限描述" prop="permissioninfo">
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="editForm.permissioninfo" auto-complete="off" placeholder="权限描述" size="small" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog(editForm)"> 取消</el-button>
            <el-button type="success" icon="el-icon-check" size="small" class="btn_save" @click="editSubmit(editForm)">保存</el-button>
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
        permissionname: "",
        permissioninfo: "",
        createTime: new Array()
      },
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      //显示加载中样
      loading: false,
      //多选值
      multipleSelection: [],
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      //选中的序号
      editIndex: -1,
      //修改界面是否显示
      editFormVisible: false,
      editFormRules: {
        permissionname: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          { pattern: /^[0-9A-Za-z]{2,15}$/, message: '长度为2-15个字母或数字', trigger: 'blur' },
        ],
        permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
      },
      //修改界面数据
      editForm: {
          permissionname: "",
          permissioninfo: ""
      },
      //权限名称-旧
      permissionnameOld: "",
      //Dialog Title
      dialogTitle: "权限编辑",
    };
  },
  created: function() {
    this.searchClick("click");
  },
  methods: {
    //表格查询事件
    searchClick: function(type) {
      let vm = this;
      //按钮事件的选择
      if(type == 'page'){
        vm.tableData = [];    
      }else{
        vm.currentPage = 1;
      }
      vm.loading = true;//表格重新加载
      var params = {
        permissionname: vm.searchForm.permissionname.replace(/%/g,"\\%"),
        permissioninfo: vm.searchForm.permissioninfo.replace(/%/g,"\\%"),
        createTimeBegin: vm.searchForm.createTime[0],
        createTimeEnd: vm.searchForm.createTime[1],
        pageSize: vm.pageSize,
        pageNum: vm.currentPage
      };

      vm.$axios.post('/permission/findByVO', params).then(function (res) {
        var tableTemp = new Array((this.currentPage-1)*this.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        vm.total = res.data.result.total;
        vm.loading = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },

    //清空查询条件
    clearClick: function() {
      this.searchForm.permissioninfo = "",
      this.searchForm.permissionname = "",
      this.searchForm.createTime = new Array(),
      this.searchClick('reset');
    },

    //表格勾选事件
    selectionChange: function(val) {
      for (var i = 0; i < val.length; i++) {
        var row = val[i];
      }
      this.multipleSelection = val;
    },
   
    //新增事件
    addClick: function() {
      this.dialogTitle = "权限新增";
      //清空edit表单
      if (this.$refs["editForm"] !== undefined) {
          this.$refs["editForm"].resetFields();
      }
      this.editFormVisible = true;
    },

    //表格修改事件
    editClick: function(val, index) {
      let vm = this;
      vm.editIndex = index;
      vm.dialogTitle = "权限编辑";
      var params = {
        permissionid: val.permissionid
      };
      vm.$axios.post('/permission/findByVO', params).then(function (res) {
        vm.editForm = res.data.result.list[0];
        //保存当前用户名permissionname
        vm.permissionnameOld = this.editForm.permissionname;
      }.bind(this), function (error) {
        console.log(error)
      })
      vm.editFormVisible = true;
    },

    //编辑提交点击事件
    editSubmit: function(val) {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          let vm = this;
          var params = {
              permissionid: val.permissionid,
              permissionname: val.permissionname,
              permissioninfo: val.permissioninfo
          };
          if(vm.dialogTitle == "权限新增"){
            vm.$axios.get('/permission/getNum/' + vm.editForm.permissionname).then(function(res){
              if(res.data.result != 0){
                vm.$message({
                  message: "权限名已存在",
                  type: "error"
                });
              }else{
                params.createId = vm.currentUser.userid;
                params.createName = vm.currentUser.username;
                vm.$axios.post('/permission/insertByVO', params).then(function (res) {
                  res.data.result.createTime = new Date();
                  vm.tableData.unshift(res.data.result);
                  vm.total = this.tableData.length;
                }.bind(this), function (error) {
                  console.log(error)
                })
                vm.editFormVisible = false;
              }
            }.bind(this),function(error){
              console.log(error)
            })
          }else if(vm.dialogTitle == "权限编辑"){
            params.permissionid = val.permissionid;
            params.alterId = vm.currentUser.userid;
            params.alterName = vm.currentUser.username;
            if(vm.editForm.permissionname == vm.permissionnameOld){
              vm.editSubmitUpdateDB(params);
            }else{
              vm.$axios.get('/permission/getNum/' + vm.editForm.permissionname).then(function(res){
                  if(res.data.result != 0){
                    vm.$message({
                      message: "权限名已存在",
                      type: "error"
                    });
                  }else{
                    vm.editSubmitUpdateDB(params);
                  }
              }.bind(this),function(error){
                console.log(error)
              })
            }
          }
        } else {
          console.log('error save!!');
          return false;
        }
      });
    },

    //修改方法-update数据库  by li.xue 2018/11/22 15:46
    editSubmitUpdateDB: function(params) {
      let vm = this;
      vm.$axios.post('/permission/updateByVO', params).then(function (res) {
        var result = res.data.result;
        this.tableData[vm.editIndex].permissionname = result.permissionname;
        this.tableData[vm.editIndex].permissioninfo = result.permissioninfo;
        this.tableData[vm.editIndex].alterName = result.alterName;
        this.tableData[vm.editIndex].alterTime = new Date();
        this.editFormVisible = false;
    }.bind(this), function (error) {
        console.log(error)
    })
    },

    //删除所选，批量删除
    removeSelection: function() {
      let vm = this;
      if (vm.multipleSelection.length < 1) {
        vm.$message({
          message: "请至少选中一条记录",
          type: "warning"
        });
        return;
      }
      vm.$confirm('确认删除选中信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.$axios.post('/permission/deleteByList', vm.multipleSelection).then(function (res) {
          vm.$message({
            message: "成功删除" + res.data.result + "条权限信息",
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

    //关闭Dialog
    closeDialog: function(val) {
      this.editFormVisible = false;
      val.permissionname = "";
      val.permissioninfo = "";
      this.$refs["editForm"].resetFields();
    },

    //关闭资源详情Dialog
    closeResourceDialog: function () {
      this.resourceVisible = false;
    }
  }
};
</script>

