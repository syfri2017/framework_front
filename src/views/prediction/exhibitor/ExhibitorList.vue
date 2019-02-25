<template>
  <div id="exhibitorList">
    <el-row>
      <el-form label-width="75px" :inline="true">
        <el-row>
          <el-col :span="8" class="searchInline">
            <label class="el-form-item__label searchLabel">用户名</label>
            <el-input size="small" v-model="searchForm.username" placeholder="用户名" clearable></el-input>
          </el-col>
          <el-col :span="8" class="searchInline">
            <label class="el-form-item__label searchLabel">公司名称</label>
            <el-input size="small" v-model="searchForm.zwgsmc" placeholder="公司名称" clearable></el-input>
          </el-col>
          <el-col :span="8" class="searchInline">
            <label class="el-form-item__label searchLabel">展商类型</label>
            <el-select size="small" v-model="searchForm.usertype" placeholder="全部" class="searchSelect" clearable>
              <el-option v-for="item in zslxData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div>
          <el-form>
            <el-col :span="12" class="btnEditDelete">
              <el-form-item align="left">                       
                <el-button v-if="hasPermission('prediction/exhibitor:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
                <el-button v-if="hasPermission('prediction/exhibitor:delete')" type="danger" icon="el-icon-delete" size="small" @click="deleteClick">删除</el-button>
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
      <el-table border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @selection-change="selectionChange" class="tableStyle" :height="tableheight">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
        <el-table-column prop="username" show-overflow-tooltip label="用户名" min-width="15%" align="center"></el-table-column>
        <el-table-column prop="usertypeName" show-overflow-tooltip label="展商类型" min-width="12%" align="center"></el-table-column>
        <el-table-column prop="zwgsmc" show-overflow-tooltip label="公司名称" min-width="20%" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc"></span>
            <span v-else v-text="scope.row.zwgsmc"></span>
          </template>
        </el-table-column>
        <el-table-column prop="lxr" show-overflow-tooltip label="联系人" min-width="10%" align="center"></el-table-column>
        <el-table-column prop="dzyx" show-overflow-tooltip label="电子邮箱" min-width="15%" align="center"></el-table-column>
        <el-table-column label="重置" width="100" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="resetClick(scope.row,scope.$index)">重置密码</el-button>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="65" align="center" v-if="hasPermission('prediction/exhibitor:edit')">
            <template slot-scope="scope">
                <el-button type="text" @click="editClick(scope.row,scope.$index)">编辑</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!--列表底部工具条和分页符-->
      <paginator></paginator>
    </div>

    <!-- 编辑-->
    <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog(editForm)" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-form-item label="展商类型" prop="usertype">
              <el-radio-group v-model="editForm.usertype" size="small" auto-complete="off">
                <el-radio class="radio" :label="'CHN'">国内</el-radio>
                <el-radio class="radio" :label="'ENG'">国外</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
        </el-row>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form-item label="用户名" prop="username">
              <el-input v-if="editForm.usertype == 'ENG'" v-model="editForm.username" placeholder="请输入用户名，用户名为邮箱" size="small" auto-complete="off" clearable :disabled="editFlag" maxlength="30"></el-input>
              <el-input v-else v-model="editForm.username" placeholder="请输入用户名，用户名为手机号" size="small" auto-complete="off" clearable :disabled="editFlag" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            &nbsp;
            <el-button v-if="dialogTitle=='展商用户编辑'" v-text="editFlagText" type="text" size="small" @click="editFlagChange" style="margin-top:6px;"></el-button>
          </el-col>
        </el-row>
        <el-row v-if="editPasswordShow">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password" type="password" placeholder="请输入密码，密码为6-16位数字字母组合" size="small" auto-complete="off" clearable maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
        </el-row>
        <el-row v-if="editPasswordShow">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="editForm.checkPass" type="password" placeholder="请输入确认密码" size="small" auto-complete="off" clearable maxlength="60"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
        </el-row>
        <el-row class="buttonSubmit">
          <el-col :span="24" style="text-align: center">
            <el-button v-if="dialogTitle == '展商用户编辑'" type="warning" icon="edit" size="small" @click="editPassword">修改密码</el-button>
            <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog(editForm)"> 取消</el-button>
            <el-button type="success" icon="el-icon-check" size="small" class="btn_save" @click="editSubmit(editForm)">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
