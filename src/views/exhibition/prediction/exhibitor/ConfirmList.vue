<template>
  <div id="confirmList">
    <!-- 邮寄信息确认状态条 -->
    <el-row class="mt10 mb10">
      <el-button v-if="jbxxForm.qrzt!='Y'" type="danger" icon="el-icon-warning" class="w100" style="font-size: 20px">
        <span v-if="usertype=='ENG'">You have not yet confirmed the information.</span>
        <span v-else>您尚未进行信息确认</span>
        <i class="el-icon-warning"></i>
      </el-button>
      <el-button v-if="jbxxForm.qrzt=='Y'" type="success" icon="el-icon-warning" class="w100" style="font-size: 20px">
        <span v-if="usertype=='ENG'">The last time your information was confirmed was</span>
        <span v-else>您上次信息确认时间为</span>
        <span v-text="jbxxForm.qrsj"></span>
        <span v-if="usertype=='ENG'">,you can confirm again when you edit your information</span>
        <span v-else>，如需修改可再次修改确认</span>
        <i class="el-icon-warning"></i>
      </el-button>
    </el-row>
    <!-- 邮寄地址确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28"><span v-if="usertype=='ENG'">Confirm Post Address</span><span v-else>邮寄地址确认</span></strong>
          <el-button v-if="jbxxEditFlag" @click="editJbxxClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">
            <span v-if="usertype=='ENG'">Edit</span><span v-else>修改</span>
          </el-button>
          <div v-else class="r">
            <el-button @click="saveJbxxCancle('jbxxForm')" type="info" icon="el-icon-close" size="small">
              <span v-if="usertype=='ENG'">Cancle</span><span v-else>取消</span>
            </el-button>
            <el-button @click="saveJbxxClick('jbxxForm')" type="success" icon="el-icon-check" size="small">
              <span v-if="usertype=='ENG'">Save</span><span v-else>保存</span>
            </el-button>
        </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form ref="jbxxForm" :model="jbxxForm" label-position="right" :label-width="labelWidth" :rules="jbxxRules">
              <el-row v-if="usertype=='ENG'">
                <el-form-item prop="ywgsmc" label="Company Name：">
                  <span v-text="jbxxForm.ywgsmc"></span>
                </el-form-item>
              </el-row>
              <el-row v-else>
                <el-form-item prop="zwgsmc" label="中文公司名称：">
                  <span v-text="jbxxForm.zwgsmc"></span>
                </el-form-item> 
              </el-row>
              <el-row>
                <el-form-item prop="lxr" :label="jbxxFormLabel.lxr+'：'" class="is-required">
                  <span v-if="jbxxEditFlag" v-text="jbxxForm.lxr"></span>
                  <el-input v-else size="small" v-model="jbxxForm.lxr" :placeholder="jbxxFormLabel.lxr"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="lxrsj" :label="jbxxFormLabel.lxrsj+'：'">
                  <span v-if="jbxxEditFlag" v-text="jbxxForm.lxrsj"></span>
                  <el-input v-else size="small" v-model="jbxxForm.lxrsj" :placeholder="jbxxFormLabel.lxrsj"></el-input>
                </el-form-item>
              </el-row>
              <div v-if="usertype=='ENG'">
                <el-row>
                  <el-form-item prop="yjdzxx" label="Company Address：">
                    <span v-if="jbxxEditFlag" v-text="jbxxForm.yjdzxx"></span>
                    <el-input v-else size="small" v-model="jbxxForm.yjdzxx" placeholder="Company Address"></el-input>
                  </el-form-item>
                </el-row>
              </div>
              <div v-else>
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
              </div>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <!-- 开票信息确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28"><span v-if="usertype=='ENG'">Confirm Invoice Information</span><span v-else>开票信息确认</span></strong>
          <el-button v-if="kpxxEditFlag" @click="editKpxxClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">
            <span v-if="usertype=='ENG'">Edit</span><span v-else>修改</span>
          </el-button>
          <div v-else class="r">
            <el-button @click="saveKpxxCancle('kpxxForm')" type="info" icon="el-icon-close" size="small">
              <span v-if="usertype=='ENG'">Cancel</span><span v-else>取消</span>
            </el-button>
            <el-button @click="saveKpxxClick('kpxxForm')" type="success" icon="el-icon-check" size="small">
              <span v-if="usertype=='ENG'">Save</span><span v-else>保存</span>
            </el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form ref="kpxxForm" :model="kpxxForm" label-position="right" :label-width="labelWidth" :rules="kpxxRules">
              <div v-if="usertype=='ENG'">
                <el-row>
                  <el-form-item prop="kpgsmc" label="Company Name on the Invoice :">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.kpgsmc"></span>
                    <el-input v-else size="small" v-model="kpxxForm.kpgsmc" placeholder="Company Name on the Invoice"></el-input>
                  </el-form-item>
                </el-row>
                <!--公司地址字段存英文联系人-->
                <el-row>
                  <el-form-item prop="gsdz" label="Customer Contact：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.gsdz"></span>
                    <el-input v-else size="small" v-model="kpxxForm.gsdz" placeholder="Customer Contact"></el-input>
                  </el-form-item>
                </el-row>
                <!--电话号码字段存英文联系人电话-->
                <el-row>
                  <el-form-item prop="dhhm" label="Phone Number：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.dhhm"></span>
                    <el-input v-else size="small" v-model="kpxxForm.dhhm" maxlength="50" placeholder="Phone Number"></el-input>
                  </el-form-item>
                </el-row>
                <!--银行账号字段存英文传真-->
                <el-row>
                  <el-form-item prop="yhzh" label="Fax：">
                    <span v-if="kpxxEditFlag" v-text="kpxxForm.yhzh"></span>
                    <el-input v-else size="small" v-model="kpxxForm.yhzh" placeholder="Fax"></el-input>
                  </el-form-item>
                </el-row>
              </div>
              <div v-else>
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
              </div>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
    <!-- 公司简称确认 -->
    <el-row>
      <el-card class="card_style">
        <div slot="header" class="clearfix">
          <strong class="card_title_font lh28"><span v-if="usertype=='ENG'">Company Short Name</span><span v-else>公司简称确认</span></strong>
          <span v-if="usertype=='ENG'" style="color:red;">(This short name only be used to display on the booth map.)</span>
          <span v-else style="color:red;">（如已选择标准展位，请填写公司简称，此简称只用于展位图上显示公司名称。）</span>
          <el-button v-if="gsjcEditFlag" @click="editGsjcClick" :disabled="shztFlag" class="r" type="primary" icon="el-icon-edit" size="small">
            <span v-if="usertype=='ENG'">Edit</span><span v-else>修改</span>
          </el-button>
          <div v-else class="r">
            <el-button @click="saveGsjcCancle" type="info" icon="el-icon-close" size="small">
              <span v-if="usertype=='ENG'">Cancle</span><span v-else>取消</span>
            </el-button>
            <el-button @click="saveGsjcClick" type="success" icon="el-icon-check" size="small">
              <span v-if="usertype=='ENG'">Save</span><span v-else>保存</span>
            </el-button>
          </div>
        </div>
        <el-row>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="21">
            <el-form label-position="right" :label-width="labelWidth">
              <el-row v-if="usertype=='ENG'">
                <el-form-item label="Company Short Name：">
                  <span v-if="gsjcEditFlag" v-text="jbxxForm.gsjc||'no'"></span>
                  <el-input v-else size="small" v-model="jbxxForm.gsjc" placeholder="Company Short Name" maxlength="12"></el-input>
                </el-form-item>
              </el-row>
              <el-row v-else>
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
      <el-button @click="qrztSubmit" type="success" icon="el-icon-check" size="small">
        <span v-if="usertype=='ENG'">All Confirm</span><span v-else>全部确认</span></el-button>
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
      //用户类型
      usertype: 'CHN',
      //form中lable宽度
      labelWidth: '160px',
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
      jbxxFormLabel: {
        lxr: '联系人',
        lxrsj: '联系人手机'
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
        ywgsmc: [
          { required: true, message: 'Company name is required', trigger: 'blur' },
          { pattern: /^[a-z\d\.\,\|\- ]+$/i, message: 'Characters and number and blank and ,.-| only', trigger: 'blur' },
          { min: 1, max: 200, message: 'Less than 200 characters', trigger: 'blur' }
        ],
        xzqh: [
          { required: true, message: '请选择邮寄地址省市', trigger: 'change' }
        ],
        yjdzxx: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? 'Company name is required.' : "请输入详细地址"));
            } else {
              if (this.usertype == 'ENG') {
                if (/^[a-z\d\.\,\|\- ]+$/i.test(value) == false) {
                  callback(new Error('Characters and number and blank and ,.-| only.'));
                } else if (value.length > 200) {
                  callback(new Error('Less than 200 characters.'));
                } else {
                  callback();
                }
              } else if (this.usertype == 'CHN') {
                if (value.length > 100) {
                  callback(new Error('最多可输入100个字'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }, trigger: 'blur' }
        ],
        lxr: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? 'Contact Person is required.' : "请输入联系人"));
            } else {
              if (this.usertype == 'ENG') {
                if (/^[a-z\d\.\,\|\- ]+$/i.test(value) == false) {
                  callback(new Error('Characters and number and blank and ,.-| only.'));
                } else if (value.length > 50) {
                  callback(new Error('Less than 50 characters.'));
                } else {
                  callback();
                }
              } else if (this.usertype == 'CHN') {
                if (value.length > 25) {
                  callback(new Error('最多可输入25个字'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }, trigger: 'blur' }
        ],
        lxrsj: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? "Contact Person's Phone is required." : "请输入联系人手机号码"));
            } else if (/^[\d\-]+$/.test(value) == false) {
              callback(new Error(this.usertype=='ENG' ? 'Number and hyphen only.' : "只能输入数字"));
            } else if (value.length > 30){
              callback(new Error(this.usertype=='ENG' ? 'Less than 30 characters.' : "最多输入30个数字"));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ]
      },
      kpxxRules: {
        kplx: [
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ],
        kpgsmc: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? 'Company Name on the Invoice is required.' : "请输入开票公司名称"));
            } else {
              if (this.usertype == 'ENG') {
                if (/^[A-Za-z0-9 ]+$/.test(value) == false) {
                  callback(new Error('Characters and number and blank only.'));
                } else if (value.length > 200) {
                  callback(new Error('Less than 200 characters.'));
                } else {
                  callback();
                }
              } else if (this.usertype == 'CHN') {
                if (value.length > 100) {
                  callback(new Error('最多可输入100个字'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }, trigger: 'blur' }
        ],
        tyshxydm: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9 ]+$/, message: '只能输入数字和字母', trigger: 'blur' },
          { min: 22, max: 22, message: '请输入18位统一社会信用代码（不包含空格）', trigger: 'blur' }
        ],
        gsdz: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? 'Customer Contact is required.' : "请输入公司地址"));
            } else {
              if (this.usertype == 'ENG') {
                if (/^[A-Za-z0-9 ]+$/.test(value) == false) {
                  callback(new Error('Characters and number and blank only.'));
                } else if (value.length > 300) {
                  callback(new Error('Less than 300 characters.'));
                } else {
                  callback();
                }
              } else if (this.usertype == 'CHN') {
                if (value.length > 150) {
                  callback(new Error('最多可输入150个字'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            }
          }, trigger: 'blur' }
        ],
        dhhm: [
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? "Phone Number is required." : "请输入电话号码"));
            } 
            /**
            else if (/^[\d\-]+$/.test(value) == false) {
              callback(new Error(this.usertype=='ENG' ? 'Number and hyphen only.' : "只能输入数字"));
            } */
            else if (value.length > 30){
              callback(new Error(this.usertype=='ENG' ? 'Less than 30 characters.' : "最多输入30个数字"));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ],
        khyh: [
          { required: true, message: '请输入开户银行', trigger: 'blur' },
          { min: 1, max: 50, message: '最多可输入50个字', trigger: 'blur' }
        ],
        yhzh: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { pattern: /^[0-9 ]*$/, message: '只能输入数字', trigger: 'blur' },
          { min: 0, max: 37, message: '最多可输入30位银行账号', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value == null || value == '') {
              callback(new Error(this.usertype=='ENG' ? "Fax is required." : "请输入银行账号"));
            } else if (/^[0-9 ]*$/.test(value) == false) {
              callback(new Error(this.usertype=='ENG' ? 'Number and blank only.' : "只能输入数字"));
            } else if (value.length > 30){
              callback(new Error(this.usertype=='ENG' ? 'Less than 30 characters.' : "最多可输入30位银行账号"));
            } else {
              callback();
            }
          }, trigger: 'blur' }
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
    let vm = this;
    if(vm.currentUser != null){
      vm.usertype = vm.currentUser.usertype;
      if(this.usertype == 'ENG') {
        this.labelWidth = '260px';
        this.jbxxFormLabel = {
          lxr: 'Contact Person',
          lxrsj: "Contact Person's Phone"
        }
      }
      vm.findInfoByUserid(vm.currentUser.userid, 'init');
    }
  },
  mounted: function () {
    if (this.usertype != 'ENG') {
      this.getXzqhDataTree();
    }
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
            if (vm.usertype == 'ENG') {
              vm.$alert('You have not passed the audit yet!', 'reminder', {
                confirmButtonText: 'check out',
                callback: action => {
                  this.$router.push({name:"exhibitorWebEN"});
                }
              });
            } else {
              vm.$alert('您尚未通过审核！', '提示', {
                confirmButtonText: '去查看',
                callback: action => {
                  this.$router.push({name:"exhibitorWeb"});
                }
              });
            }
          }
        } else {//未报名
          vm.shztFlag = true;
          vm.loading = false;
          if (vm.usertype == 'ENG') {
            vm.$alert('You haven’t signed up yet!', 'reminder', {
              confirmButtonText: 'sign up',
              callback: action => {
                this.$router.push({name:"exhibitorWebEN"});
              }
            });
          } else {
            vm.$alert('您尚未报名！', '提示', {
              confirmButtonText: '去报名',
              callback: action => {
                this.$router.push({name:"exhibitorWeb"});
              }
            });
          }
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
      // debugger
      let vm = this;
      vm.$refs[formName].validate((valid) => {
        debugger
        if (valid) {
          vm.loading = true;
          var params = {
            qyid: vm.jbxxForm.qyid,
            yjdzxx: vm.jbxxForm.yjdzxx,
            lxr: vm.jbxxForm.lxr,
            lxrsj: vm.jbxxForm.lxrsj,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          }
          if (vm.usertype != 'ENG') {
            params.yjdzsheng = vm.jbxxForm.xzqh[0];
            params.yjdzshi = vm.jbxxForm.xzqh[1];
          }
          vm.$axios.post('/qyjbxx/doUpdateByVO', params).then(function (res) {
            if (res.data.result > 0) {
              if (vm.usertype == 'ENG') {
                vm.$message.success('Post Information has been saved.');
              } else {
                vm.$message.success('邮寄信息修改成功');
              }
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
            kpgsmc: vm.kpxxForm.kpgsmc,
            gsdz: vm.kpxxForm.gsdz,
            dhhm: vm.kpxxForm.dhhm,
            yhzh: yhzh_str,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          } 
          if (vm.usertype != 'ENG') {
            params.kplx = vm.kpxxForm.kplx;
            params.tyshxydm = vm.kpxxForm.tyshxydm.replace(/ /g, "");
            params.khyh = vm.kpxxForm.khyh;
          }
          vm.$axios.post('/qykpxx/doUpdateByVO', params).then(function (res) {
            if (res.data.result > 0) {
              if (vm.usertype == 'ENG') {
                vm.$message.success('Invoice Information has been saved.');
              } else {
                vm.$message.success('开票信息修改成功');
              }
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
          if (vm.usertype == 'ENG') {
            vm.$message.success('Company short name has been saved.');
          } else {
            vm.$message.success('公司简称修改成功');
          }
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
            if (vm.usertype == 'ENG') {
              vm.$message.success('Information has been comfirmed.');
            } else {
              vm.$message.success('信息已确认');
            }
          }
          vm.findInfoByUserid(this.currentUser.userid, 'init');
          this.loading = false;
        }.bind(this), function (error) {
          console.log(error);
        })
      } else if (!this.jbxxEditFlag) {
        if (vm.usertype == 'ENG') {
            vm.$message.success('Post Information has not been saved.');
          } else {
            vm.$message.success('邮寄地址尚未保存');
          }
      } else if (!this.kpxxEditFlag) {
        if (vm.usertype == 'ENG') {
            vm.$message.success('Invoice Information has not been saved.');
          } else {
            vm.$message.success('开票信息尚未保存');
          }
      } else if (!this.gsjcEditFlag) {
        if (vm.usertype == 'ENG') {
            vm.$message.success('Information has been comfirmed.');
          } else {
            vm.$message.success('Company short name has not been saved');
          }
      }
    },
    qrztCancle: function () {

    }
  }
}
</script>

<style>
#yjdzxx .el-form-item__content {
  margin-left: 10px !important;
}
</style>
