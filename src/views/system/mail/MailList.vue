<template>
   <div id="mailList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline" v-model="searchForm" @submit.native.prevent>
          <el-row>
            <el-col :span="8" class="searchInline">
              <label class="el-form-item__label searchLabel">邮箱名称</label>
              <el-input size="small" v-model="searchForm.username" placeholder="邮箱名称" clearable></el-input>
            </el-col>
          </el-row>
					<div>
						<el-form>
							<el-col :span="12" class="btnEditDelete">
								<el-form-item align="left">
									<!-- <el-button type="primary" icon="edit" size="small" @click="editClick">修改</el-button> -->
									<el-button v-if="hasPermission('system/mail:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
									<el-button v-if="hasPermission('system/mail:delete')" type="danger" icon="el-icon-delete" size="small" @click="removeSelection">删除</el-button>
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
			<el-table border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @selection-change="selectionChange" class="tableStyle" :height="tableheight" >
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
        <el-table-column prop="username" show-overflow-tooltip label="邮箱名称" min-width="14%" align="center"></el-table-column>
        <el-table-column prop="password" show-overflow-tooltip label="邮箱密码" min-width="12%" align="center"></el-table-column>
        <el-table-column prop="encoding" show-overflow-tooltip label="编码" min-width="11%" align="center"></el-table-column>
        <el-table-column prop="host" show-overflow-tooltip label="SMTP" min-width="13%" align="center"></el-table-column>
        <el-table-column prop="port" show-overflow-tooltip label="端口" min-width="11%" align="center"></el-table-column>
        <el-table-column prop="protocol" show-overflow-tooltip label="授权码" min-width="13%" align="center"></el-table-column>
        <el-table-column label="操作" width="65" align="center" v-if="hasPermission('system/mail:edit')">
          <template slot-scope="scope">
            <el-button type="text" @click="editClick(scope.row,scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页组件-->
      <paginator></paginator>
      <!--修改界面-->
      <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog(editForm)" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" ref="editForm" :rules="editFormRules">  
          <el-row>
            <el-col :span="11">
              <el-form-item label="邮箱名称" prop="username">
                <el-input v-model="editForm.username" auto-complete="off" placeholder="邮箱名称" size="small" maxlength="30" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item label="邮箱密码" prop="password">
                <el-input v-model="editForm.password" auto-complete="off" placeholder="邮箱密码" size="small" maxlength="30" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="编码" prop="encoding">
                <el-input v-model="editForm.encoding" auto-complete="off" placeholder="编码" size="small" maxlength="10" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item label="SMTP" prop="host">
                <el-input v-model="editForm.host" auto-complete="off" placeholder="SMTP" size="small" maxlength="16" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="端口" prop="port">
                <el-input v-model="editForm.port" auto-complete="off" placeholder="端口" size="small" maxlength="4" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item label="授权码" prop="protocol">
                <el-input v-model="editForm.protocol" auto-complete="off" placeholder="授权码" size="small" maxlength="5" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <!-- <el-row>
              <el-col :span="11">
                  <el-form-item label="期限" prop="term">
                      <el-date-picker v-model="editForm.term" type="date" placeholder="期限" size="small">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
          </el-row> -->
          <el-row class="buttonSubmit">
            <el-button type="clear" icon="el-icon-close"  size="small" class="btn_submit" @click="closeDialog(editForm)">取消</el-button>
            <el-button type="success"  icon="el-icon-check"  size="small" class="btn_save" @click="editSubmit(editForm)">保存</el-button>
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
        id: "",
        username: ""
      },
      //表数据
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      
      //显示加载中
      loading: false,
      //多选值
      multipleSelection: [],
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      //Dialog Title
      dialogTitle: "邮箱编辑",
      //选中的序号
      editIndex: -1,
      //修改界面是否显示
      editFormVisible: false,
      editLoading: false,
      //修改界面数据
      editForm: {
        username: "",
        password: "",
        encoding: "",
        host: "",
        port: "",
        protocol: ""
      },
      //表单验证
      editFormRules: {
        username: [
          { required: true, message: '请输入邮箱名称', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
          { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/ , message: '仅支持数字和字母组合的邮箱地址',trigger: 'blur' },
          { min: 1, max: 30, message: '最多输入30个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入邮箱密码', trigger: 'blur' },
          { pattern: /^[0-9A-Za-z]{1,30}$/, message: '邮箱密码应为1-30位字母、数字', trigger: 'blur' },
        ],
        port: [
          { pattern: /^\d{2,4}$/, message: '端口号应为2-4位数字',trigger: 'blur'},],

        encoding:[
          { pattern: /^[^\u4e00-\u9fa5]{1,10}$/, message: '编码应为1-10位字母、数字、下划线', trigger: 'blur' },
        ],
        host:[
          { pattern: /^[^\u4e00-\u9fa5]{1,16}$/, message: 'SMTP应为1-16位字母、数字、点', trigger: 'blur' },
        ],
        protocol:[
          { pattern: /^[0-9A-Za-z]{1,5}$/, message: '授权码应为1-5位字母、数字', trigger: 'blur' },
        ]   
      },
    };
  },
  created: function () {
      this.searchClick();
    },
  methods: {
    //表格查询事件
    searchClick(type) {
      let vm = this;
      //按钮事件的选择
      if (type == 'page') {
          vm.tableData = [];
      } else {
          vm.currentPage = 1;
      }
      vm.loading = true;//表格重新加载
      var params = {
          username: vm.searchForm.username.replace(/%/g, "\\%"),
          pageSize: this.pageSize,
          pageNum: this.currentPage
      }
      //邮箱管理-表格
      vm.$axios.post('/mail/findByVO', params).then(function (res) {
        vm.tableData = res.data.result;
        vm.total = res.data.result.length;
        vm.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //清空查询条件
    clearClick: function () {
      this.searchForm.id = "",
      this.searchForm.username = "",
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
    addClick: function () {
      this.dialogTitle = "邮箱新增";
      this.editPasswordShow = true;
      this.editFormVisible = true;
      this.editForm={}
    },
    //表格修改事件
    editClick: function (val, index) {
      this.editIndex = index;
      this.dialogTitle = "邮箱编辑";
      this.editPasswordShow = false;
      this.editSearch(val);
      this.editFormVisible = true;
    },
    //修改时查询方法
    editSearch: function (val) {
      let vm = this;
      //获取选择行主键
      var params = {
        uuid: val.uuid
      };
      vm.$axios.post('/mail/findByVO', params).then(function (res) {
        this.editForm = res.data.result[0];
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //编辑提交点击事件
    editSubmit: function (val) {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          let vm = this;
          var params = {
            username: val.username,
            password: val.password,
            encoding: val.encoding,
            host: val.host,
            port: val.port,
            protocol: val.protocol
            // term: val.term,
          }
          if (vm.dialogTitle == "邮箱新增") {
            params.createId = vm.currentUser.userid;
            params.createName = vm.currentUser.username;
            vm.$axios.post('/mail/insertByVO', params).then(function (res) {
              vm.tableData.unshift(res.data.result);
              vm.total = vm.tableData.length;
            }.bind(this), function (error) {
              console.log(error)
            })
            vm.editFormVisible = false;
          } else if (vm.dialogTitle == "邮箱编辑") {
            params.uuid = val.uuid;
            params.alterId = this.currentUser.userid;
            params.alterName = this.currentUser.username;
            this.editSubmitUpdateDB(params);
          }
        } else {
          console.log('error save!!');
          return false;
        }
      });
    },

    //修改方法
    editSubmitUpdateDB: function (params) {
      let vm = this;
      vm.$axios.post('/mail/updateByVO', params).then(function (res) {
        var result = res.data.result;
        vm.tableData[vm.editIndex].username = result.username;
        vm.tableData[vm.editIndex].password = result.password;
        vm.tableData[vm.editIndex].encoding = result.encoding;
        vm.tableData[vm.editIndex].host = result.host;
        vm.tableData[vm.editIndex].port = result.port;
        vm.tableData[vm.editIndex].protocol = result.protocol;
        // this.tableData[this.editIndex].term = new Date();
        vm.editFormVisible = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },
    //删除所选，批量删除
    removeSelection: function () {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请至少选中一条记录",
          type: "warning"
        });
        return;
      }
      this.$confirm('确认删除选中信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let vm = this;
        vm.$axios.post('/mail/deleteByList', this.multipleSelection).then(function (res) {
          this.$message({
            message: "成功删除" + res.data.result + "条用户信息",
            showClose: true,
            onClose: this.searchClick('delete')
          });
        }.bind(this), function (error) {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //关闭Dialog
    closeDialog: function (val) {
      this.editFormVisible = false;
      this.$refs["editForm"].resetFields();
    }
  }
};
</script>

<style>

</style>