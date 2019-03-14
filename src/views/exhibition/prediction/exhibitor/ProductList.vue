<template>
  <div id="productList">
    <el-row class="mb10">
      <el-form id="cpjs" v-if="cpjsData.length>0" :inline="true" style="width: 100%;" class="demo-form-inline">
        <el-form-item align="left">
          <el-button type="success" icon="el-icon-plus" size="small" @click="addClick()">
            <span v-if="userType=='CHN'">新增</span>
            <span v-if="userType=='ENG'">Add</span>
          </el-button>
        </el-form-item>
        <el-form-item v-for="(cpjs,index) in cpjsData" style="width: 100%;" :key="index">
          <el-card class="mb10 card_style" id="cpjsImg">
            <div slot="header" class="clearfix">
              <div class="r">
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteClick(cpjs)">
                  <span v-if="userType=='CHN'">删除</span>
                  <span v-if="userType=='ENG'">Delete</span>
                </el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="editClick(cpjs)">
                  <span v-if="userType=='CHN'">修改</span>
                  <span v-if="userType=='ENG'">Edit</span>
                </el-button>
              </div>
            </div>
            <el-row class="h100">
              <el-col :span="5" class="h100 tc">
                <img v-if="cpjs.src!==''" :src="cpjs.imageUrl" @click="imgPreview(cpjs.imageUrl)" class="poi">
                <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
              </el-col>
              <!--中文-->
              <el-col v-if="userType=='CHN'" :span="19" style="line-height: 24px" class="pl15 mb10">
                <strong>产品类型：</strong>
                <span v-text="cpjs.cplxmc||'无'"></span>
                <br>
                <strong>产品简介：</strong>
                <span v-text="cpjs.cpjj||'无'"></span>
                <br>
                <strong>产品英文简介：</strong>
                <span v-text="cpjs.reserve1||'无'"></span>
              </el-col>
              <!--英文-->
              <el-col v-if="userType=='ENG'" :span="19" style="line-height: 24px" class="pl15 mb10">
                <strong>Category of the Product：</strong>
                <span v-text="cpjs.cplxmc_ENG||'no'"></span>
                <br>
                <strong>Product Introduction：</strong>
                <span v-text="cpjs.cpjj||'no'"></span>
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
      </el-form>
      <span v-if="(!cpjsData.length>0) && userType=='CHN'">暂无产品信息</span>
      <span v-if="(!cpjsData.length>0) && userType=='ENG'">Have no product information</span>
    </el-row>
    <!--产品编辑-中文-->
    <el-dialog v-if="userType=='CHN'" :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog(editForm)" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="110px" :rules="editFormRules" ref="editForm">
        <el-row>
          <el-form-item label="产品图片" style="text-align: left" class="is-required">
            <el-upload class="avatar-uploader" ref="uploadCpPics" :headers="myHeaders" action="http://localhost:8809/qycpjs/upload" :on-success="cpjsPicSuccess" :before-upload="CpPicsChange" :show-file-list="false" :data="CpjsUpLoadData">
              <img v-if="editForm.src!=='' && editForm.src!==null" :src="editForm.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="el-upload__tip" slot="tip" style="line-height:0px">jpg/png文件，且小于2MB</div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="cplx" label="产品所属分类">
            <el-cascader :options="cpssfl_data" :props="defaultProps" size="small" v-model="editForm.cplx" placeholder="产品所属分类" class="searchSelect" clearable show-all-levels></el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="el-upload__tip"></div>
        </el-row>
        <el-row id="cpjsArea">
          <el-form-item prop="cpjj" label="产品简介">
            <el-input type="textarea" maxlength="150" :rows="2" placeholder="产品简介" v-model="editForm.cpjj" :onkeyup="checkWord(editForm.cpjj,'cpjs_span','150')"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="el-upload__tip" style="float: right;">还可输入
            <span style="color: red" id="cpjs_span">{{150-editForm.cpjj.length}}</span>字</div>
        </el-row>
        <el-row id="cpjsArea">
          <el-form-item prop="reserve1" label="产品英文简介">
            <el-input type="textarea" maxlength="400" :rows="2" placeholder="产品英文简介" v-model="editForm.reserve1" :onkeyup="checkWord(editForm.reserve1,'cpjsEng_span','400')"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="el-upload__tip" style="float: right;">还可输入
            <span v-if="editForm.reserve1!=null" style="color: red" id="cpjsEng_span">{{400-editForm.reserve1.length}}</span>
            <span v-else style="color: red" id="cpjsEng_span">400</span>
            个英文字符</div>
        </el-row>
        <el-row class="mt35 mb20">
          <el-col :span="24" style="text-align: center">
            <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog(editForm)"> 取消</el-button>
            <el-button type="success" icon="el-icon-check" size="small" class="btn_save" @click="editSubmit(editForm)">保存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--产品编辑-英文-->
    <el-dialog v-if="userType=='ENG'" :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog(editForm)" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="200px" :rules="editFormRulesENG" ref="editForm">
        <el-row>
          <el-form-item label="Product Photo" style="text-align: left" class="is-required">
            <el-upload class="avatar-uploader" ref="uploadCpPics" :headers="myHeaders" action="http://localhost:8809/qycpjs/upload" :on-success="cpjsPicSuccess" :before-upload="CpPicsChange" :show-file-list="false" :data="CpjsUpLoadData">
              <img v-if="editForm.src!=='' && editForm.src!==null" :src="editForm.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <div class="el-upload__tip" slot="tip" style="line-height:0px">jpg/png,less than 2MB</div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="cplx" label="Category of the Product">
            <el-cascader :options="cpssfl_data_ENG" :props="defaultProps" size="small" v-model="editForm.cplx" placeholder="Category of the Product" class="searchSelect" clearable show-all-levels></el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="el-upload__tip"></div>
        </el-row>
        <el-row id="cpjsArea">
          <el-form-item prop="cpjj" label="Product Introduction">
            <el-input type="textarea" maxlength="300" :rows="2" placeholder="Product Introduction" v-model="editForm.cpjj" :onkeyup="checkWord(editForm.cpjj,'cpjs_span','300')"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <div class="el-upload__tip" style="float: right;">less than
            <span style="color: red" id="cpjs_span">{{300-editForm.cpjj.length}}</span> characters</div>
        </el-row>
        <el-row class="mt35 mb20">
          <el-col :span="24" style="text-align: center">
            <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog(editForm)"> Cancel</el-button>
            <el-button type="success" icon="el-icon-check" size="small" class="btn_save" @click="editSubmit(editForm)">Submit</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--图片预览-->
    <el-dialog id="previewImgDialog" v-if="true" :visible.sync="showPicVisible" :close-on-click-modal="false" size="tiny">
      <img :src="previewImg" width="100%" class="mt15">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "productList",

  data() {
    return {
      baseUrl: window.config.baseUrl,
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //当前用户中英文标识
      userType: this.CONSTANT.currentUser.usertype,
      myHeaders: { XTOKEN: localStorage.getItem("XTOKEN") },
      loading: false,
      showPicVisible: false,
      previewImg: "",
      qyid: "", //企业id
      userid: this.CONSTANT.currentUser.userid,
      //产品介绍
      cpjsData: [],
      //产品所属分类
      cpssfl_data: [],
      cpssfl_data_ENG: [],
      //要删除的图片路径list
      delPicList: [],
      //未保存的图片路径list
      unsavedPicList: [],
      //树结构配置
      defaultProps: {
        children: "children",
        label: "codeName",
        value: "codeValue"
      },
      //编辑（新增）页面对话框标题
      dialogTitle: "产品编辑",
      //编辑页面显示flag
      editFormVisible: false,
      //产品图片上传参数
      CpjsUpLoadData: {
        qyid: ""
      },
      //修改界面数据
      editForm: {
        uuid: "",
        cplx: [],
        cpjj: "",
        reserve1: "",
        src: "",
        imageUrl: ""
      },
      //表单验证
      editFormRules: {
        cplx: [
          { required: true, message: "请选择产品类型", trigger: "change" }
        ],
        cpjj: [
          { required: true, message: "请输入产品简介", trigger: "blur" },
          { min: 1, max: 150, message: "最多可输入100个字", trigger: "blur" }
        ],
        reserve1: [
          { required: false, message: "请输入产品英文简介", trigger: "blur" },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "只能输入字母、数字和英文符号",
            trigger: "blur"
          },
          { min: 0, max: 400, message: "最多可输入400个字符", trigger: "blur" }
        ]
      },
      //英文表单验证
      editFormRulesENG: {
        cplx: [
          {
            required: true,
            message: "Category of the Product is required",
            trigger: "change"
          }
        ],
        cpjj: [
          {
            required: true,
            message: "Product Introduction is required",
            trigger: "blur"
          },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and Symbols only",
            trigger: "blur"
          },
          // { pattern: /^[A-Za-z0-9 ]+$/, message: 'Characters and number and blank only',trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: "less than 300 characters",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    this.getJbxxData(this.userid);
    //查询产品所属分类
    this.getCpssfl();
    //英文
    this.getCpssflENG();
  },
  methods: {
    //根据代码集获取产品所属分类
    getCpssfl: function() {
      let vm = this;
      vm.$axios.get("/codelist/getDzlxTree/CPLX").then(
        function(res) {
          vm.cpssfl_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据代码集获取产品所属分类
    getCpssflENG: function() {
      let vm = this;
      vm.$axios.get("/codelist/getDzlxTree/CPLX_EN").then(
        function(res) {
          vm.cpssfl_data_ENG = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据userid查询qyid
    getJbxxData: function(val) {
      let vm = this;
      vm.loading = true;
      var params = {
        userid: vm.userid,
        deleteFlag: "N"
      };
      vm.$axios.post("/qyjbxx/doFindByVo", params).then(
        function(res) {
          if (res.data.result != null) {
            vm.qyid = res.data.result.qyid;
            vm.CpjsUpLoadData.qyid = res.data.result.qyid;
            vm.getCpjsData(vm.qyid);
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //查询产品介绍
    getCpjsData: function(val) {
      let vm = this;
      var param = {
        qyid: val
      };
      vm.$axios.post("/qycpjs/list", param).then(
        function(res) {
          if (res.data.result != null) {
            vm.cpjsData = res.data.result;
            for (var i in vm.cpjsData) {
              vm.cpjsData[i].imageUrl =
                vm.baseUrl + "/upload/" + vm.cpjsData[i].src;
            }
          }
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //图片预览
    imgPreview: function(val) {
      this.previewImg = val;
      this.showPicVisible = true;
    },
    //产品图片change
    CpPicsChange: function(file, fileList) {
      var fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      var fileNameLength = file.name.length; //取到文件名长度
      var fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const isPng = fileFormat.toLowerCase() == "png";
      const isJpg = fileFormat.toLowerCase() == "jpg";
      const isLt2M = file.size / 1024 / 1024 <= 2;
      if (!isPng && !isJpg) {
        if (this.userType == "CHN") {
          this.$message.error("只能上传jpg、png格式的图片");
        } else if (this.userType == "ENG") {
          this.$message.error("Picture has to be endswith png or jpg");
        }
        fileList.splice(-1, 1);
      } else if (!isLt2M) {
        if (this.userType == "ENG") {
          this.$message.error("Picture has to be less than 2MB!");
        } else if (this.userType == "CHN") {
          this.$message.error("上传图片大小须小于2MB!");
        }
        fileList.splice(-1, 1);
      } else {
        //this.delPicList.push(this.delPicSrc);
        this.delPicList.push(this.editForm.src);
      }
    },
    //产品图片上传成功回调方法
    cpjsPicSuccess: function(res, file) {
      this.editForm.src = res.src;
      this.editForm.imageUrl = URL.createObjectURL(file.raw);
      this.unsavedPicList.push(res.src);
    },
    //点击编辑按钮
    editClick: function(val) {
      if (this.userType == "ENG") {
        this.dialogTitle = "Edit Product";
      } else {
        this.dialogTitle = "产品编辑";
      }
      //产品类型准换成级联下拉数组
      var cplxArray = [];
      cplxArray.push(val.cplx.substr(0, 1) + "000");
      cplxArray.push(val.cplx);
      //向form赋值
      this.editForm.uuid = val.uuid;
      this.editForm.cplx = cplxArray;
      this.editForm.cpjj = val.cpjj;
      this.editForm.reserve1 = val.reserve1;
      this.editForm.src = val.src;
      this.editForm.imageUrl = val.imageUrl;
      //显示编辑页面
      this.editFormVisible = true;
    },
    //点击删除按钮
    deleteClick: function(val) {
      let vm = this;
      if (vm.cpjsData.length <= 1) {
        if (vm.userType == "ENG") {
          vm.$message({
            type: "error",
            message: "Please fill out at least one product example"
          });
        } else {
          vm.$message({
            type: "error",
            message: "您需要保留至少一条产品信息"
          });
        }
      } else {
        if (vm.userType == "ENG") {
          vm
            .$confirm("Do you confirm deletion?", "Warning", {
              confirmButtonText: "Delete",
              cancelButtonText: "Cancel",
              type: "warning"
            })
            .then(() => {
              //删除产品方法主体
              vm.doDelete(val);
            })
            .catch(() => {
              vm.$message({
                type: "info",
                message: "Delete canceled!"
              });
            });
        } else {
          vm
            .$confirm("此操作将永久删除该产品, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
            .then(() => {
              //删除产品方法主体
              vm.doDelete(val);
            })
            .catch(() => {
              vm.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      }
    },
    //删除事件方法
    doDelete: function(val) {
      let vm = this;
      vm.$axios.post("/qycpjs/doDeleteCpxx", val).then(
        function(res) {
          if (res.data.result > 0) {
            if (vm.userType == "ENG") {
              vm.$message({
                type: "success",
                message: "deleted successfully!"
              });
            } else {
              vm.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            //删除图片
            var list = [];
            list.push(val.src);
            vm.$axios.post("/qycpjs/delPic", list).then(
              function(res) {
                vm.delPicList = [];
              }.bind(vm),
              function(error) {
                console.log(error);
              }
            );
            //刷新产品列表
            vm.getCpjsData(vm.qyid);
          } else {
            if (vm.usertype == "ENG") {
              vm.$message({
                type: "error",
                message: "deleted error!"
              });
            } else {
              vm.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          }
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //新增
    addClick: function() {
      if (this.cpjsData.length < 6) {
        if (this.userType == "ENG") {
          this.dialogTitle = "Add Product";
        } else {
          this.dialogTitle = "产品新增";
        }
        this.editFormVisible = true;
      } else {
        if (this.userType == "ENG") {
          this.$message({
            message: "You can add at most 6 product Examples",
            type: "warning"
          });
        } else {
          this.$message({
            message: "最多可添加6个产品，您已达到最大数量",
            type: "warning"
          });
        }
      }
    },
    //删除delPicList中的图片
    deletePic: function() {
      let vm = this;
      if (vm.delPicList.length > 0) {
        vm.$axios.post("/qycpjs/delPic", vm.delPicList).then(
          function(res) {
            vm.delPicList = [];
          }.bind(vm),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    //关闭编辑对话框
    closeDialog: function(val) {
      let vm = this;
      //删除上传但未保存的图片
      if (vm.unsavedPicList.length > 0) {
        vm.$axios.post("/qycpjs/delPic", vm.unsavedPicList).then(
          function(res) {
            vm.unsavedPicList = [];
          }.bind(vm),
          function(error) {
            console.log(error);
          }
        );
      }
      //清空delPicList
      vm.delPicList = [];
      //清空editForm
      vm.editForm = {
        uuid: "",
        cplx: [],
        cpjj: "",
        reserve1: "",
        src: "",
        imageUrl: ""
      };
      //编辑页隐藏
      vm.editFormVisible = false;
      //重置校验
      vm.$refs["editForm"].resetFields();
    },
    //提交
    editSubmit: function(val) {
      let vm = this;
      vm.$refs["editForm"].validate(valid => {
        if (valid) {
          if (vm.editForm.src == null || vm.editForm.src == "") {
            if (vm.userType == "ENG") {
              vm.$message({
                message: "Product Photo is required",
                type: "warning"
              });
            } else {
              vm.$message({
                message: "请上传产品图片",
                type: "warning"
              });
            }

            console.log("error submit!!");
            return false;
          } else {
            if (val.uuid != null && val.uuid != "") {
              //编辑
              var params = {
                uuid: vm.editForm.uuid,
                cplx: vm.editForm.cplx[vm.editForm.cplx.length - 1],
                cpjj: vm.editForm.cpjj,
                reserve1: vm.editForm.reserve1,
                src: vm.editForm.src,
                xgrid: vm.currentUser.userid,
                xgrmc: vm.currentUser.username
              };
              vm.$axios.post("/qycpjs/doUpdateByVO", params).then(
                function(res) {
                  if (res.data.result > 0) {
                    if (vm.userType == "ENG") {
                      vm.$message({
                        message: "Save successful",
                        type: "success"
                      });
                    } else {
                      vm.$message({
                        message: "成功保存产品信息",
                        type: "success"
                      });
                    }
                    vm.deletePic();
                  } else {
                    if (vm.userType == "ENG") {
                      vm.$message({
                        message: "Save failed",
                        type: "warning"
                      });
                    } else {
                      vm.$message({
                        message: "保存失败",
                        type: "warning"
                      });
                    }
                  }
                  //清空unsavedPicList
                  vm.unsavedPicList = [];
                  //清空delPicList
                  vm.delPicList = [];
                  //关闭对话框
                  vm.closeDialog(vm.editForm);
                  //刷新产品列表
                  vm.getCpjsData(vm.qyid);
                }.bind(vm),
                function(error) {
                  console.log(error);
                }
              );
            } else {
              //新增
              var params = {
                qyid: vm.qyid,
                cplx: vm.editForm.cplx[vm.editForm.cplx.length - 1],
                cpjj: vm.editForm.cpjj,
                reserve1: vm.editForm.reserve1,
                src: vm.editForm.src,
                cjrid: vm.currentUser.userid,
                cjrmc: vm.currentUser.username
              };
              vm.$axios.post("/qycpjs/doInsertCpxx", params).then(
                function(res) {
                  if (res.data.result > 0) {
                    if (vm.userType == "ENG") {
                      vm.$message({
                        message: "Save successful",
                        type: "success"
                      });
                    } else {
                      vm.$message({
                        message: "成功保存产品信息",
                        type: "success"
                      });
                    }

                    vm.deletePic();
                  } else {
                    if (vm.userType == "ENG") {
                      vm.$message({
                        message: "Save failed",
                        type: "warning"
                      });
                    } else {
                      vm.$message({
                        message: "保存失败",
                        type: "warning"
                      });
                    }
                  }
                  //清空unsavedPicList
                  vm.unsavedPicList = [];
                  //清空delPicList
                  vm.delPicList = [];
                  //关闭对话框
                  vm.closeDialog(vm.editForm);
                  //刷新产品列表
                  vm.getCpjsData(vm.qyid);
                }.bind(vm),
                function(error) {
                  console.log(error);
                }
              );
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
#productList {
  input[type="file"] {
    display: none;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .el-upload__tip {
    margin-top: 2px;
    margin-bottom: 10px;
  }
  #cpjs .el-form-item__content {
    width: 100% !important;
  }
  #cpjs .el-card__body {
    height: 106px;
  }
  #cpjsImg img {
    max-height: 100%;
    max-width: 100%;
  }
  #cpjsArea .el-form-item__error {
    padding-top: 8px;
  }
  #cpjs .el-form-item__content {
    line-height: 30px;
  }
}
</style>