//引入翻页 paginator
import paginator from '@/components/paginator'
export default {
  name: 'exhibitorList',
  components: {
    paginator
  },
  data () {
    var validatePwdAgain = (rule, value, callback) => {
      if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) == false) {
        callback(new Error("密码应为6-16位字母和数字组合"));
      } else if (value !== this.editForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    var validateUsername = (rule, value, callback) => {
      if (this.editForm.usertype == 'CHN') {
        if (value == null || value == '') {
          callback(new Error("请输入手机号"));
        } else if (/^[1][3,4,5,7,8][0-9]{9}$/.test(value) == false) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      } else if (this.editForm.usertype == 'ENG') {
        if (value == null || value == '') {
          callback(new Error("请输入邮箱"));
        } else if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(value) == false) {
          callback(new Error("邮箱格式不正确"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //显示加载中
      loading: false,          
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      //表数据
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      //搜索表单
      searchForm: {
        id: "",
        username: "",
        zwgsmc: "",
        usertype: "",
      },
      //展商类型Data
      zslxData: [
        {codeValue: 'CHN', codeName: '国内'},
        {codeValue: 'ENG', codeName: '国外'}
      ],
      //编辑页按钮显示与隐藏
      editFlag: false,
      //编辑页按钮内容
      editFlagText: "编辑",
      //选中的序号
      editIndex: -1,
      //Dialog Title
      dialogTitle: "展商用户编辑",
      //修改密码是否显示
      editPasswordShow: false,
      //修改界面是否显示
      editFormVisible: false,
      //修改界面数据
      editForm: {
        pkid: "",
        userid: "",
        username: "",
        password: "",
        checkPass: "",
        usertype: ""
      },
      editFormRules: {
        usertype: [
          { required: true, message: '请选择展商类型', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validateUsername, trigger: "blur" }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码应为6-16位字母和数字组合', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePwdAgain, trigger: "blur" }
        ],
      },
      //编辑页面用户名备份
      editFormUsername: "",
      //刪除多选值
      multipleSelection: [],
    }
  },
  created: function () {
    this.searchClick('click');
  },
  methods: {
    //表格查询事件
    searchClick: function(type) {
      let vm = this;
      //按钮事件的选择
      if(type == 'page'){
        this.tableData = [];
      }else{
        this.currentPage = 1;
      }
      this.loading = true;//表格重新加载
      var params = {
        username: this.searchForm.username.replace(/%/g,"\\%"),
        zwgsmc: this.searchForm.zwgsmc.replace(/%/g,"\\%"),
        usertype: this.searchForm.usertype,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      }
      vm.$axios.post('/qyjbxx/doFindZsxxByQyjbxx', params).then(function (res) {
        var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
        this.tableData = tableTemp.concat(res.data.result.list);
        this.total = res.data.result.total;
        this.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },

    //清空查询条件
    clearClick: function () {
        this.searchForm.id = "",
        this.searchForm.username = "",
        this.searchForm.zwgsmc = "",
        this.searchForm.usertype = "",
        this.searchClick('reset');
    },

    //新增事件
    addClick: function () {
      this.dialogTitle = "展商用户新增";
      this.editPasswordShow = true;
      this.editFlag = false;
      this.editFormVisible = true;
    },

    //修改事件
    editClick: function(val, index) {
      this.editFlagText = "编辑";
      this.editIndex = index;
      this.dialogTitle = "展商用户编辑";
      this.editPasswordShow = false;
      this.editSearch(val);
      this.editFlag = true;
      this.editFormVisible = true;
    },

    //删除所选，批量删除
    deleteClick: function () {
      let vm = this;
      this.$confirm('确认删除选中信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          vm.$axios.post('/user/deleteByList', this.multipleSelection).then(function (res) {
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

    //重置密码
    resetClick: function(val, index){
      let vm = this;
      var params = {
        pkid: val.pkid,
        userid: val.userid
      }
      this.$confirm('是否将密码重置成“111111”?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        vm.$axios.post('/user/doResetPassword', params).then(function(res) {
          this.$message({
            message: "密码重置成功",
            type: "success"
          });
        }.bind(this), function (error) {
          console.log(error)
        })
      }).catch(() => {
        this.$message({
        type: 'info',
        message: '已取消重置'
        });          
      });     
    },

    //修改时查询方法
    editSearch: function(val){
      let vm = this;
      //获取选择行主键
      var params = {
        pkid: val.pkid,
        deptid: "ZSYH"
      };
      vm.$axios.post('/user/findByVO', params).then(function(res) {
        var userData = res.data.result[0];
        vm.editFormUsername =  res.data.result[0].username;
        vm.editForm.pkid = userData.pkid;
        vm.editForm.userid = userData.userid;
        vm.editForm.usertype = userData.usertype;
        vm.editForm.username = userData.username;
      }.bind(this), function (error) {
          console.log(error)
      }) 
    },

    //修改密码
    editPassword: function(){
      var flag = this.editPasswordShow;
      this.editPasswordShow = !flag;
    },

    //编辑提交点击事件
    editSubmit: function(val) {
      let vm = this;
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          if(this.dialogTitle == "展商用户新增"){
            vm.$axios.get('/account/getNum/' + this.editForm.username + "/static").then(function(res){
              if(res.data.result != 0){
                this.$message({
                    message: "用户名已存在!",
                    type: "error"
                });
              }else{
                var params = {
                  username: val.username,
                  password: val.password,
                  deptid: "ZSYH",
                  usertype: val.usertype,
                  createId: this.currentUser.userid,
                  createName: this.currentUser.username
                }
                vm.$axios.post('/user/insertByVO', params).then(function(res){
                  var addData = res.data.result;
                  if(addData.usertype == 'ENG'){
                      addData.usertypeName = "国外";
                  }else if(addData.usertype == 'CHN'){
                      addData.usertypeName = "国内";
                  }
                  this.tableData.unshift(addData);
                  this.total = this.tableData.length;
                  this.editFormVisible = false;
                }.bind(this),function(error){
                  console.log(error)
                })
              }
            }.bind(this),function(error){
                console.log(error)
            })
          }else if(this.dialogTitle == "展商用户编辑"){
            var params = {
              pkid: val.pkid,
              userid: val.userid,
              username: val.username,
              deptid: "ZSYH",
              usertype: val.usertype,
              alterId: this.currentUser.userid,
              alterName: this.currentUser.realName
            }
            if(this.editPasswordShow){
              params.password = val.password;
            }
            if(!this.editFlag){
              vm.$axios.get('/account/getNum/' + this.editForm.username + "/static").then(function(res){
                if (res.data.result != 0) {
                  this.$message({
                    message: "用户名已存在!",
                    type: "error"
                  });
                  return;
                } else {
                  this.updateExhibitor(params);
                }
              }.bind(this),function(error){
                  console.log(error)
              })
            } else {
              this.updateExhibitor(params);
            }
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //修改方法
    updateExhibitor: function(params) {
      let vm = this;
      vm.$axios.post('/user/updateByVO', params).then(function (res){
        var result = res.data.result;
        this.tableData[this.editIndex].username = result.username;
        if(result.usertype == "CHN"){
          this.tableData[this.editIndex].usertypeName = "国内"; 
        }else if(result.usertype == "ENG"){
          this.tableData[this.editIndex].usertypeName = "国外"; 
        }
        this.editFormVisible = false;
        this.$message({
          message: "修改成功！",
          type: "success"
        });
      }.bind(this), function (error) {
          console.log(error)
      })
    },

    //编辑页按钮显示
    editFlagChange: function(){
      if(this.editFlag){
        this.editFlag = false;
        this.editFlagText = "取消"; 
      }else{
        this.editFlag = true;
        this.editFlagText = "编辑";
        this.editForm.username = this.editFormUsername;
      }
    },

    //表格勾选事件
    selectionChange: function (val) {
      for (var i = 0; i < val.length; i++) {
          var row = val[i];
      }
      this.multipleSelection = val;
    },

    //关闭Dialog
    closeDialog: function (val) {
        this.editFormVisible = false;
        this.$refs["editForm"].resetFields();
    },
  }
}
</script>

<style>

</style>
