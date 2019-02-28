<template>
<div id = "resource">
  <div class="frame f14">
    <div class="frame_left" style="background-color:#F5FAFC;">
      <h4 class="src_name">资源树&nbsp;<el-button v-if="hasPermission('system/resource:add')" type="text" icon="el-icon-plus" size="small" @click="appendParent"></el-button></h4>
        <div scroll="no" class="src_slt">			
          <el-tree
            :data="tableData"
            node-key="resourceid"
            :props="defaultProps"
            :render-content="renderContent"
            @node-click="handleNodeClick"
            :highlight-current = true
            style="background-color:#F5FAFC; font-weight:bold; width:100%; font-weight:100px; border:none;">
          </el-tree>
        </div>
		</div>
		<div class="frame_right" scroll="no" style="background-color:#F5FAFC;">
		  <h4 class="src_name">
        资源树详情&nbsp;
        <el-button v-if="hasPermission('system/resource:edit')" v-show="editVisible" type="text" plain icon="el-icon-edit" size="small" @click="editClick" style="color: #FF4949"></el-button>
      </h4>
      <div style="margin-top: 20px;">
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
          <el-row>
            <el-col :span="23">
              <el-form-item label="资源名称" prop="resourcename">
                <el-input v-model="editForm.resourcename" auto-complete="off" placeholder="资源名称" size="small" clearable :disabled="editFlag"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="资源描述" prop="resourceinfo">
                <el-input v-model="editForm.resourceinfo" auto-complete="off" placeholder="资源描述" size="small" clearable :disabled="editFlag"></el-input>
              </el-form-item>
            </el-col>
          </el-row>				
          <el-row>				
            <el-col :span="23">
              <el-form-item label="父资源" prop="parentid">
              <!--  <el-input v-model="editForm.parentid" auto-complete="off" placeholder="父资源" size="small" clearable :disabled="editFlag"></el-input>-->
              <el-cascader :options="parentData" :props="cascaderProps" size="small" v-model="editForm.parentid" placeholder="父资源" class="searchSelect"
                  clearable change-on-select :show-all-levels="false" :disabled="editFlag"></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>				
            <el-col :span="23">				
              <el-form-item label="顺序" prop="seqno">				
                <el-input v-model="editForm.seqno" auto-complete="off" placeholder="顺序" size="small" clearable :disabled="editFlag"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="图标地址" prop="icon">
                <el-input v-model="editForm.icon" auto-complete="off" placeholder="图标地址" size="small" clearable :disabled="editFlag"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="资源类型" prop="type" class="is-required">
                <el-select size="small" v-model="editForm.type" placeholder="请选择" class="searchSelect" clearable :disabled="editFlag">
                  <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="权限列表" prop="permissions">
                <el-checkbox-group v-model="editForm.permissions" :max="1">
                  <el-checkbox v-for="permission in allPermissionList" :label="permission.permissionid" :key="permission.permissionid" clearable :disabled="editFlag">{{permission.permissioninfo}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit" v-show="!editFlag">
            <el-button type="clear" icon="el-icon-close" size="small" @click="cancel">取消</el-button>
              <el-button type="success" icon="el-icon-check" size="small" @click="update">保存</el-button>
            </el-row>
          </el-form>
        </div>	
      </div>
	</div>
  <!--新建界面-->
	<el-dialog title="资源新增" :visible.sync="addVisible" @close="closeDialog()" :close-on-click-modal="false">
		<el-form :model="addForm" label-width="120px" ref="addForm" :rules="addFormRules">
			<el-row>
				<el-col :span="23">
					<el-form-item label="资源名称" prop="resourcename">
						<el-input v-model="addForm.resourcename" auto-complete="off" placeholder="资源名称" size="small" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="23">
					<el-form-item label="资源描述" prop="resourceinfo">
						<el-input v-model="addForm.resourceinfo" auto-complete="off" placeholder="资源描述" size="small" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row>
				<el-col :span="23">
					<el-form-item label="父资源" prop="parentid">
						<el-input v-model="addForm.parentid" auto-complete="off" placeholder="父资源" size="small" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row> -->
			<el-row>
				<el-col :span="23">
					<el-form-item label="图标地址" prop="icon">
						<el-input v-model="addForm.icon" auto-complete="off" placeholder="图标地址" size="small" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="23">
					<el-form-item label="资源类型" prop="type" class="is-required">
						<el-select size="small" v-model="addForm.type" placeholder="请选择" class="searchSelect" clearable>
							<el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="23">
					<el-form-item label="权限列表" prop="permissions">
						<el-checkbox-group v-model="addForm.permissions" :max="1">
							<el-checkbox v-for="permission in allPermissionList" :label="permission.permissionid" :key="permission.permissionid" clearable>{{permission.permissioninfo}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row class="buttonSubmit">
				<el-button type="clear" icon="close" size="small" class="btn_submit" @click="closeDialog(addForm)"> 取消</el-button>
				<el-button type="success" icon="check" size="small" class="btn_save" @click="addSubmit(addForm)">保存</el-button>
			</el-row>
		</el-form>
	</el-dialog>

</div>
</template>

<script>
export default {
  name: "resource",
  data() {
    return {
      //登陆用户
      currentUser: this.CONSTANT.currentUser,
      //表数据
      tableData: [], //Grid中数据
      //父资源级联下拉数据
      parentData: [],
      //资源树结构配置
      defaultProps: {
        children: "children",
        label: "resourceinfo"
      },
      //级联下拉结构配置
      cascaderProps: {
        children: 'children',
        label: 'resourceinfo',
        value: 'resourceid'
      },
      editForm: {
        resourcename: "",
        resourceinfo: "",
        parentid: [],
        type: "",
        seqno: "",
        icon: "",
        permissions: []
      },
      //资源类型
      typeData: [
        { codeValue: "1", codeName: "菜单" },
        { codeValue: "2", codeName: "操作" }
      ],
      //全部资源列表
      allPermissionList: [],
      editFormRules: {
        resourcename: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          {
            pattern: /^[0-9A-Za-z\\\/-_]{2,50}$/,
            message: "资源名称应为2-50位字母、数字、/\\",
            trigger: "blur"
          }
        ],
        resourceinfo: [
          { required: true, message: "请输入资源描述", trigger: "blur" }
        ],
        parentid:[
          { required: true, message: '请选父资源', trigger: 'change' }
        ],
        type: [
          {
            validator: (rule, value, callback) => {
              if (value == "" || value == null) {
                callback(new Error("请选择资源类型"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      //编辑点击Flag
      editFlag: true,
      //编辑按钮显示与隐藏
      editVisible: false,
      addVisible: false,
      addForm: {
        resourcename: "",
        resourceinfo: "",
        parentid: "",
        icon: "",
        type: "",
        permissions: []
      },
      addFormRules: {
        resourcename: [
          { required: true, message: "请输入资源名称", trigger: "blur" },
          {
            pattern: /^[0-9A-Za-z\\\/-_]{2,50}$/,
            message: "资源名称应为2-50位字母、数字、/\\",
            trigger: "blur"
          }
        ],
        resourceinfo: [
          { required: true, message: "请输入资源描述", trigger: "blur" }
        ],
        type: [
          {
            validator: (rule, value, callback) => {
              if (value == "" || value == null) {
                callback(new Error("请选择资源类型"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  created: function() {
    //获取资源树
    this.getAllTree();
    //获取父资源级联下拉data
    this.getParentData();
    //获取全部权限
    this.getAllPermissions();
  },
  methods: {
    //获取资源树
    getAllTree:function(){
      let vm = this;
      vm.$axios.get("/resource/getAll").then(
        function(res) {
          this.tableData = res.data.result;
          this.total = this.tableData.length;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      )
    },
    //左侧树点击事件
    handleNodeClick(data, node) {
      this.findResourceById(data.resourceid);
      //编辑按钮的显示
      this.editVisible = true;
    },
    //编辑点击事件  by li.xue 2018/11/27
    editClick: function() {
      this.editFlag = false;
    },
    //更新
    update: function() {
      let vm = this;
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          var permission = new Array();
          for (var i in this.editForm.permissions) {
            var params = {
              permissionid: this.editForm.permissions[i]
            };
            permission.push(params);
          }
          var params = {
            resourceid: this.editForm.resourceid,
            resourcename: this.editForm.resourcename,
            resourceinfo: this.editForm.resourceinfo,
            parentid: this.editForm.parentid[this.editForm.parentid.length -1],
            seqno: this.editForm.seqno,
            icon: this.editForm.icon,
            type: this.editForm.type,
            permissions: permission,
            alterId: this.currentUser.userid,
            alterName: this.currentUser.username
          };
          vm.$axios.post("/resource/updateByVO", params).then(
            function(res) {
              if(res.data.result != null && res.data.result !=undefined && res.data.result != ''){
                this.editForm.resourceinfo = res.data.result.resourceinfo;
              //  this.changeTreeLable(this.tableData, this.editForm.resourceid);
                this.$message({
                  showClose: true,
                  message: "更新成功",
                  type: "success"
                });
                //location.reload();
                this.getAllTree();
                this.getParentData();
                //取消保存按钮的隐藏
                this.editFlag = true;
                }else{
                  this.$message({
                    showClose: true,
                    message: "更新失败",
                    type: "error"
                  });
                }
              
            }.bind(this),
            function(error) {
              this.$message({
                showClose: true,
                message: "更新失败",
                type: "error"
              });
              console.log(error);
            }
          );
        } else {
          console.log("error save!!");
          return false;
        }
      });
    },
    //新增
    append(store, data ,vm) {
      vm.addVisible = true;
      vm.addForm.parentid = data.resourceid;
    },
    //新增父级资源
    appendParent: function() {
      this.addVisible = true;
      this.addForm.parentid = "-1";
    },
    //删除
    remove(store, data, vm) {
      vm.$confirm("此操作将删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          var id = data.resourceid;
          vm.$axios.get("/resource/deleteOneById/" + id).then(function(res) {
            if(res.data.message = "删除成功"){
              store.remove(data);
              vm.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
            }else{
              vm.$message({
                showClose: true,
                message: "删除失败",
                type: "error"
              });
            }
          }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
        })
        .catch(() => {
          vm.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //获取权限列表
    getAllPermissions: function() {
      let vm = this;
      vm.$axios.get("/permission/getAll").then(
        function(res) {
          this.allPermissionList = res.data.result;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //资源详情
    findResourceById: function(resourceid) {
      let vm = this;
      vm.$axios.get("/resource/" + resourceid).then(
        function(res) {
          this.editForm = res.data.result;
          //父资源级联下拉数据处理
          var parentidArray = [];
          var temp = this.editForm.parentid;
          if(temp!=null && temp!=""){
            for(var i in this.parentData){
              if(temp == this.parentData[i].resourceid){
                parentidArray.push(this.parentData[i].resourceid);
              }else{
                for(var j in this.parentData[i].children){
                  if(temp == this.parentData[i].children[j].resourceid){
                    parentidArray.push(this.parentData[i].resourceid, this.parentData[i].children[j].resourceid);
                  }else{
                    for(var k in this.parentData[i].children[j].children){
                      if(temp == this.parentData[i].children[j].children[k].resourceid){
                        parentidArray.push(this.parentData[i].resourceid, this.parentData[i].children[j].resourceid, this.parentData[i].children[j].children[k].resourceid);
                      }
                    }
                  }
                }
              }
            }  
          }
          this.editForm.parentid = parentidArray;
          //获取资源权限
          this.permissionDetails(resourceid);
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据资源ID查询其权限
    permissionDetails: function(id) {
      let vm = this;
      this.editForm.permissions = [];
      vm.$axios.get("/permission/getPermission/" + id).then(
        function(res) {
          for (var i = 0; i < res.data.result.length; i++) {
            this.editForm.permissions.push(res.data.result[i].permissionid);
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //取消
    cancel: function() {
      this.findResourceById(this.editForm.resourceid);
      //取消保存按钮的隐藏
      this.editFlag = true;
    },
    //左侧树显示的label
    renderContent(createElement, { node, data, store }) {
      let vm = this;
      if (data.type == "1") {
        if (this.hasPermission("system/resource:add") && this.hasPermission("system/resource:delete") ) {
          return createElement("span", {}, [
            createElement("span", {}, [createElement("span", node.label)]),
            createElement("span", {}, [
              createElement("el-button", {
                style: {
                  "font-size": " 12px",
                  float: "right",
                  "margin-right": "10px"
                },
                attrs: { type: "text" },
                on: {
                  click: function() {
                    vm.$options.methods.remove(store, data, vm);
                  }
                },
                domProps: { innerHTML: "<i class='el-icon-delete'></i>" }
              }),
              createElement("el-button", {
                style: {
                  "font-size": " 14px",
                  float: "right",
                  "margin-right": "20px"
                },
                attrs: { type: "text" },
                on: {
                  click: function() {
                    vm.$options.methods.append(store, data, vm);
                  }
                },
                domProps: { innerHTML: "+" }
              })
            ])
          ]);
        } else {
          if (this.hasPermission("system/resource:add")) {
            return createElement("span", {}, [
              createElement("span", {}, [createElement("span", node.label)]),
              createElement("span", {}, [
                createElement("el-button", {
                  style: {
                    "font-size": " 14px",
                    float: "right",
                    "margin-right": "10px"
                  },
                  attrs: { type: "text" },
                  on: {
                    click: function() {
                      vm.$options.methods.append(store, data, vm);
                    }
                  },
                  domProps: { innerHTML: "+" }
                })
              ])
            ]);
          } else if (this.hasPermission("system/resource:delete")) {
            return createElement("span", {}, [
              createElement("span", {}, [createElement("span", node.label)]),
              createElement("span", {}, [
                createElement("el-button", {
                  style: {
                    "font-size": " 12px",
                    float: "right",
                    "margin-right": "10px"
                  },
                  attrs: { type: "text" },
                  on: {
                    click: function() {
                      vm.$options.methods.append(store, data, vm);
                    }
                  },
                  domProps: { innerHTML: "<i class='el-icon-delete'></i>" }
                })
              ])
            ]);
          } else {
            return createElement("span", {}, [
              createElement("span", {}, [createElement("span", node.label)])
            ]);
          }
        }
      } else {
        if (this.hasPermission("system/resource:delete")) {
          return createElement("span", {}, [
            createElement("span", {}, [createElement("span", node.label)]),
            createElement("span", {}, [
              createElement("el-button", {
                style: {
                  "font-size": " 12px",
                  float: "right",
                  "margin-left": "10px"
                },
                attrs: { type: "text" },
                on: {
                  click: function() {
                    vm.$options.methods.remove(store, data, vm);
                  }
                },
                domProps: { innerHTML: "<i class='el-icon-delete'></i>" }
              })
            ])
          ]);
        } else {
          return createElement("span", {}, [
            createElement("span", {}, [createElement("span", node.label)])
          ]);
        }
      }
    },
    //新增事件
    addSubmit: function(val) {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          let vm = this;
          var params = {
            resourcename: this.addForm.resourcename
          };
          vm.$axios.post("/resource/list", params).then(
            function(res) {
              var addData = res.data.result;
              if (addData.length != 0) {
                this.$message({
                  showClose: true,
                  message: "资源名称已存在",
                  type: "error"
                });
              } else {
                var permission = new Array();
                for (var i in this.addForm.permissions) {
                  var param = {
                    permissionid: this.addForm.permissions[i]
                  };
                  permission.push(param);
                }
                var params = {
                  resourcename: this.addForm.resourcename,
                  resourceinfo: this.addForm.resourceinfo,
                  parentid: val.parentid,
                  icon: this.addForm.icon,
                  type: this.addForm.type,
                  permissions: permission,
                  createId: this.currentUser.userid,
                  createName: this.currentUser.username
                };
                vm.$axios.post("/resource/insertByVO", params).then(function(res) {
                  if(res.data.result != null && res.data.result !=undefined && res.data.result != ''){
                    this.$message({
                      showClose: true,
                      message: "新增成功",
                      type: "success"
                    });
                    //location.reload();
                    this.closeDialog();
                    this.getAllTree();
                    this.getParentData();
                  }else{
                    this.$message({
                      showClose: true,
                      message: "新增失败",
                      type: "error"
                    });
                  }
                }.bind(this),
                  function(error) {
                    console.log(error);
                  }
                );
              }
            }.bind(this),
            function(error) {
              console.log(error);
            }
          );
        } else {
          console.log("error save!!");
          return false;
        }
      });
    },
    closeDialog: function(val) {
      this.addVisible = false;
      this.$refs["addForm"].resetFields();
    },

    changeTreeLable: function(parentNode, searchKey) {
      for (var i in parentNode) {
        if (parentNode[i].resourceid == searchKey) {
          parentNode[i].resourceinfo = this.editForm.resourceinfo;
        } else if (parentNode[i].children != null) {
          var children = parentNode[i].children;
          this.changeTreeLable(children, searchKey);
        }
      }
    },
    //获取父资源级联下拉框数据
    getParentData:function(){
      let vm = this;
      vm.$axios.get('/resource/parentidMenuTree').then(function (res) {
        var temp = [{
          resourceid:'-1',
          resourceinfo:'根目录',
          children:res.data.result
        }];
        vm.parentData = temp;
      }.bind(this), function (error) {
        console.log(error)
      })
    }
  }
};
</script>

<style lang="scss">
#resource{
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .frame{
    width: 100%;
    height: 490px;
  }
  .frame_left{
    float:left;
    width:30%;
    height: 490px;
    border: 2px solid #C5C5C5;
    background: #F5F5F5;
    box-shadow: 2px 4px 6px #c0c0c0;
  }
  .frame_right{
    float:left;
    margin-left:0.3%;
    width: 69.7%;
    height: 490px; 
    border:2px solid #C5C5C5;
    background: #F5F5F5;
    overflow-x:hidden; 
    box-shadow: 2px 4px 6px #c0c0c0;
  }
  .src_name{
    text-align: center;
    font-weight: bold;
    font-family: '微软雅黑';
    color:#333;
  }
  .src_slt{
    margin-top: 1px;
    margin-left: 5px;
    overflow-x: hidden;
    height: 405px;
  }
  .h4,h4{
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-form-item {
      margin-bottom: 0px !important;
      width: 100%;
  }
  .el-form-item__error{
      padding-top:0px;
  }
  .el-tree-node__content{
    height: 32px;
    line-height: 40px;
  }
  .el-checkbox+.el-checkbox{
    margin-left: 14px;
  }
}
</style>


