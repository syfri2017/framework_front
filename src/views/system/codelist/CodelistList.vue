<template>
  <div id="codelistList">
    <div id="tableView" v-loading="this.loading" element-loading-text="加载中">
			<el-row>
        <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
          <el-row>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">代码类型</label>
              <el-input size="small" v-model="searchForm.codetype" placeholder="请输入代码类型名称" prefix-icon="el-icon-search" clearable></el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="9" class="searchInline">
              <label class="el-form-item__label searchLabel">代码类型名称</label>
              <el-input size="small" v-model="searchForm.codetypeName" placeholder="请输入代码类型名称" prefix-icon="el-icon-search" clearable></el-input>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <div>
            <el-form>
              <el-col :span="12" class="btnEditDelete">
                <el-form-item align="left">
                  <el-button v-if="hasPermission('system/codelist:add')" type="success" icon="el-icon-plus" size="small" @click="addClick">新增</el-button>
                  <el-button v-if="hasPermission('system/codelist:delete')" type="danger" icon="el-icon-delete" size="small" @click="removeSelection">删除</el-button>
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
				<el-table class="table-formal" border id="table" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="selectionChange"
          :height="tableheight" tooltip-effect="dark" :row-style="rowStyle">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="65"></el-table-column>
          <el-table-column prop="codetype" show-overflow-tooltip label="代码类型" min-width="10%" align="center">
              <template slot-scope="scope">
                  <el-button @click="codetypeCilck(scope.row)" type="text" v-text="scope.row.codetype"></el-button>
              </template>
          </el-table-column>
          <el-table-column prop="codetypeName" show-overflow-tooltip label="代码类型名称" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
          <!-- <el-table-column prop="language" label="国际化信息" min-width="12%" align="center"></el-table-column> -->
          <el-table-column prop="createName" show-overflow-tooltip label="创建人" min-width="11%" align="center"></el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="13%" align="center" :formatter="tableDateFormat"></el-table-column>
          <el-table-column prop="alterName" show-overflow-tooltip label="修改人" min-width="11%" align="center"></el-table-column>
          <el-table-column prop="alterTime" show-overflow-tooltip label="修改时间" min-width="13%" align="center" :formatter="tableDateFormat"></el-table-column>
          <el-table-column prop="remark" show-overflow-tooltip label="备注" min-width="12%" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="65" align="center" v-if="hasPermission('system/codelist:edit')">
              <template slot-scope="scope">
                  <el-button type="text" @click="editClick(scope.row,scope.$index)">编辑</el-button>
              </template>
          </el-table-column>
        </el-table>
        <!--翻页组件-->
        <paginator></paginator>
			</div>

      <!-- 编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" @close="closeDialog('editForm')" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
          <div v-show="false" v-once v-model="codetypeOld"></div>
          <el-row>
            <el-col :span="23">
              <el-form-item label="代码类型" prop="codetype">
                <el-input v-model="editForm.codetype" auto-complete="off" placeholder="代码类型" size="small" maxlength="30" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="代码类型名称" prop="codetypeName">
                <el-input v-model="editForm.codetypeName" auto-complete="off" placeholder="代码类型名称" size="small" maxlength="64" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="国际化信息" prop="language" value="zh_CN">
                <el-input v-model="editForm.language" auto-complete="off" placeholder="国际化信息" size="small" maxlength="8" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row>
            <el-col :span="23">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" auto-complete="off" placeholder="备注" size="small" maxlength="128" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click="closeDialog()"> 取消</el-button>
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
        codetype: "",
        codetypeName: "",
        createTime:new Array()
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
      total: 10,
      //修改界面是否显示
      editFormVisible: false,
      editFormRules: {
        codetype: [
          { required: true, message: "请输入代码集类型", trigger: "blur" },
          { pattern: /^[a-zA-Z0-9_-]{2,30}$/, message: '长度为2-30个字母、数字、_-符号',trigger: 'blur'},
        ],
        codetypeName: [{ required: true, message: "请输入代码集类型名称", trigger: "blur" }],
        language: [{ pattern: /^[a-zA-Z0-9_-]{1,8}$/, message: '长度为2-8个字母、数字、_-符号',trigger: 'blur'},]
      },
      //修改界面数据
      editForm: {
        codetype: "",
        codetypeName: "",
        remark: "",
        language: "zh_CN"
      },
      //代码集名称-旧
      codetypeOld: "",
      //Dialog Title
      dialogTitle: "代码集编辑",
      //选中的序号
      editIndex: -1
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
        codetype: vm.searchForm.codetype.replace(/%/g,"\\%"),
        codetypeName: vm.searchForm.codetypeName.replace(/%/g,"\\%"),
        createTimeBegin: vm.searchForm.createTime[0],
        createTimeEnd: vm.searchForm.createTime[1],
        pageSize: vm.pageSize,
        pageNum: vm.currentPage
      };
      vm.$axios.post('/codelist/findByVO', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage-1)*this.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        vm.total = res.data.result.total;
        vm.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },

    //清空查询条件
    clearClick: function() {
      this.searchForm.codetype = "",
      this.searchForm.codetypeName = "",
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

    //代码集详情
    codetypeCilck: function (val) {
      this.$router.push({name:"codelist/detail", query: {codeid: val.codeid}})
    },
   
    //新增事件
    addClick: function() {
      this.dialogTitle = "代码集新增";
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
      vm.dialogTitle = "代码集编辑";
      vm.$axios.get('/codelist/' + val.codeid).then(function (res) {
        vm.editForm = res.data.result;
        //保存当前用户名codetype
        vm.codetypeOld = this.editForm.codetype;
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
            codetype: val.codetype,
            codetypeName: val.codetypeName,
            remark: val.remark
          }
          if(vm.dialogTitle == "代码集新增"){
            vm.$axios.get('/codelist/getNum/' + vm.editForm.codetype).then(function(res){
              if(res.data.result != 0){
                vm.$message({
                  message: "代码集类型已存在",
                  type: "error"
                });
              }else{
                params.createId = vm.currentUser.userid;
                params.createName = vm.currentUser.username;
                vm.$axios.post('/codelist/insertByVO', params).then(function (res) {
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
          }else if(vm.dialogTitle == "代码集编辑"){
            params.codeid = val.codeid;
            params.alterId = vm.currentUser.userid;
            params.alterName = vm.currentUser.username;
            if(vm.editForm.codetype == this.codetypeOld){
              vm.editSubmitUpdateDB(params);
            }else{
              vm.$axios.get('/codelist/getNum/' + this.editForm.codetype).then(function(res){
                if(res.data.result != 0){
                  vm.$message({
                    message: "代码集类型已存在",
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
      vm.$axios.post('/codelist/updateByVO', params).then(function (res) {
        var result = res.data.result;
        this.tableData[vm.editIndex].codetype = result.codetype;
        this.tableData[vm.editIndex].codetypeName = result.codetypeName;
        this.tableData[vm.editIndex].remark = result.remark;
        this.tableData[vm.editIndex].language = result.language;
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
        vm.$axios.post('/codelist/deleteByList', this.multipleSelection).then(function (res) {
          vm.$message({
            message: "成功删除" + res.data.result + "条代码集信息",
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
      this.$refs["editForm"].resetFields();
    }
  }
};
</script>

