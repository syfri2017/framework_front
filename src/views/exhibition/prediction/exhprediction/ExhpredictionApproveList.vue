<template>
  <div id="exhpredictionApproveList">
    <el-row>
      <el-form label-width="75px" :inline="true" class="el-form demo-form-inline">
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="9" class="searchInline">
            <label class="el-form-item__label searchLabel">公司名称</label>
            <el-input size="small" v-model="searchForm.gsmc" placeholder="公司名称" clearable></el-input>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="9" class="searchInline">
            <label class="el-form-item__label searchLabel">审核状态</label>
            <el-select size="small" v-model="searchForm.shzt" placeholder="全部" class="searchSelect" clearable>
              <el-option v-for="item in shztData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div>
          <el-form>
            <el-col :span="12" class="btnEditDelete">
              <el-form-item align="left"></el-form-item>
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
      <el-table id="table" border class="tableStyle" :height="tableheight" :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @row-click="showRow" :row-style="rowStyle">
        <el-table-column type="index" label="序号" show-overflow-tooltip width="65" align="center"></el-table-column>
        <el-table-column prop="zwgsmc" label="公司名称" show-overflow-tooltip min-width="25%" align="center">
          <template slot-scope="scope">
            <a v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc" @click="qyDetails(scope.row)"></a>
            <a v-else v-text="scope.row.zwgsmc" @click="qyDetails(scope.row)"></a>
          </template>
        </el-table-column>
        <el-table-column prop="tyshxydm" label="统一社会信用代码" show-overflow-tooltip min-width="20%" align="center" :formatter="tableLongNumFormat"></el-table-column>
        <!-- <el-table-column label="营业执照" show-overflow-tooltip min-width="15%" align="center">
            <template slot-scope="scope">
                <el-button v-if="scope.row.usertype == 'CHN'" type="text" @click="imgPreview(scope.row)">预览</el-button>
                <span v-if="scope.row.usertype == 'ENG'"></span>
            </template>
        </el-table-column> -->
        <el-table-column prop="wz" label="公司网址" show-overflow-tooltip min-width="20%" align="center">
          <template slot-scope="scope">
            <!-- <a type="text" v-text="scope.row.wz" :href="'http://'+scope.row.wz" target="_blank"></a> -->
            <a type="text" v-text="scope.row.wz" :href="getWz(scope.row.wz)" target="_blank"></a> 
          </template>
        </el-table-column>
        <el-table-column prop="shztmc" label="审核状态" show-overflow-tooltip min-width="10%" align="center">
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
      </el-table>
      <!--翻页组件-->
      <el-row type="flex" justify="end">
        <paginator></paginator>
      </el-row>
    </div>
    
    <!--图片预览-->
    <!--
    <el-dialog id="previewImgDialog" :visible.sync="imgViewVisible" :close-on-click-modal="false" size="tiny">
      <img v-if="previewImg!==''" :src="'data:image/png;base64,'+previewImg" width="100%">
      <img v-else src="../../static/images/noPic.png" width="100%">
    </el-dialog>
    -->

    <!--审批界面-->
    <!--
    <el-dialog title="展会报名审核" :visible.sync="approveFormVisible" :close-on-click-modal="false">
      <el-row>
        <el-col :span="8" class="tc">
          <img v-if="approveForm.yyzzBase64!==''" :src="'data:image/png;base64,'+approveForm.yyzzBase64" style="max-height:200px;width: 150px;">
          <img v-else src="../../static/images/noPic.png" style="width:150px;">
          <br>营业执照
        </el-col>
        <el-col :span="16">
          <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
            <strong style="color: #463132;">审核信息</strong>
          </el-row>
          <el-row class="mb10 ml15">
            <strong class="dtdlStyle">公司名称：</strong>
            <v-text v-text="approveForm.zwgsmc||'无'"></v-text>
          </el-row>
          <el-row class="mb10 ml15">
            <strong class="dtdlStyle">统一社会信用代码：</strong>
            <v-text v-text="approveForm.tyshxydm||'无'"></v-text>
          </el-row>
          <el-row class="mb10 ml15">
            <strong class="dtdlStyle">法人代表：</strong>
            <v-text v-text="approveForm.frdb||'无'"></v-text>
          </el-row>
          <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
            <strong style="color: #463132;">审核结果</strong>
          </el-row>
          <el-form :model="approveForm" label-width="100px" ref="approveForm">
            <el-row>
              <el-col :span="23">
                <el-form-item label="审核状态" prop="shzt">
                  <el-radio-group class="yash_radio" v-model="approveForm.shzt" auto-complete="off" @change="radioChange">
                    <el-radio :label="'01'" disabled>未审核</el-radio>
                    <el-radio :label="'02'">未通过</el-radio>
                    <el-radio :label="'03'">已通过</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="23">
                <el-form-item label="审核意见" prop="reserve1">
                  <el-input type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="approveForm.reserve1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <v-text v-show="isReject" style="color: red">&nbsp;
                  <strong>*</strong>
                </v-text>
              </el-col>
            </el-row>
            <el-row class="mt10 mb20">
              <el-form :inline="true" class="el-form demo-form-inline">
                <el-row>
                  <el-col :xs="23" :sm="23" :md="23" :lg="23" :xl="23" class="editform-button">
                    <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click.native="closeDialog(approveForm)">取消</el-button>
                    <el-button type="success" icon="el-icon-check" size="small" class="btn_submit" @click.native="approveSubmit(approveForm)">审核</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    -->
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
        shzt: '01'
      },
      //审批表单
      approveForm: {
          shzt: -1,
          reserve1: ""
      },
      tableData: [],
      //table高度
      tableheight: this.CONSTANT.tableheight10,
      shztData: [],//审核状态下拉框
      selectIndex: '',
      isReject: false,//未通过flag
      previewTitle: '',
      previewImg: '',
      imgViewVisible: false,
      approveFormVisible: false,
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0
    }
  },
  created: function() {
    //审核状态下拉框
    this.getShztData();
    //条件查询
    this.searchClick('click');
  },
  methods: {
    openNewWeb: function(url) {
      var a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("target", "testNewWindow");
      document.body.appendChild(a);
      a.click();
    },
    //审核状态下拉框
    getShztData: function () {
      let vm = this;
      vm.$axios.get('/codelist/getCodetype/SHZT').then(function (res) {
        vm.shztData = res.data.result;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    //表格查询事件
    searchClick: function (type) {
      let vm = this;
      this.tableData = [];
      if (type != 'page') {
        this.currentPage = 1;
      }
      this.loading = true;//表格重新加载
      var params = {
        gsmc: this.searchForm.gsmc.replace(/%/g, "\\%"),
        shzt: this.searchForm.shzt,
        approveflag: 'y',
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      }
      vm.$axios.post('/qyjbxx/page', params).then(function (res) {
        var tableTemp = new Array((vm.currentPage - 1) * vm.pageSize);
        vm.tableData = tableTemp.concat(res.data.result.list);
        vm.total = res.data.result.total;
        vm.loading = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },
    //清空查询条件
    clearClick: function () {
      this.searchForm.gsmc = '';
      this.searchForm.yjdz = '';
      this.searchForm.shzt = '01';
      this.searchClick('reset');
    },
    //企业详情跳转
    qyDetails: function (val) {
      this.$router.push({name:"exhpredictionApproveDetail", query: {id: val.qyid, type: 'search'}});
    },
    //打开企业网址
    openWebsite: function(val) {
      window.open(val, '_blank');
    },
    //营业执照预览
    imgPreview: function (val) {
      let vm = this;
      vm.previewTitle = val.zwgsmc;
      vm.$axios.get('/qyjbxx/doFindJbxxById/' + val.qyid).then(function (res) {
        vm.previewImg = res.data.result.yyzzBase64;
      }.bind(this), function (error) {
        console.log(error)
      })
      vm.imgViewVisible = true;
    },
    //审核操作列点击
    approveClick: function (val) {
      this.$router.push({name:"exhpredictionSubmit", query: {id: val.qyid}});
    },

    //审核提交事件
    approveSubmit: function (val) {
      if (val.shzt == '01') {
        this.$message({
          message: "请选择审核状态",
          type: "error",
          showClose: true
        });
      } else if (this.isReject == true && val.reserve1 == null) {
        this.$message({
          message: "请填写审核意见",
          type: "error",
          showClose: true
        });
      } else {
        //审核状态改变才调用后台approveByVO方法
        if (val.shzt == this.tableData[this.selectIndex].shzt && val.reserve1 == this.tableData[this.selectIndex].reserve1) {
          this.$message({
            message: "审核状态及审核意见未改变",
            type: "error",
            showClose: true
          });
        } else {
          if (val.shzt == '02') {//未通过
            val.sjzt = '04';
          } else if (val.shzt == '03') {//已通过
            val.sjzt = '05';
          }
          var params = {
              qyid: val.qyid,
              shzt: val.shzt,
              sjzt: val.sjzt,
              reserve1: val.reserve1,//审核意见
              shrid: this.shiroData.userid,
              shrmc: this.shiroData.realName,
              shsj: '1'
          };
          let vm = this;
          vm.$axios.post('/qyjbxx/updateByVO', params).then(function (res) {
            if (res.data.result == 1) {
              this.tableData[this.selectIndex].shzt = val.shzt;
              if (this.tableData[this.selectIndex].shzt == '01') {
                this.tableData[this.selectIndex].shztmc = '待审核';
              } else if (this.tableData[this.selectIndex].shzt == '02') {
                this.tableData[this.selectIndex].shztmc = '未通过';
              } else if (this.tableData[this.selectIndex].shzt == '03') {
                this.tableData[this.selectIndex].shztmc = '已通过';
              }
            }
          }.bind(this), function (error) {
              console.log(error)
          })
          this.approveFormVisible = false;
        }
      }
    },
    //审核状态为未通过时审核意见显示*代表必填
    radioChange: function () {
      if (this.approveForm.shzt == '02')
        this.isReject = true;
      else
        this.isReject = false;
    },

    //关闭Dialog
    closeDialog: function (val) {
      val.shzt = '';
      this.approveFormVisible = false;
    },

    //获取选中的行号（从0开始）
    showRow: function (row) {
      this.selectIndex = this.tableData.indexOf(row);
    },

    //获取跳转网站
    getWz: function (val) {
      if (val == '' || val == null) {
        return '';
      } else {
        if (val.indexOf('http') > -1) {
          return val;
        } else {
          return 'http://' + val;
        }
      }
    }
  }
}
</script>

<style>

</style>
