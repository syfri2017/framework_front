<template>
  <div id="positionType">
    <div class="main-container" v-loading="loading" element-loading-text="加载中">
      <!-- 面包屑 -->
      <div id="breadcrumb_box"></div>
      <div id="tableView">
        <el-row>
          <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
            <el-row>
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="9" class="searchInline">
                <label class="el-form-item__label searchLabel">展位类型</label>
                <el-select
                  size="small"
                  v-model="searchForm.zwfl"
                  placeholder="全部"
                  class="searchSelect"
                  clearable
                >
                  <el-option
                    v-for="item in zwlbData"
                    :key="item.codeValue"
                    :label="item.codeName"
                    :value="item.codeValue"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="9" class="searchInline">
                <label class="el-form-item__label searchLabel">出口类型</label>
                <el-select
                  size="small"
                  v-model="searchForm.kkfl"
                  placeholder="全部"
                  class="searchSelect"
                  clearable
                >
                  <el-option
                    v-for="item in cklxData"
                    :key="item.codeValue"
                    :label="item.codeName"
                    :value="item.codeValue"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <div>
              <el-form>
                <el-col :span="12">
                  <el-form-item align="left">
                    <el-button
                      type="success"
                      icon="el-icon-download"
                      size="small"
                      @click="addClick"
                    >新增</el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-document"
                      size="small"
                      @click="deleteClick"
                    >删除</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12" class="btnSearchPlus">
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      size="small"
                      @click="searchClick"
                    >查询</el-button>
                    <el-button
                      type="clear"
                      icon="el-icon-refresh"
                      size="small"
                      @click="clearClick"
                    >重置</el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </el-form>
        </el-row>
        <div class="table_container">
          <el-table
            border
            id="table"
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            class="tableStyle"
            :height="tableheight"
            :row-style="rowStyle"
            @selection-change="selectionChange"
          >
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column
              type="index"
              show-overflow-tooltip
              label="序号"
              width="65"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="zwflmc"
              show-overflow-tooltip
              label="展位类型"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="kkflmc"
              show-overflow-tooltip
              label="出口类型"
              min-width="15%"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="flmj"
              show-overflow-tooltip
              label="单位面积(㎡)"
              min-width="15%"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="fljg"
              show-overflow-tooltip
              label="单位面积价格(元)"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="fljgEng"
              show-overflow-tooltip
              label="单位面积价格(美元)"
              min-width="20%"
              align="center"
            ></el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="editClick(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--列表底部工具条和分页符-->
          <paginator></paginator>
        </div>
        <!-- 编辑-->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="editFormVisible"
          @close="closeDialog('editForm')"
          :close-on-click-modal="false"
        >
          <el-form :model="editForm" label-width="140px" :rules="editFormRules" ref="editForm">
            <el-row class="mt20">
              <el-form-item label="展位类型" prop="zwfl">
                <el-radio-group v-model="editForm.zwfl" size="small" @change="zwflChange">
                  <el-radio
                    v-for="item in zwlbData"
                    :key="item.uuid"
                    class="radio"
                    :label="item.codeValue"
                  >{{item.codeName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item v-if="isSngd" label="出口类型" prop="kkfl">
                <el-radio-group v-model="editForm.kkfl" size="small">
                  <el-radio
                    v-for="item in cklxData"
                    :key="item.uuid"
                    class="radio"
                    :label="item.codeValue"
                  >{{item.codeName}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-else-if="!isSngd" label="出口类型">
                <el-radio-group v-model="editForm.kkfl" size="small" disabled>
                  <el-radio
                    v-for="item in cklxData"
                    :key="item.uuid"
                    class="radio"
                    :label="item.codeValue"
                  >{{item.codeName}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label="单位面积价格" prop="fljg">
                  <el-input-number
                    v-model="editForm.fljg"
                    :min="0"
                    :max="99999999.99"
                    :precision="2"
                    size="small"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="line-height: 40px;">
                （RMB/
                <span v-if="editForm.zwfl=='1'" v-text="editForm.flmj"></span>㎡）
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item label prop="fljgEng">
                  <el-input-number
                    v-model="editForm.fljgEng"
                    :min="0"
                    :max="99999999.99"
                    :precision="2"
                    size="small"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="5" style="line-height: 40px;">
                （USB/
                <span v-if="editForm.zwfl=='1'" v-text="editForm.flmj"></span>㎡）
              </el-col>
            </el-row>
            <el-row class="mt35 mb20 tc">
              <el-button
                type="clear"
                icon="el-icon-close"
                size="small"
                class="btn_submit"
                @click="closeDialog('editForm')"
              >取消</el-button>
              <el-button
                type="success"
                icon="el-icon-check"
                size="small"
                class="btn_save"
                @click="editSubmit('editForm')"
              >保存</el-button>
            </el-row>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
//引入翻页 paginator
import paginator from "@/components/paginator";
export default {
  name: "positionType",
  components: {
    paginator
  },
  data: function() {
    return {
      //搜索表单
      searchForm: {
        zwfl: "",
        kkfl: ""
      },
      //表数据
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      //显示加载中样
      loading: false,
      labelPosition: "right",
      //多选值
      multipleSelection: [],
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //出口类型下拉框
      cklxData: [],
      //展位类型下拉框
      zwlbData: [],
      editFormVisible: false,
      selectUuid: "",
      dialogTitle: "",
      editForm: {
        zwfl: "",
        kkfl: "",
        flmj: "",
        fljg: "",
        fljgEng: ""
      },
      isSngd: true, //是否室内光地
      editFormRules: {
        zwfl: [
          { required: true, message: "请选择展位类型", trigger: "change" }
        ],
        kkfl: [{ required: true, message: "请选择出口类型", trigger: "blur" }],
        flmj: [{ required: true, message: "请输入单位面积", trigger: "blur" }],
        fljg: [
          { required: true, message: "请输入单位面积价格(元)", trigger: "blur" }
        ],
        fljgEng: [
          {
            required: true,
            message: "请输入单位面积价格(美元)",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    //展位类型
    this.getZwlb();
    //出口类型
    this.getCklx();
    this.searchClick("click");
  },

  methods: {
    //展位类别下拉框
    getZwlb: function() {
      let vm = this;
      vm.$axios.get("/codelist/getCodetype/ZWLX").then(
        function(res) {
          this.zwlbData = res.data.result;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //出口类型下拉框
    getCklx: function() {
      let vm = this;
      vm.$axios.get("/codelist/getCodetype/CKLX").then(
        function(res) {
          this.cklxData = res.data.result;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
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
        zwfl: this.searchForm.zwfl,
        kkfl: this.searchForm.kkfl,
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      let vm = this;
      vm.$axios.post("/zwflxx/page", params).then(
        function(res) {
          var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
          this.tableData = tableTemp.concat(res.data.result.list);
          this.total = res.data.result.total;
          this.loading = false;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //清空查询条件
    clearClick: function() {
      this.searchForm.zwfl = "";
      this.searchForm.kkfl = "";
      this.searchClick("reset");
    },
    zwflChange: function(val) {
      if (val == "1") {
        this.isSngd = false;
        this.editForm.kkfl = "";
        this.editForm.flmj = 12;
      } else if (val == "2") {
        this.isSngd = true;
        this.editForm.flmj = 1;
      } else if (val == "3") {
        this.isSngd = false;
        this.editForm.kkfl = "";
        this.editForm.flmj = 1;
      }
    },
    addClick: function() {
      this.dialogTitle = "展位分类新增";
      this.editFormVisible = true;
    },
    //表格勾选事件
    selectionChange: function(val) {
      this.multipleSelection = val;
    },
    deleteClick: function() {
      if (
        this.multipleSelection == null ||
        this.multipleSelection.length == 0
      ) {
        this.$message.warning("至少选择一条信息");
      } else {
        this.$confirm("确定删除已选中分类信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            for (var i in this.multipleSelection) {
              this.multipleSelection[i].xgrid = this.currentUser.userid;
              this.multipleSelection[i].xgrmc = this.currentUser.realName;
              this.multipleSelection[i].deleteFlag = "Y";
            }
            let vm = this;
            vm.$axios
              .post("/zwflxx/doDeleteByVolist", this.multipleSelection)
              .then(
                function(res) {
                  this.$message.success(
                    "成功删除" + res.data.result + "条分类信息"
                  );
                  this.searchClick("delete");
                }.bind(this),
                function(error) {
                  console.log(error);
                }
              );
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
    },
    editClick: function(val) {
      this.selectUuid = val.uuid;
      this.dialogTitle = "展位分类编辑";
      let vm = this;
      vm.$axios.get("/zwflxx/" + this.selectUuid).then(
        function(res) {
          this.editForm.zwfl = res.data.result.zwfl;
          this.editForm.kkfl = res.data.result.kkfl;
          this.editForm.flmj = res.data.result.flmj;
          this.editForm.fljg = res.data.result.fljg;
          this.editForm.fljgEng = res.data.result.fljgEng;
          if (this.editForm.zwfl == "2") {
            this.isSngd = true;
          } else {
            this.isSngd = false;
          }
          this.editFormVisible = true;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    editSubmit: function(val) {
      this.$refs[val].validate(valid => {
        if (valid) {
          let vm = this;
          if (this.selectUuid == "") {
            //新增
            var params = {
              zwfl: this.editForm.zwfl,
              kkfl: this.editForm.kkfl,
              flmj: this.editForm.flmj,
              fljg: this.editForm.fljg,
              fljgEng: this.editForm.fljgEng,
              cjrid: this.currentUser.userid,
              cjrmc: this.currentUser.realName
            };

            vm.$axios.post("/zwflxx/insertByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  this.$message.success("保存成功");
                  this.editFormVisible = false;
                  this.searchClick();
                } else {
                  this.$message.error("保存失败");
                }
              }.bind(this),
              function(error) {
                console.log(error);
              }
            );
          } else {
            //编辑
            var params = {
              uuid: this.selectUuid,
              zwfl: this.editForm.zwfl,
              kkfl: this.editForm.kkfl,
              flmj: this.editForm.flmj,
              fljg: this.editForm.fljg,
              fljgEng: this.editForm.fljgEng,
              xgrid: this.currentUser.userid,
              xgrmc: this.currentUser.realName
            };

            vm.$axios.post("/zwflxx/updateByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  this.$message.success("保存成功");
                  this.editFormVisible = false;
                  this.searchClick();
                } else {
                  this.$message.error("保存失败");
                }
              }.bind(this),
              function(error) {
                console.log(error);
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeDialog: function(val) {
      this.editForm = {
        zwfl: "",
        kkfl: "",
        flmj: "",
        fljg: "",
        fljgEng: ""
      };
      this.$refs[val].resetFields();
      this.selectUuid = "";
      this.editFormVisible = false;
    }
  }
};
</script>

<style>
</style>
