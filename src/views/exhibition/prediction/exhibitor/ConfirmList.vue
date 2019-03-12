<template>
  <div id="confirmList">
    <!-- 邮寄信息确认状态条 -->
    <el-row class="mt10 mb10">
      <el-button v-if="jbxxForm.qrzt!='Y'" type="danger" icon="el-icon-warning" class="w100" style="font-size: 20px">您尚未进行信息确认
        <i class="el-icon-warning"></i>
      </el-button>
      <el-button v-if="jbxxForm.qrzt=='Y'" type="success" icon="el-icon-warning" class="w100" style="font-size: 20px">您上次信息确认时间为
        <span v-text="jbxxForm.qrsj"></span>，如需修改可再次修改确认
        <i class="el-icon-warning"></i>
      </el-button>
    </el-row>
    <!-- 邮寄地址确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28">邮寄地址确认</strong>
          <el-button v-if="jbxxEditFlag" @click="editJbxxClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">修改</el-button>
          <div v-else class="r">
            <el-button @click="saveJbxxCancle('jbxxForm')" type="info" icon="el-icon-close" size="small">取消</el-button>
            <el-button @click="saveJbxxClick('jbxxForm')" type="success" icon="el-icon-check" size="small">保存</el-button>
        </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form ref="jbxxForm" :model="jbxxForm" label-position="right" label-width="160px" :rules="jbxxRules">
              <el-row>
                <el-form-item prop="zwgsmc" label="中文公司名称：">
                  <span v-text="jbxxForm.zwgsmc"></span>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="lxr" label="联系人：">
                  <span v-if="jbxxEditFlag" v-text="jbxxForm.lxr"></span>
                  <el-input v-else size="small" v-model="jbxxForm.lxr" placeholder="联系人"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="lxrsj" label="联系人手机：">
                  <span v-if="jbxxEditFlag" v-text="jbxxForm.lxrsj"></span>
                  <el-input v-else size="small" v-model="jbxxForm.lxrsj" placeholder="手机"></el-input>
                </el-form-item>
              </el-row>
              <el-row v-if="jbxxEditFlag">
                <el-form-item prop="xzqh" label="邮寄地址：">
                  <span v-text="jbxxForm.yjdzshengmc+jbxxForm.yjdzshimc+' '+jbxxForm.yjdzxx"></span>
                </el-form-item>
              </el-row>
              <el-row v-else>
                <el-col :span="8">
                  <el-form-item prop="xzqh" label="邮寄地址：">
                    <el-cascader v-model="jbxxForm.xzqh" :options="xzqhDataTree" :props="defaultProps" size="small" placeholder="省/市" class="searchSelect"
                        clearable show-all-levels></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item prop="yjdzxx" id="yjdzxx">
                    <el-input size="small" v-model="jbxxForm.yjdzxx" placeholder="详细地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <!-- 开票信息确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28">开票信息确认</strong>
          <el-button v-if="kpxxEditFlag" @click="editKpxxClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">修改</el-button>
          <div v-else class="r">
            <el-button @click="saveKpxxCancle('kpxxForm')" type="info" icon="el-icon-close" size="small">取消</el-button>
            <el-button @click="saveKpxxClick('kpxxForm')" type="success" icon="el-icon-check" size="small">保存</el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form ref="kpxxForm" :model="kpxxForm" label-position="right" label-width="160px" :rules="kpxxRules">
              <el-row>
                <el-form-item prop="kplx" label="开票类型：">
                  <span v-if="kpxxEditFlag" v-text="kpxxForm.kplxmc"></span>
                  <el-radio-group v-else v-model="kpxxForm.kplx" size="small" auto-complete="off" @change="fplxChange">
                    <el-radio class="radio" :label="'1'">增值税专用发票</el-radio>
                    <el-radio class="radio" :label="'2'">增值税普通发票</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="kpgsmc" label="开票公司名称：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.kpgsmc"></span>
                    <el-input v-else size="small" v-model="kpxxForm.kpgsmc" placeholder="开票公司名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="kpxxForm.kplx == '1'">
                  <el-form-item prop="dhhm" label="电话号码：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.dhhm"></span>
                    <el-input v-else size="small" v-model="kpxxForm.dhhm" maxlength="50" placeholder="电话号码"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="tyshxydm" label="统一社会信用代码：" :onkeyup="addBlankXydm()">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.tyshxydm"></span>
                    <el-input v-else size="small" v-model="kpxxForm.tyshxydm" placeholder="统一社会信用代码"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="kpxxForm.kplx == '1'">
                  <el-form-item prop="khyh" label="开户银行：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.khyh"></span>
                    <el-input v-else size="small" v-model="kpxxForm.khyh" placeholder="开户银行"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="gsdz" label="公司地址：" :rules="kpxxForm.kplx == '1'?kpxxRules.gsdz:[{ required: false, message: '请输入公司地址', trigger: 'blur' },{ min: 1, max: 150, message: '最多可输入150个字', trigger: 'blur' }]">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.gsdz"></span>
                    <el-input v-else size="small" v-model="kpxxForm.gsdz" placeholder="公司地址"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="kpxxForm.kplx == '1'">
                  <el-form-item prop="yhzh" label="银行账号：" :onkeyup="addBlankYhzh()">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.yhzh"></span>
                    <el-input v-else size="small" v-model="kpxxForm.yhzh" placeholder="银行账号"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 专用发票 -->
              <!-- <el-row v-if="kpxxForm.kplx == '1'">
                  <el-row>
                      <el-form-item prop="dhhm" label="电话号码：">
                          <span v-if="kpxxEditFlag" v-text="kpxxForm.dhhm"></span>
                          <el-input v-else size="small" v-model="kpxxForm.dhhm" maxlength="50" placeholder="电话号码"></el-input>
                      </el-form-item>
                  </el-row>
                  <el-row>
                      <el-form-item prop="khyh" label="开户银行：">
                          <span v-if="kpxxEditFlag" v-text="kpxxForm.khyh"></span>
                          <el-input v-else size="small" v-model="kpxxForm.khyh" placeholder="开户银行"></el-input>
                      </el-form-item>
                  </el-row>
                  <el-row>
                      <el-form-item prop="yhzh" label="银行账号：" :onkeyup="addBlankYhzh()">
                          <span v-if="kpxxEditFlag" v-text="kpxxForm.yhzh"></span>
                          <el-input v-else size="small" v-model="kpxxForm.yhzh" placeholder="银行账号"></el-input>
                      </el-form-item>
                  </el-row>
              </el-row> -->
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <!-- 公司简称确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28">公司简称确认</strong>
          <span style="color:red;">（如已选择标准展位，请填写公司简称，此简称只用于展位图上显示公司名称。）</span>
          <el-button v-if="gsjcEditFlag" @click="editGsjcClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">修改</el-button>
          <div v-else class="r">
            <el-button @click="saveGsjcCancle" type="info" icon="el-icon-close" size="small">取消</el-button>
            <el-button @click="saveGsjcClick" type="success" icon="el-icon-check" size="small">保存</el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form label-position="right" label-width="160px">
              <el-row>
                <el-form-item label="公司简称：">
                  <span v-if="gsjcEditFlag" v-text="jbxxForm.gsjc||'无'"></span>
                  <el-input v-else size="small" v-model="jbxxForm.gsjc" placeholder="公司简称" maxlength="6"></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <el-row class="tc mt20">
      <!-- <el-button @click="qrztCancle" type="info" icon="el-icon-close" size="small">取消</el-button> -->
      <el-button @click="qrztSubmit" type="success" icon="el-icon-check" size="small">全部确认</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'confirmList',
  data () {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      //显示加载中
      loading: false,          
      qyid: '',
      shztFlag: false,
      jbxxEditFlag: true,
      kpxxEditFlag: true,
      gsjcEditFlag: true,
      xzqhDataTree: [],
      //邮寄信息表单
      jbxxForm: {
        zwgsmc: '',
        yjdzsheng: '',
        yjdzshi: '',
        yjdzxx: '',
        lxr: '',
        lxrsj: '',
        qrzt: '',
        gsjc: ''
      },
      //开票信息表单
      kpxxForm: {
        kplx: '',
        kpgsmc: '',
        tyshxydm: '',
        gsdz: '',
        dhhm: '',
        khyh: '',
        yhzh: ''
      },
      gsjc: '',
      jbxxRules: {
        zwgsmc: [
          { required: true, message: '请输入中文公司名称', trigger: 'blur' },
          { min: 1, max: 100, message: '最多可输入100个字', trigger: 'blur' }
        ],
        xzqh: [
          { required: true, message: '请选择邮寄地址省市', trigger: 'change' }
        ],
        yjdzxx: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 100, message: '最多可输入100个字', trigger: 'blur' }
        ],
        lxr: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { min: 1, max: 25, message: '最多可输入25个字', trigger: 'blur' }
        ],
        lxrsj: [
          { required: true, message: '请输入联系人手机号码', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
          { min: 1, max: 30, message: '最多输入30个数字', trigger: 'blur' }
        ]
      },
      kpxxRules: {
        kplx: [
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ],
        kpgsmc: [
          { required: true, message: '请输入开票公司名称', trigger: 'blur' },
          { min: 1, max: 100, message: '最多可输入100个字', trigger: 'blur' }
        ],
        tyshxydm: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9 ]+$/, message: '只能输入数字和字母', trigger: 'blur' },
          { min: 22, max: 22, message: '请输入18位统一社会信用代码（不包含空格）', trigger: 'blur' }
        ],
        gsdz: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { min: 1, max: 150, message: '最多可输入150个字', trigger: 'blur' }
        ],
        dhhm: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
          { min: 1, max: 50, message: '最多输入50个数字', trigger: 'blur' }
        ],
        khyh: [
          { required: true, message: '请输入开户银行', trigger: 'blur' },
          { min: 1, max: 50, message: '最多可输入50个字', trigger: 'blur' }
        ],
        yhzh: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { pattern: /^[0-9 ]*$/, message: '只能输入数字', trigger: 'blur' },
          { min: 0, max: 37, message: '最多可输入30位银行账号', trigger: 'blur' }
        ]
      },
      //树结构配置
      defaultProps: {
        children: 'children',
        label: 'codeName',
        value: 'codeValue'
      },
    }
  },
  created: function () {
    this.findInfoByUserid(this.currentUser.userid, 'init');
  },
  mounted: function () {
    this.getXzqhDataTree();
  },
  methods: {
    //通过userid查询基本信息数据
    findInfoByUserid: function (userid, type) {
      let vm = this;
      vm.loading = true;
      var params = {
        userid: userid,
        deleteFlag: 'N'
      }
      vm.$axios.post('/qyjbxx/doFindByVo', params).then(function (res) {
        if (res.data.result != null && res.data.result != "") {
          if (res.data.result.sjzt == "05" && res.data.result.shzt == "03") {//数据状态-已审核，审核状态-已通过
            vm.jbxxForm = res.data.result;
            vm.gsjc = res.data.result.gsjc;
            vm.qyid = res.data.result.qyid;
            //行政区划级联下拉处理
            var xzqhArray = [];
            xzqhArray.push(res.data.result.yjdzsheng);
            xzqhArray.push(res.data.result.yjdzshi);
            vm.jbxxForm.xzqh = xzqhArray;
            if (type == 'init') {
              vm.findKpxxByQyid(this.qyid);
            } else {
              vm.loading = false;
            }
          } else {
            vm.shztFlag = true;
            vm.loading = false;
            vm.$alert('您尚未通过审核！', '提示', {
              confirmButtonText: '去查看',
              callback: action => {
                this.$router.push({name:"ExhpredictionEdit"});
              }
            });
          }
        } else {//未报名
          vm.shztFlag = true;
          vm.loading = false;
          vm.$alert('您尚未报名！', '提示', {
            confirmButtonText: '去报名',
            callback: action => {
              this.$router.push({name:"ExhpredictionEdit"});
            }
          });
        }
      }.bind(this), function (error) {
          console.log(error)
      })
    },
    //通过企业id查找开票信息
    findKpxxByQyid: function (qyid) {
      let vm = this;
      this.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: 'N'
      }
      vm.$axios.post('/qykpxx/list', params).then(function (res) {
        vm.kpxxForm = res.data.result[0];
        vm.loading = false;
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //行政区划级联选择数据
    getXzqhDataTree: function () {
      let vm = this;
      vm.$axios.post('/codelist/getYjdz').then(function (res) {
        vm.xzqhDataTree = res.data.result;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    addBlankYhzh: function () {
      if (this.kpxxForm.yhzh != undefined && this.kpxxForm.yhzh != '' && this.kpxxForm.yhzh != null) {
        this.kpxxForm.yhzh = this.kpxxForm.yhzh.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
      }
    },
    addBlankXydm: function () {
      if (this.kpxxForm.tyshxydm != undefined && this.kpxxForm.tyshxydm != '' && this.kpxxForm.tyshxydm != null) {
        this.kpxxForm.tyshxydm = this.kpxxForm.tyshxydm.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
      }
    },
    fplxChange: function (val) {
      if (val == "2") {//普通发票
        this.kpxxForm.dhhm = "";
        this.kpxxForm.khyh = "";
        this.kpxxForm.yhzh = "";
      }
    },
    editJbxxClick: function () {
      this.jbxxEditFlag = false;
    },
    saveJbxxClick: function (formName) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.loading = true;
          var params = {
            qyid: vm.jbxxForm.qyid,
            yjdzsheng: vm.jbxxForm.xzqh[0],
            yjdzshi: vm.jbxxForm.xzqh[1],
            yjdzxx: vm.jbxxForm.yjdzxx,
            lxr: vm.jbxxForm.lxr,
            lxrsj: vm.jbxxForm.lxrsj,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          }
          vm.$axios.post('/qyjbxx/doUpdateByVO', params).then(function (res) {
            if (res.data.result > 0) {
              vm.$message.success('邮寄信息修改成功');
            }
            vm.jbxxEditFlag = true;
            vm.findInfoByUserid(this.currentUser.userid, 'init');
            vm.loading = false;
          }.bind(this), function (error) {
            console.log(error);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveJbxxCancle: function (formName) {
      this.$refs[formName].resetFields();
      this.jbxxEditFlag = true;
      this.findInfoByUserid(this.currentUser.userid, 'cancle');
    },
    editKpxxClick: function () {
      this.kpxxEditFlag = false;
    },
    saveKpxxClick: function (formName) {
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          var yhzh_str = null;
          if (vm.kpxxForm.yhzh != null && vm.kpxxForm.yhzh != '' && vm.kpxxForm.yhzh != undefined) {
            yhzh_str = vm.kpxxForm.yhzh.replace(/ /g, "");
          } else {
            yhzh_str = '';
          }
          var params = {
            uuid: vm.kpxxForm.uuid,
            kplx: vm.kpxxForm.kplx,
            kpgsmc: vm.kpxxForm.kpgsmc,
            tyshxydm: vm.kpxxForm.tyshxydm.replace(/ /g, ""),
            gsdz: vm.kpxxForm.gsdz,
            dhhm: vm.kpxxForm.dhhm,
            khyh: vm.kpxxForm.khyh,
            yhzh: yhzh_str,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          }
          vm.$axios.post('/qykpxx/doUpdateByVO', params).then(function (res) {
            if (res.data.result > 0) {
              vm.$message.success('开票信息修改成功');
            }
            vm.kpxxEditFlag = true;
            vm.findKpxxByQyid(this.qyid);
            vm.loading = false;
          }.bind(this), function (error) {
            console.log(error);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveKpxxCancle: function (formName) {
      this.$refs[formName].resetFields();
      this.kpxxEditFlag = true;
      this.findKpxxByQyid(this.qyid);
    },
    editGsjcClick: function () {
      this.gsjcEditFlag = false;
    },
    saveGsjcClick: function () {
      let vm = this;
      vm.loading = true;
      var params = {
        qyid: vm.jbxxForm.qyid,
        gsjc: vm.jbxxForm.gsjc,
        xgrid: vm.currentUser.userid,
        xgrmc: vm.currentUser.username
      }
      vm.$axios.post('/qyjbxx/doUpdateByVO', params).then(function (res) {
        if (res.data.result > 0) {
          vm.$message.success('公司简称修改成功');
        }
        vm.gsjcEditFlag = true;
        vm.loading = false;
      }.bind(this), function (error) {
        console.log(error);
      })
    },
    saveGsjcCancle: function () {
      this.gsjcEditFlag = true;
      this.jbxxForm.gsjc = this.gsjc;
    },
    qrztSubmit: function () {
      let vm = this;
      if (vm.jbxxEditFlag && vm.kpxxEditFlag && vm.gsjcEditFlag) {
        var params = {
          qyid: vm.jbxxForm.qyid,
          qrzt: 'Y',
          qrsj: '1',
          xgrid: vm.currentUser.userid,
          xgrmc: vm.currentUser.username
        }
        vm.$axios.post('/qyjbxx/doUpdateByVO', params).then(function (res) {
          if (res.data.result > 0) {
            vm.$message.success('信息已确认！');
          }
          vm.findInfoByUserid(this.currentUser.userid, 'init');
          this.loading = false;
        }.bind(this), function (error) {
          console.log(error);
        })
      } else if (!this.jbxxEditFlag) {
        this.$message.warning('邮寄地址尚未保存！');
      } else if (!this.kpxxEditFlag) {
        this.$message.warning('开票信息尚未保存！');
      } else if (!this.gsjcEditFlag) {
        this.$message.warning('公司简称尚未保存！');
      }
    },
    qrztCancle: function () {

    }
  }
}
</script>

<style>

</style>
