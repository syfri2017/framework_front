<template>
  <div id="userList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
				<el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
					<el-row>
						<el-col :span="1" class="searchInline">&nbsp;</el-col>
						<el-col :span="9" class="searchInline">
							<label class="el-form-item__label searchLabel">用户名</label>
							<el-input size="small" v-model="searchForm.username" placeholder="用户名" clearable></el-input>
						</el-col>
						<el-col :span="2" class="searchInline">&nbsp;</el-col>
						<el-col :span="1" class="searchInline">&nbsp;</el-col>
						<el-col :span="9" class="searchInline">
							<label class="el-form-item__label searchLabel">真实姓名</label>
							<el-input size="small" v-model="searchForm.realname" placeholder="真实姓名" clearable></el-input>
						</el-col>
						<el-col :span="2" class="searchInline">&nbsp;</el-col>
					</el-row>
					<div>
						<el-form>
							<el-col :span="12" class="btnEditDelete">
								<el-form-item align="left">
									<!-- <el-button type="primary" icon="edit" size="small" @click="editClick">修改</el-button> -->
									<el-button v-if="hasPermission('system/user:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
									<el-button v-if="hasPermission('system/user:delete')" type="danger" icon="el-icon-delete" size="small" @click="removeSelection">删除</el-button>
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
					@selection-change="selectionChange" class="tableStyle" :height="tableheight" :row-style="rowStyle">
					<el-table-column type="selection" width="35"></el-table-column>
					<el-table-column type="index" show-overflow-tooltip label="序号" width="65" align="center"></el-table-column>
					<el-table-column prop="username" show-overflow-tooltip label="用户名" min-width="14%" align="center"></el-table-column>
					<el-table-column prop="realname" show-overflow-tooltip label="真实姓名" min-width="12%" align="center"></el-table-column>
					<el-table-column prop="organizationName" show-overflow-tooltip label="组织机构" min-width="13%" align="center"></el-table-column>
					<!-- <el-table-column prop="birth" show-overflow-tooltip label="生日" min-width="13%" align="center" :formatter="tableDateFormat"></el-table-column> -->
					<el-table-column prop="sex" show-overflow-tooltip label="性别" min-width="7%" align="center" :formatter="tableSexFormat"></el-table-column>
					<el-table-column prop="mobile" show-overflow-tooltip label="手机号" min-width="14%" align="center"></el-table-column>
					<el-table-column prop="email" show-overflow-tooltip label="邮箱" min-width="13%" align="center"></el-table-column>
					<el-table-column prop="role" show-overflow-tooltip label="角色" min-width="10%" align="center">
						<template slot-scope="scope">
							<el-button type="text" @click="roleDetails(scope.row.userid)">查看详情</el-button>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="65" align="center" v-if="hasPermission('system/user:edit')">
						<template slot-scope="scope">
							<el-button type="text" @click="editClick(scope.row,scope.$index)">编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
        <!--翻页组件-->
        <paginator></paginator>
			</div>
			<!--角色列表页-->
			<el-dialog title="用户角色列表" :visible.sync="roleDetailVisible" :close-on-click-modal="false">
				<el-checkbox-group v-model="roleDetailSelect">
					<el-checkbox v-for="role in roleDetailList" :label="role.rolename" :key="role.roleid" disabled>{{role.roleinfo}}<br></el-checkbox>
				</el-checkbox-group>
			</el-dialog>
      <!-- 编辑-->
			<el-dialog :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog(editForm)" :close-on-click-modal="false">
				<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
					<div v-show="true" v-once>{{usernameOld}}</div>
						<el-row>
							<el-col :span="11">
								<el-form-item label="用户名" prop="username">
									<el-input v-model="editForm.username" placeholder="用户名" size="small" auto-complete="off" maxlength="30" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="11">
								<el-form-item label="真实姓名" prop="realname">
									<el-input v-model="editForm.realname" placeholder="真实姓名" size="small" auto-complete="off" maxlength="20" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
						</el-row>
						<el-row v-if="editPasswordShow">
							<el-col :span="11">
								<el-form-item label="密码" prop="password">
									<el-input v-model="editForm.password" type="password" placeholder="密码" size="small" auto-complete="off" maxlength="60" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="11">
								<el-form-item label="确认密码" prop="checkPass">
									<el-input v-model="editForm.checkPass" type="password" placeholder="确认密码" size="small" auto-complete="off" maxlength="60" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
						</el-row>
								<!--组织机构隐藏-->
								<!--
								<el-row>
									<el-col :span="23">
										<el-form-item label="组织机构" prop="organizationId">
											<el-cascader :options="zzjgData" :props="jgidprops" size="small" v-model="editForm.organizationId" placeholder="请选择" class="searchSelect" clearable change-on-select :show-all-levels="false"></el-cascader>
										</el-form-item>
									</el-col>
									<el-col :span="1">&nbsp;</el-col>
								</el-row>
								-->
						<el-row>
							<el-col :span="11">
								<el-form-item label="手机号" prop="mobile">
									<el-input v-model="editForm.mobile" auto-complete="off" placeholder="手机号" size="small" maxlength="15" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="11">
								<el-form-item label="邮箱" prop="email">
									<el-input v-model="editForm.email" auto-complete="off" placeholder="邮箱" size="small" maxlength="30" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
						</el-row>
						<el-row>
							<el-col :span="11">
								<el-form-item label="生日" prop="birth">
									<el-date-picker type="date" placeholder="选择日期" size="small" @change="dateChangebirthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
												auto-complete="off" v-model="editForm.birth">
									</el-date-picker>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
							<el-col :span="11">
								<el-form-item label="性别" prop="sex">
									<el-radio-group v-model="editForm.sex" size="small" auto-complete="off">
										<el-radio class="radio" :label="'1'">男</el-radio>
										<el-radio class="radio" :label="'2'">女</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
						</el-row>
						<el-row>
							<el-col :span="23">
								<el-form-item label="角色" prop="roles" id="roleDiv" style="height:34px;overflow:hidden;">
									<el-checkbox-group v-model="editForm.roles" size="small" style="float:left;width:88%;">
										<el-checkbox v-for="role in allRoles" :label="role.rolename" :key="role.id">{{role.roleinfo}}</el-checkbox>
									</el-checkbox-group>
									<el-button id="roleSpread" size="mini" type="info" plain style="float:right;margin-top:6px;" @click="spread">展开</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="1">&nbsp;</el-col>
						</el-row>
						<el-row class="buttonSubmit">
							<el-row>
                <el-button v-if="dialogTitle == '用户编辑'" type="warning" icon="edit" size="small" @click="editPassword">修改密码</el-button>
                <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog(editForm)"> 取消</el-button>
                <el-button type="success" icon="el-icon-check" size="small" class="btn_save" @click="editSubmit('editForm')">保存</el-button>
							</el-row>
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
    var validatePwdAgain = (rule, value, callback) => {
      if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value) == false) {
        callback(new Error("密码应为6-16位字母和数字组合"));
      } else if (value !== this.editForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      //搜索表单
      searchForm: {
        id: "",
        username: "",
        realname: ""
      },
      //表数据
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      
      allRoles: [],
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
      //序号
      indexData: 0,
      //详情页是否显示
      itemFormVisible: false,
      //Dialog Title
      dialogTitle: "用户编辑",
      //组织机构
      zzjgData: [],
      jgidprops: {
        value: "dzid",
        label: "dzjc",
        children: "children"
      },
      //选中的序号
      editIndex: -1,
      //修改界面是否显示
      editFormVisible: false,
      editLoading: false,
      editFormRules: {
        realname: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个汉字", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[0-9A-Za-z]{2,16}$/,
            message: "用户名应为2-16位字母、数字",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}/,
            message: "手机号格式不正确",
            trigger: "blur"
          },
          { min: 11, max: 11, message: "手机号格式不正确", trigger: "blur" }
        ],
        email: [
          { required: false, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
            message: "密码应为6-16位字母和数字组合",
            trigger: "blur"
          }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwdAgain, trigger: "blur" }
        ],
        organizationId: [
          { required: true, message: "请选择组织机构", trigger: "select" }
        ]
      },
      //修改界面数据
      editForm: {
        userid: "",
        username: "",
        password: "",
        organizationId: "",
        checkPass: "",
        realname: "",
        birth: "",
        sex: 0,
        mobile: "",
        email: "",
        roles: []
      },
      editFormSelect: [],
      editRoles: [],
      roleDetailVisible: false,
      roleDetailList: [],
      roleDetailSelect: [],
      //登陆用户
      currentUser: this.CONSTANT.currentUser,
      //修改密码是否显示
      editPasswordShow: false,
      //登陆用户名-旧
      usernameOld: ""
    };
  },
  created: function() {
    this.searchClick("click");
  },
  methods: {
    //表格查询事件
    searchClick: function(type) {
      //按钮事件的选择
      if (type == "page") {
        this.tableData = [];
      } else {
        this.currentPage = 1;
      }
      this.loading = true; //表格重新加载
      var params = {
        deptid: "GLYH",
        username: this.searchForm.username.replace(/%/g, "\\%"),
        realname: this.searchForm.realname.replace(/%/g, "\\%"),
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      this.$axios.post('/user/findByVO', params).then(function(res) {
          this.tableData = res.data.result;
          this.total = res.data.result.length;
          this.loading = false;
        }.bind(this),function(error) {
          console.log(error);
        }
      );
    },
    //制作机构级联选择
    getZzjgData: function(val) {
      var organization = this.currentUser.organizationVO;
      var param = {
        dzid: organization.uuid,
        dzjc: organization.jgjc,
        dzbm: organization.jgid
      };
      this.$axios.post("/xfdz/findSjdzByUserAll", param).then(
        function(res) {
          this.zzjgData = res.data.result;
          if (this.dialogTitle == "用户编辑") {
            this.editSearch(val);
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //清空查询条件
    clearClick: function() {
      (this.searchForm.id = ""),
        (this.searchForm.username = ""),
        (this.searchForm.realname = ""),
        this.searchClick("reset");
    },
    //表格勾选事件
    selectionChange: function(val) {
      this.multipleSelection = val;
    },
    
    //增加、修改时“生日”表单赋值
    dateChangebirthday(val) {
      this.editForm.birth = val;
    },
    //表格重新加载数据
    loadingData: function() {
      var _self = this;
      _self.loading = true;
      setTimeout(function() {
        console.info("加载数据成功");
        _self.loading = false;
      }, 300);
    },
    //查看角色详情
    roleDetails: function(id) {
      var _self = this;
      _self.roleDetailVisible = true;
      this.$axios.get("/role/getRole/" + id).then(
        function(res) {
          this.roleDetailList = res.data.result;
          for (var i = 0; i < this.roleDetailList.length; i++) {
            this.roleDetailSelect.push(this.roleDetailList[i].rolename);
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //获取所有的角色
    getAllRoles: function() {
      this.$axios.get("/role/getAll").then(
        function(res) {
          this.allRoles = res.data.result;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //新增事件
    addClick: function() {
      this.dialogTitle = "用户新增";
      this.editPasswordShow = true;
      this.getAllRoles();
      /**组织机构隐藏 */
      /**this.getZzjgData(null);*/
      this.editFormVisible = true;
    },
    //表格修改事件
    editClick: function(val, index) {
      this.editIndex = index;
      this.dialogTitle = "用户编辑";
      this.editPasswordShow = false;
      this.getAllRoles();
      /**组织机构隐藏 */
      /**this.getZzjgData(val)*/ this.editSearch(val);
      this.editFormVisible = true;
    },

    //修改密码
    editPassword: function() {
      var flag = this.editPasswordShow;
      this.editPasswordShow = !flag;
    },

    //修改时查询方法
    editSearch: function(val) {
      //获取选择行主键
      var params = {
        pkid: val.pkid
      };
      this.$axios.post("/user/findByVO", params).then(
        function(res) {
          var tempData = res.data.result[0];
          this.editForm.pkid = tempData.pkid;
          this.editForm.userid = tempData.userid;
          this.editForm.username = tempData.username;
          this.editForm.password = tempData.password;
          this.editForm.organizationId = tempData.organizationId;
          this.editForm.realname = tempData.realname;
          this.editForm.birth = tempData.birth;
          this.editForm.sex = tempData.sex;
          this.editForm.mobile = tempData.mobile;
          this.editForm.email = tempData.email;
          this.editForm.roles = tempData.roles;
         
          //密码、再次密码置空
          this.editForm.password = "";
          this.editForm.checkPass = "";
          //保存当前用户名username
          this.usernameOld = this.editForm.username;
          //角色复选框赋值
          var roles = [];
          for (var i = 0; i < this.editForm.roles.length; i++) {
            roles.push(this.editForm.roles[i].rolename);
          }
          this.editForm.roles = roles;
          //组织机构联动下拉框赋值
          /**组织机构隐藏 */
          /**
                var zzjgArray = [];
                var temp = this.editForm.organizationId;
                if(temp!=null && temp!=""){
                    for(var i in this.zzjgData){
                        if(temp == this.zzjgData[i].dzid){
                            zzjgArray.push(this.zzjgData[i].dzid);
                        }else{
                            for(var j in this.zzjgData[i].children){
                                if(temp == this.zzjgData[i].children[j].dzid){
                                    zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid);
                                }else{
                                    for(var k in this.zzjgData[i].children[j].children){
                                        if(temp == this.zzjgData[i].children[j].children[k].dzid){
                                            zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid);
                                        }else{
                                            for(var n in this.zzjgData[i].children[j].children[k].children){
                                                if(temp == this.zzjgData[i].children[j].children[k].children[n].dzid){
                                                    zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid, this.zzjgData[i].children[j].children[k].children[n].dzid);
                                                }else{
                                                    for(var m in this.zzjgData[i].children[j].children[k].children[n].children){
                                                        if(temp == this.zzjgData[i].children[j].children[k].children[n].children[m].dzid){
                                                            zzjgArray.push(this.zzjgData[i].dzid, this.zzjgData[i].children[j].dzid, this.zzjgData[i].children[j].children[k].dzid, this.zzjgData[i].children[j].children[k].children[n].dzid, this.zzjgData[i].children[j].children[k].children[n].children[m].dzid);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }  
                }
                this.editForm.organizationId = zzjgArray;
                */
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },

    //编辑提交点击事件
    editSubmit: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var val = this.editForm;
          //组织机构
          /**
                    var organizationIdString = "";
                    if(val.organizationId.length>0){
                        organizationIdString = val.organizationId[val.organizationId.length-1];
                    }
                    */
          //角色
          var roleList = [];
          for (var i = 0; i < val.roles.length; i++) {
            for (var j = 0; j < this.allRoles.length; j++) {
              if (val.roles[i] == this.allRoles[j].rolename) {
                var temp = {
                  roleid: this.allRoles[j].roleid,
                  rolename: this.allRoles[j].rolename,
                  roleinfo: this.allRoles[j].roleinfo
                };
                roleList.push(temp);
                break;
              }
            }
          }
          var params = {
            username: val.username,
            password: val.password,
            realname: val.realname,
            // organizationId: organizationIdString,
            birth: val.birth,
            sex: val.sex,
            mobile: val.mobile,
            email: val.email,
            roles: roleList,
            deptid: "GLYH"
          };
          if (this.dialogTitle == "用户新增") {
            this.$axios.get("/account/getNum/" + this.editForm.username + "/static").then(
                function(res) {
                  if (res.data.result != 0) {
                    this.$message({
                      message: "用户名已存在!",
                      type: "error"
                    });
                  } else {
                    params.createId = this.currentUser.userid;
                    params.createName = this.currentUser.username;
                    this.$axios.post("/user/insertByVO", params).then(
                      function(res) {
                        var addData = res.data.result;
                        this.tableData.unshift(addData);
                        this.total = this.tableData.length;
                      }.bind(this),
                      function(error) {
                        console.log(error);
                      }
                    );
                    this.editFormVisible = false;
                  }
                }.bind(this),
                function(error) {
                  console.log(error);
                }
              );
          } else if (this.dialogTitle == "用户编辑") {
            params.pkid = val.pkid;
            params.userid = val.userid;
            params.alterId = this.currentUser.userid;
            params.alterName = this.currentUser.username;
            if (this.editForm.username == this.usernameOld) {
              this.editSubmitUpdateDB(params);
            } else {
              this.$axios.get("/account/getNum/" + this.editForm.username + "/static").then(
                  function(res) {
                    if (res.data.result != 0) {
                      this.$message({
                        message: "用户名已存在",
                        type: "error"
                      });
                    } else {
                      this.editSubmitUpdateDB(params);
                    }
                  }.bind(this),
                  function(error) {
                    console.log(error);
                  }
                );
            }
          }
        } else {
          console.log("error save!!");
          return false;
        }
      });
    },

    //修改方法-update数据库  by li.xue 2018/11/22 15:46
    editSubmitUpdateDB: function(params) {
      this.$axios.post("/user/updateByVO", params).then(
        function(res) {
          var result = res.data.result;
          this.tableData[this.editIndex].username = result.username;
          this.tableData[this.editIndex].realname = result.realname;
          this.tableData[this.editIndex].organizationName =
            result.organizationName;
          this.tableData[this.editIndex].birth = result.birth;
          this.tableData[this.editIndex].sex = result.sex;
          this.tableData[this.editIndex].mobile = result.mobile;
          this.tableData[this.editIndex].email = result.email;
          this.tableData[this.editIndex].roles = result.roles;
          this.editFormVisible = false;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },

    //获取复选框选中值
    getCheckValue(val) {
      this.editFormSelect = val;
    },

    //删除所选，批量删除
    removeSelection: function() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请至少选中一条记录",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认删除选中信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post("/user/deleteByList", this.multipleSelection).then(
            function(res) {
              this.$message({
                message: "成功删除" + res.data.result + "条用户信息",
                showClose: true,
                onClose: this.searchClick("delete")
              });
            }.bind(this),
            function(error) {
              console.log(error);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //查看详情
    closeDialog: function(val) {
      this.editFormVisible = false;
      // val.username ='';
      // val.realname = '';
      // val.password = '';
      // val.checkPass = '';
      // val.birth = '';
      // val.sex = '';
      // val.mobile = '';
      // val.email ='';
      this.$refs["editForm"].resetFields();
    },
    //展开 收起
    spread: function() {
      var a = document.getElementById("roleSpread").innerText;
      if (a == "展开") {
        document.getElementById("roleDiv").style.height = "auto";
        document.getElementById("roleSpread").innerText = "收起";
      } else if (a == "收起") {
        document.getElementById("roleDiv").style.height = "34px";
        document.getElementById("roleSpread").innerText = "展开";
      }
    }
  }
};
</script>

