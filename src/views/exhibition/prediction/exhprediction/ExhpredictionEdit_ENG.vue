<template>
  <div id="ExhpredictionEdit_ENG">
    <div class="main-container" v-loading="this.loading" element-loading-text="loading">
      <!--步骤条-->
      <div id="steps">
        <el-steps :active="this.active" align-center finish-status="success" style="margin-top:10px;">
          <el-step title="Brief Information"></el-step>
          <el-step title="Invoice"></el-step>
          <el-step title="Product Category"></el-step>
          <el-step title="Company and Product Details"></el-step>
          <el-step title="Questionnaire"></el-step>
          <el-step title="confirmation and Submission"></el-step>
        </el-steps>
      </div>
      <!--审核状态-->
      <div id="remark" v-if="isYbh">
        <el-row>
          <el-col :span="1" style="text-align: center">
            <i class="icon-alarm"></i>&nbsp;</el-col>
          <el-col :span="6" style="text-align: left">Last Approval Status:&nbsp;&nbsp;Reject</el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="16" style="text-align: left">Reason:&nbsp;&nbsp;
            <span v-text="baseInforForm.reserve1"></span>
          </el-col>
        </el-row>
      </div>
      <!--基本信息-->
      <div id="inforView" class="pt15" v-show="isJbxxShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <strong style="color: #463132;">Brief Company Information</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="baseInforForm" :model="baseInforForm" label-width="230px" label-position="right" :rules="baseInforRules">
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="ywgsmc" label="Company Name">
                <el-input size="small" v-model="baseInforForm.ywgsmc" placeholder="Company Name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="yjdzxx" label="Company Address">
                <el-input size="small" v-model="baseInforForm.yjdzxx" placeholder="Company Address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="reserve2" label="Postal Code">
                <el-input size="small" v-model="baseInforForm.reserve2" placeholder="Postal Code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="bgdh" label="Phone">
                <el-input size="small" v-model="baseInforForm.bgdh" maxlength="50" placeholder="Phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="frdb" label="Legal Representative">
                <el-input size="small" v-model="baseInforForm.frdb" placeholder="Legal Representative"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="cz" label="Fax">
                <el-input size="small" v-model="baseInforForm.cz" placeholder="Fax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="frdbdh" label="Legal Representative's Phone">
                <el-input size="small" v-model="baseInforForm.frdbdh" placeholder="Legal Representative's Phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="lxr" label="Contact Person">
                <el-input size="small" v-model="baseInforForm.lxr" placeholder="Contact Person"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>

          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="lxrsj" label="Contact Person's Phone">
                <el-input size="small" v-model="baseInforForm.lxrsj" placeholder="Contact Person's Phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="email" label="Email">
                <el-input disabled size="small" v-model="baseInforForm.email" placeholder="Email">
                  <el-button id="email-btn" slot="append" @click="openEmail" v-text=emailCodeText1 :disabled=emailBtnDisable></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="wz" label="Company Website" :rules="noWebsit?baseInforRules.wz:[{ required: true, message: 'Company Website is required', trigger: 'blur' }]">
                <el-input size="small" v-model="baseInforForm.wz" placeholder="Company Website" :disabled=noWebsit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-checkbox id="tagCheckbox" v-model="noWebsit" style="margin-left: 10px;line-height: 40px;font-size: 14px;position: relative;">No Company Website</el-checkbox>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="dzyx1" label="Standby Email">
                <el-input size="small" v-model="baseInforForm.dzyx1" placeholder="For Password Retrieve" @change="dzyxChange()">
                  <el-button id="mail-btn" slot="append" @click="openYxYz" v-text=mailCodeText :disabled=mailBtnDisable></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="success" size="small" class="btn_submit" @click="submitJbxx('baseInforForm')">
                Next&nbsp;
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--企业开票信息-->
      <div id="kpxxView" class="pt15" v-show="isKpxxShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">Invoice Information</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="kpxxForm" :model="kpxxForm" label-position="right" label-width="250px" :rules="kpxxRules">
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="kpgsmc" label="Company Name on the Invoice">
                <el-input size="small" v-model="kpxxForm.kpgsmc" placeholder="Company Name on the Invoice"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="11">
              <!--公司地址字段存英文联系人-->
              <el-form-item prop="gsdz" label="Customer Contact">
                <el-input size="small" v-model="kpxxForm.gsdz" placeholder="Customer Contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="11">
              <!--电话号码字段存英文联系人电话-->
              <el-form-item prop="dhhm" label="Phone Number">
                <el-input size="small" v-model="kpxxForm.dhhm" placeholder="Phone Number"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="11">
              <!--银行账号字段存英文传真-->
              <el-form-item prop="yhzh" label="Fax">
                <el-input size="small" v-model="kpxxForm.yhzh" placeholder="Fax"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelKpxx('kpxxForm')">Back</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitKpxx('kpxxForm')">Next&nbsp;
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--企业问卷调查-->
      <div id="wjdcView" class="pt15" v-show="isWjdcShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">Major Product Information</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="wjdcForm" :model="wjdcForm" label-position="right" label-width="230px" :rules="wjdcRules">
          <el-row class="tr mb5">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22" style="text-align:left">

              <el-form-item label="Category of Your Major Products" prop="zycpList" id="cplx_btn_group">
                <el-button v-for="item in cpssfl_data" plain size="small" :key="item.codeValue" @click="selectCpfl(item.codeValue)">
                  <span v-text="item.codeName"></span>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row id="childrenRow" class="tr mb5" style="text-align:left">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22" style="text-align: left;">
              <el-row id="tagRow" class="tr mb5">
                <el-col :span="19" style="text-align: left;margin-left: 200px;">
                  <el-checkbox-group v-model="wjdcForm.zycpList" id="cplx_chb_group">
                    <el-checkbox v-for="item in childrenCpfl" :label="item.codeValue+item.codeName" :key="item.codeValue+item.codeName">{{item.codeName}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
              <el-row id="tagRow" class="tr mb5">
                <el-col :span="19" style="text-align: left;margin-left: 200px;">
                  <el-tag v-for="tag in wjdcForm.zycpList" :key="tag" closable @close="handleTagClose(tag)" style="margin: 3px">
                    {{tag.substr(4)}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24" class="editform-button">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelWjdc('wjdcForm')">Back</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitWjdc('wjdcForm')">Next&nbsp;
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--企业和产品介绍-->
      <div id="cpjsView" class="pt15" v-show="isCpjsShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">Company Information Details</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="qyjsForm" :model="qyjsForm" label-position="right" label-width="220px" :rules="qyjsRules">
          <el-row class="tr mb5">
            <el-col :span="9">
              <el-form-item label="Company Logo" style="text-align: left" class="is-required">
                <el-upload class="avatar-uploader" ref="uploadLogo" :headers="myHeaders" action="http://localhost:8809/qyjs/upload" :data="upLoadLogoData" :on-success="logoPicSuccess" :before-upload="LogoChange" :show-file-list="false">
                  <img v-if="qyjsForm.src!=='' && qyjsForm.src!==null" :src="qyjsForm.imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="el-upload__tip" slot="tip">jpg/png,less than 1MB</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="1">&nbsp;</el-col> -->
            <el-col :span="14" style="margin-left: -7%" id="qycpArea">
              <el-form-item prop="qyjj" style="text-align: left" label="Company Introduction">
                <el-input type="textarea" :rows="5" placeholder="Company Introduction" v-model="qyjsForm.qyjj" maxlength="400" :onkeyup="checkWord(qyjsForm.qyjj,'qyjsLength','400')"></el-input>
              </el-form-item>
              <el-row>
                <div class="el-upload__tip">less than
                  <span style="color: red" id="qyjsLength">{{400-qyjsForm.qyjj.length}}</span> characters</div>
              </el-row>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
            <el-col :span="12">
              <strong style="color: #463132;">Product Examples(at least 1,at most 6)</strong>
            </el-col>
            <el-col :span="12" class="pb1">
              <el-button type="primary" icon="el-icon-plus" size="small" class="r" @click="addDomain">Add Product</el-button>
            </el-col>
          </el-row>
          <el-row class="mt15 mb20" style="overflow-x: hidden">
            <el-card class="card_style" id="cp_card" v-for="(domain, index) in qyjsForm.qycpjsVOList" :key="index">
              <div slot="header" class="clearfix">
                <strong class="card_title_font">Product NO.{{index+1}}</strong>
                <el-button type="danger" icon="el-icon-minus" size="small" @click.prevent="removeDomain(domain)" class="r" style="margin: 4px -15px 0px 0px">Del Product</el-button>
              </div>
              <el-row class="tr">
                <el-col :span="10">
                  <el-form-item label="Product Photo" style="text-align: left" class="is-required">
                    <el-upload class="avatar-uploader" ref="uploadCpPics" :headers="myHeaders" action="http://localhost:8809/qycpjs/upload" :on-success="cpjsPicSuccess" :before-upload="CpPicsChange" :show-file-list="false" :data="CpjsUpLoadData">
                      <img @click="getIndex(index,domain.src)" v-if="domain.src!=='' && domain.src!==null" :src="domain.imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" @click="getIndex(index)"></i>
                      <div class="el-upload__tip" slot="tip">jpg/png,less than 2MB</div>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="14" style="margin-left: -10%">
                  <el-row>
                    <el-form-item label="Category of the Product" class="is-required" :prop="'qycpjsVOList.' + index + '.cplx'" :rules="qyjsRules.cplx">
                      <el-cascader :options="cpssfl_data" :props="defaultProps" size="small" v-model="domain.cplx" placeholder="Category of the Product" class="searchSelect" clearable :show-all-levels="false"></el-cascader>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <div class="el-upload__tip"></div>
                  </el-row>
                  <el-row id="cpjsArea">
                    <el-form-item label="Product Introduction" :prop="'qycpjsVOList.' + index + '.cpjj'" :rules="qyjsRules.cpjj">
                      <el-input type="textarea" :rows="2" placeholder="Product Introduction" v-model="domain.cpjj" maxlength="300" :onkeyup="checkWord(domain.cpjj,index+100,'300')"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <div class="el-upload__tip">less than
                      <span style="color: red" :id="index+100">{{300-domain.cpjj.length}}</span> characters</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-form>
        <el-row class="buttonSubmit">
          <el-col :span="24">
            <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelCpjs('qyjsForm')">Back</el-button>
            <el-button type="success" size="small" class="btn_submit" @click="submitCpjs('qyjsForm')">Next&nbsp;
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--企业参展展位需求意向-->
      <div id="xqyxView" class="pt15" v-show="isXqyxShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">Questionnaire on your Booth Requirement</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="xqyxForm" :model="xqyxForm" label-width="230px" label-position="right">
          <el-row class="tr mb5">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <span class="mr5 vbm yxLabel">Standard Booth(12m² Each)</span>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-input-number size="small" v-model="xqyxForm.bzzwgs" :min="0" :max="6" :precision="0" placeholder="Standard Booth"></el-input-number>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;Booth(s)</span>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <span class="mr5 vbm yxLabel">Indoor Raw Space Booth(Minimum 24m²)</span>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-input-number size="small" v-model="xqyxForm.sngdzw" :min="24" :max="1000" :precision="0" placeholder="Indoor Raw Space Booth"></el-input-number>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;m²</span>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <span class="mr5 vbm yxLabel">Outdoor Raw Space Booth(Only Available to
                <span style="color: red">Elevating Fire Trucks</span>)</span>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-input-number size="small" v-model="xqyxForm.swgdzw" :min="0" :max="2000" :precision="0" placeholder="Outdoor Raw Space Booth"></el-input-number>
            </el-col>
            <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;m²</span>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelXqyx()">Back</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitXqyx()">Next&nbsp;
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--邮箱验证dialog-->
      <el-dialog title="Standby Email Verify" :visible.sync="dialogYxFormVisible" @close="closeYxDialog()" :close-on-click-modal="false">
        <el-form class="el-form demo-form-inline" ref="yxform" :model="yxform" label-width="150px" label-position="right">
          <el-row class="tr mb5" style="text-align: left;margin-left: 10px">
            Please enter the verification code received by
            <span v-text="this.baseInforForm.dzyx1" style="font-style:italic;margin-right: 2px;color: red"></span>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="yzm" label="Verification Code">
                <el-input size="small" v-model="yxform.yzm" placeholder="Verification Code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click.native="closeYxDialog()">Cancel</el-button>
          <el-button size="small" type="primary" @click.native="yxformSubmit()">Submit</el-button>
        </div>
      </el-dialog>
      <!--email验证dialog-->
      <el-dialog title="Change Email" :visible.sync="dialogEmailFormVisible" @close="closeEmailDialog()" :close-on-click-modal="false">
        <el-form class="el-form demo-form-inline" ref="emailform" :model="emailform" :rules="emailRules" label-width="150px" label-position="right">
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="email" label="New Email">
                <el-input size="small" v-model="emailform.email" placeholder="Email">
                  <el-button id="email-btn2" slot="append" @click="getEMessageCode()" v-text=emailCodeText :disabled=emailBtnDisable></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="yzm" label="Verification Code">
                <el-input size="small" v-model="emailform.yzm" placeholder="Verification Code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click.native="closeEmailDialog()">cancel</el-button>
          <el-button size="small" type="primary" @click.native="emailformSubmit()">Submit</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExhpredictionEdit_ENG",
  data() {
    return {
      baseUrl: window.config.baseUrl,
      myHeaders: { XTOKEN: localStorage.getItem("XTOKEN") },
      //当前用户
      currentUser: this.CONSTANT.currentUser,
      //菜单编码
      activeIndex: "",
      //显示加载中样
      loading: false,
      //状态 0新增
      jbxxStatus: 0,
      kpxxStatus: 0,
      wjdcStatus: 0,
      qyjsStatus: 0,
      cpjsStatus: 0,
      xqyxStatus: 0,
      //企业id
      qyid: "",
      //开票信息uuid
      kpUuid: "",
      //问卷调查uuid
      wjUuid: "",
      //企业介绍uuid
      qyUuid: "",
      //需求意向uuid
      xqUuid: "",
      //问卷调查产品分类子类
      childrenCpfl: [],
      //进度条
      active: 0,
      //要删除的图片路径list
      delPicList: [],
      delPicSrc: "",
      //上传后未保存的图片list
      unsavedPicList: [],
      //曾用公司名称
      cygsmc: "",
      //基本信息表单
      baseInforForm: {
        ywgsmc: "",
        frdb: "",
        frdbdh: "",
        yjdzsheng: "",
        yjdzshi: "",
        yjdzxx: "",
        bgdh: "",
        cz: "",
        lxr: "",
        lxrsj: "",
        wz: "",
        dzyx: "",
        dzyx1: "",
        yyzz: "",
        email: ""
      },
      //开票信息表单
      kpxxForm: {
        kpgsmc: "",
        gsdz: "",
        dhhm: "",
        yhzh: ""

      },
      //问卷调查表单
      wjdcForm: {
        zycpList: []
      },
      //企业介绍表单
      qyjsForm: {
        qyid: "",
        //logo:'',
        qyjj: "",
        qycpjsVOList: [
          {
            qyid: "",
            src: "",
            cplx: [],
            cpjj: ""
          }
        ],
        src: "",
        imageUrl: ""
      },

      //需求意向表单
      xqyxForm: {},
      //基本信息显示标识
      isJbxxShow: true,
      //开票信息显示标识
      isKpxxShow: false,
      //问卷调查显示标识
      isWjdcShow: false,
      //企业和产品介绍显示标识
      isCpjsShow: false,
      //企业参展展位需求意向
      isXqyxShow: false,
      //问卷调查产品类型选择标识
      isCplxSelect: false,
      //手机验证表单显示标识
      //dialogSjFormVisible:false,
      //邮箱表单显示标识
      dialogYxFormVisible: false,
      //email表单显示标识
      dialogEmailFormVisible: false,
      //邮箱验证flag
      mailCheck: false,
      //邮箱验证按钮可用flag
      emailBtnDisable: false,
      //关联邮箱验证按钮可用flag
      mailBtnDisable: false,
      //有无网址flag
      noWebsit: false,
      //是否为已驳回的申请
      isYbh: false,
      //通过验证的邮箱地址（记录以防验证后修改邮箱）
      checkedMailAddress: "",
      //邮箱验证码
      mailCodeReal: "",
      //email邮箱验证码
      emailCodeReal: "",
      //邮箱验证按钮文字
      mailCodeText: "verify",
      //email验证按钮
      emailCodeText: "verify",
      emailCodeText1: "change",
      time: 60,
      timer: null,
      time2: 60,
      timer2: null,
      //产品index
      index: 0,
      //树结构配置
      defaultProps: {
        children: "children",
        label: "codeName",
        value: "codeValue"
      },
      //上传图片Data
      fileList: [],
      //上传加参数
      upLoadData: {
        qyid: ""
      },
      //上传logo加参数
      upLoadLogoData: {
        uuid: "",
        qyid: ""
      },
      //产品图片上传参数
      CpjsUpLoadData: {
        qyid: ""
      },
      //公司logo
      imageUrl: "",
      //公司主营产品
      //zycp_data: [],
      //产品所属分类
      cpssfl_data: [],
      //邮箱验证表单
      yxform: {
        yzm: ""
      },
      emailform: {
        email: "",
        yzm: ""
      },
      baseInforRules: {
        ywgsmc: [
          {
            required: true,
            message: "Company name is required",
            trigger: "blur"
          },
          //{ pattern: /^[a-z\d\.\,\|\- ]+$/i, message: 'Characters and number and blank and ,.-| only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 200,
            message: "less than 200 characters",
            trigger: "blur"
          }
        ],
        yjdzxx: [
          {
            required: true,
            message: "Company address is required",
            trigger: "blur"
          },
          //{ pattern: /^[a-z\d\.\,\|\- ]+$/i, message: 'Characters and number and blank and ,.-| only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 200,
            message: "less than 200 characters",
            trigger: "blur"
          }
        ],
        bgdh: [
          {
            required: true,
            message: "Phone number is required",
            trigger: "blur"
          },
          {
            pattern: /^[A-Za-z0-9 ]+$/,
            message: "Characters and number and blank only",
            trigger: "blur"
          }
        ],
        frdb: [
          {
            required: true,
            message: "Legal Representative is required",
            trigger: "blur"
          },
          //{ pattern: /^[a-z\d\.\,\|\- ]+$/i, message: 'Characters and number and blank and ,.-| only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 50,
            message: "less than 50 characters",
            trigger: "blur"
          }
        ],
        frdbdh: [
          {
            required: true,
            message: "Legal Representative's Phone is required",
            trigger: "blur"
          },
          {
            pattern: /^[\d\-]+$/,
            message: "Number and hyphen only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        lxr: [
          {
            required: true,
            message: "Contact Person is required",
            trigger: "blur"
          },
          // { pattern: /^[a-z\d\.\,\|\- ]+$/i, message: 'Characters and number and blank and ,.-| only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 50,
            message: "less than 50 characters",
            trigger: "blur"
          }
        ],
        lxrsj: [
          {
            required: true,
            message: "Contact Person's Phone is required",
            trigger: "blur"
          },
          {
            pattern: /^[\d\-]+$/,
            message: "Number and hyphen only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        wz: [
          {
            required: false,
            message: "Company Website is required",
            trigger: "blur"
          },
          //{ pattern: /^[a-z\d\.\,\@\#\*\|\- ]+$/i, message: 'Characters and number and blank only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: "less than 100 characters",
            trigger: "blur"
          }
        ],
        dzyx1: [
          {
            required: false,
            message: "Standby Email is required",
            trigger: "blur"
          },
          {
            type: "email",
            message: "Error Email",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "Email is required", trigger: "blur" },
          {
            type: "email",
            message: "Error Email",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        reserve2: [
          {
            required: false,
            message: "Postal Code is required",
            trigger: "blur"
          },
          { pattern: /^[0-9]*$/, message: "Number only", trigger: "blur" },
          {
            min: 1,
            max: 36,
            message: "less than 36 characters",
            trigger: "blur"
          }
        ],
        cz: [
          {
            required: false,
            message: "Postal Code is required",
            trigger: "blur"
          },
          { pattern: /^[0-9]*$/, message: "Number only", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ]
      },
      kpxxRules: {
        kpgsmc: [
          {
            required: true,
            message: "Company Name on the Invoice is required",
            trigger: "blur"
          },
          // { pattern: /^[A-Za-z0-9 ]+$/, message: 'Characters and number and blank only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 200,
            message: "less than 200 characters",
            trigger: "blur"
          }
        ],
        gsdz: [
          {
            required: true,
            message: "Customer Contact is required",
            trigger: "blur"
          },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          // { pattern: /^[A-Za-z0-9 ]+$/, message: 'Characters and number and blank only',trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: "less than 300 characters",
            trigger: "blur"
          }
        ],
        dhhm: [
          {
            required: true,
            message: "Phone Number is required",
            trigger: "blur"
          },
          //{pattern: /^[\d\-]+$/, message: "Number and hyphen only",trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        yhzh: [
          { required: true, message: "Fax is required", trigger: "blur" },
          {
            pattern: /^[0-9 ]*$/,
            message: "Number and blank only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 16,
            message: "less than 16 characters",
            trigger: "blur"
          }
        ]
      },
      wjdcRules: {
        zycpList: [
          {
            required: true,
            message: "Category of Your Major Products is required",
            trigger: "change"
          }
        ]
      },
      qyjsRules: {
        qyjj: [
          {
            required: true,
            message: "Company Introduction is required",
            trigger: "blur"
          },
          //{ pattern: /^[\da-zA-Z !?|<>.,;:'"@#$￥=+_—%^&*()\[\]{}\\\/~`-]*$/, message: 'Characters and number and symbol only',trigger: 'blur' },
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 400,
            message: "less than 400 characters",
            trigger: "blur"
          }
        ],
        cplx: [
          {
            validator: (rule, value, callback) => {
              if (value.length == 0) {
                callback(new Error("Category of the Product is required"));
              } else {
                callback();
              }
            },
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
            message: "Characters and number only",
            trigger: "blur"
          }
        ]
      },
      emailRules: {
        email: [
          { required: true, message: "Email is required", trigger: "blur" },
          {
            type: "email",
            message: "Error Email",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            message: "Characters and number only",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "less than 30 characters",
            trigger: "blur"
          }
        ],
        yzm: [
          {
            required: true,
            message: "Verification Code is required",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created: function() {
    if (this.currentUser.deptid == "ZSYH") {
      //展商
      this.findInfoByUserid(this.currentUser.userid);
    } else {
      //管理员
      this.findInfoByQyid(this.$route.query.id);
      var type = this.$route.query.type;
    }
  },
  mounted: function() {
    this.getCpssfl(); //产品所属分类
  },
  methods: {
    //根据代码集获取产品所属分类
    getCpssfl: function() {
      let vm = this;
      vm.$axios.get("/codelist/getDzlxTree/CPLX_EN").then(
        function(res) {
          vm.cpssfl_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //通过userid查询基本信息数据
    findInfoByUserid: function(userid) {
      this.loading = true;
      var params = {
        userid: userid,
        deleteFlag: "N"
      };
      this.findInfoByVo(params);
    },
    //通过企业id查询基本信息数据（管理端）
    findInfoByQyid: function(qyid) {
      this.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      this.findInfoByVo(params);
    },
    //查询基本信息数据主体方法
    findInfoByVo: function(params) {
      let vm = this;
      vm.$axios.post("/qyjbxx/doFindByVo", params).then(
        function(res) {
          if (res.data.result != null && res.data.result != "") {
            if (
              vm.currentUser.deptid == "GLYH" ||
              res.data.result.sjzt == "01" ||
              res.data.result.sjzt == "04"
            ) {
              //编辑中，已驳回
              if (res.data.result.sjzt == "04") {
                vm.isYbh = true;
              }
              vm.baseInforForm = res.data.result;
              //曾用公司名称 记录当前英文公司名称
              vm.cygsmc = res.data.result.ywgsmc;
              vm.baseInforForm.dzyx1 = vm.baseInforForm.dzyx;
              if (vm.baseInforForm.wz == "" || vm.baseInforForm.wz == null) {
                vm.noWebsit = true;
              }
              vm.jbxxStatus = 1; //修改
              vm.qyid = res.data.result.qyid;
            } else {
              //已提交，已审核 直接跳转到确认页
              /*
              var params = {
                userid: vm.currentUser.userid,
                type: "BJ"
              };
              loadDivParam("prediction/exhprediction_confirm_ENG", params);
              */
              this.$router.push({name:"exhpredictionConfirm", query: {userid: this.currentUser.userid, type: 'BJ'}});
            }
          } else {
            vm.jbxxStatus = 0; //新增
            vm.baseInforForm.email = vm.currentUser.username;
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //通过企业id查找开票信息
    findKpxxByQyid: function(qyid) {
      let vm = this;
      vm.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      vm.$axios.post("/qykpxx/list", params).then(
        function(res) {
          if (res.data.result.length > 0) {
            vm.kpxxForm = res.data.result[0];
            vm.kpxxStatus = 1; //修改
            vm.kpUuid = res.data.result[0].uuid;
          } else {
            vm.kpxxStatus = 0; //新增
            //开票公司名称：必填，把企业基本信息中的“英文公司名称“带到文本框中，文本框可修改
            vm.kpxxForm.kpgsmc = vm.baseInforForm.ywgsmc;
            //是否与上面填的联系人一致，否则需要填写
            vm.kpxxForm.gsdz = vm.baseInforForm.lxr;
            //与上面填的联系人电话一致，否则需要填写
            vm.kpxxForm.dhhm = vm.baseInforForm.lxrsj;
            //与上面填的传真一致，否则需要填写
            vm.kpxxForm.yhzh = vm.baseInforForm.cz;
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //通过企业id查找问卷调查信息
    findWjdcByQyid: function(qyid) {
      let vm = this;
      vm.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      vm.$axios.post("/qywjdc/list", params).then(
        function(res) {
          if (res.data.result.length > 0) {
            vm.wjdcStatus = 1; //修改
            vm.wjdcForm = res.data.result[0];
            vm.wjdcForm.zycpList = [];
            var tempList = vm.wjdcForm.reserve1.split(",");
            for (var i in tempList) {
              vm.wjdcForm.zycpList.push(tempList[i]);
            }

            vm.wjUuid = res.data.result[0].uuid;
          } else {
            vm.wjdcStatus = 0; //新增
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //通过企业id查找企业和产品介绍
    findQyjsByQyid: function(qyid) {
      let vm = this;
      vm.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      vm.$axios.post("/qyjs/list", params).then(
        function(res) {
          if (res.data.result.length > 0) {
            vm.cpjsStatus = 1; //修改
            var resultForm = res.data.result[0];
            var params = {
              qyid: qyid,
              deleteFlag: "N"
            };
            vm.$axios.post("/qycpjs/list", params).then(
              function(res) {
                var result = res.data.result;
                var qycpjsList = [];
                for (var i in result) {
                  var cplxArray = [];
                  cplxArray.push(result[i].cplx.substr(0, 1) + "000");
                  cplxArray.push(result[i].cplx);
                  //result[i].cplx = cplxArray;
                  qycpjsList.push({
                    uuid: result[i].uuid,
                    qyid: result[i].qyid,
                    cpjj: result[i].cpjj,
                    cplx: cplxArray,
                    src: result[i].src,
                    imageUrl: vm.baseUrl + "/upload/" + result[i].src
                  });
                }
                resultForm.qycpjsVOList = qycpjsList;
                vm.qyjsForm = resultForm;
                vm.qyjsForm.imageUrl = vm.baseUrl + "/upload/" + vm.qyjsForm.src;
                vm.loading = false;
              }.bind(vm),
              function(error) {
                console.log(error);
              }
            );

            vm.qyUuid = res.data.result[0].uuid;
            vm.CpjsUpLoadData.qyid = vm.qyid;
            vm.upLoadLogoData.qyid = vm.qyid;
          } else {
            vm.cpjsStatus = 0; //新增
            vm.CpjsUpLoadData.qyid = vm.qyid;
            vm.upLoadLogoData.qyid = vm.qyid;
            if (vm.qyjsForm.qycpjsVOList.length == 0) {
              vm.qyjsForm.qycpjsVOList.push({
                qyid: vm.qyid,
                cplx: [],
                cpjj: "",
                src: "",
                imageUrl: "",
                key: Date.now()
              });
            }
            vm.loading = false;
          }
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //通过企业id查找企业参展展位需求意向
    findXqyxByQyid: function(qyid) {
      let vm = this;
      vm.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      vm.$axios.post("/qyzwyx/list", params).then(
        function(res) {
          if (res.data.result.length > 0) {
            vm.xqyxStatus = 1; //修改
            //vm.xqyxForm = res.data.result[0];
            //返回null时不自动带入min值
            if (res.data.result[0].bzzwgs != null)
              vm.xqyxForm.bzzwgs = res.data.result[0].bzzwgs;
            if (res.data.result[0].sngdzw != null)
              vm.xqyxForm.sngdzw = res.data.result[0].sngdzw;
            if (res.data.result[0].swgdzw != null)
              vm.xqyxForm.swgdzw = res.data.result[0].swgdzw;

            vm.xqUuid = res.data.result[0].uuid;
          } else {
            vm.xqyxStatus = 0; //新增
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //选择产品分类，显示子类
    selectCpfl: function(codeValue) {
      for (var i in this.cpssfl_data) {
        if (this.cpssfl_data[i].codeValue == codeValue) {
          if (codeValue == "9000") {
            this.childrenCpfl = [];
            this.childrenCpfl.push({
              codeName: "Others",
              codeValue: "9000",
              children: null
            });
          } else {
            this.childrenCpfl = this.cpssfl_data[i].children;
          }
        }
      }
      //document.getElementById("childrenRow").innerHTML="";
    },

    //关闭标签
    handleTagClose: function(tag) {
      this.wjdcForm.zycpList.splice(this.wjdcForm.zycpList.indexOf(tag), 1);
    },
    //图片上传成功回调方法
    picSuccess: function(res, file, fileList) {
      console.log(file, fileList);
    },
    //产品图片上传成功回调方法
    cpjsPicSuccess: function(res, file) {
      this.qyjsForm.qycpjsVOList[this.index].src = res.src;
      this.qyjsForm.qycpjsVOList[this.index].imageUrl = URL.createObjectURL(
        file.raw
      );
      this.unsavedPicList.push(res.src);
    },
    logoPicSuccess: function(res, file) {
      this.qyjsForm.src = res.src;
      this.qyjsForm.imageUrl = URL.createObjectURL(file.raw);
      this.unsavedPicList.push(res.src);
    },
    //企业logochange
    LogoChange: function(file, fileList) {
      var fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      var fileNameLength = file.name.length; //取到文件名长度
      var fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const isPng = fileFormat.toLowerCase() == "png";
      const isJpg = fileFormat.toLowerCase() == "jpg";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isPng && !isJpg) {
        this.$message.error("只能上传jpg、png格式的图片");
        fileList.splice(-1, 1);
      } else if (!isLt1M) {
        this.$message.error("上传图片大小不能超过1MB!");
        fileList.splice(-1, 1);
      } else {
        this.delPicList.push(this.qyjsForm.src);
      }
    },
    //产品图片change
    CpPicsChange: function(file, fileList) {
      var fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      var fileNameLength = file.name.length; //取到文件名长度
      var fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const isPng = fileFormat.toLowerCase() == "png";
      const isJpg = fileFormat.toLowerCase() == "jpg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isPng && !isJpg) {
        this.$message.error("Picture has to be endswith png or jpg");
        fileList.splice(-1, 1);
      } else if (!isLt2M) {
        this.$message.error("Picture has to be less than 2MB!");
        fileList.splice(-1, 1);
      } else {
        this.delPicList.push(this.delPicSrc);
      }
    },
    //获取点击上传的产品图片位于第几个card，用于赋src值
    getIndex: function(index, src) {
      this.index = index;
      if (src != null && src != undefined && src != "") {
        //this.delPicList.push(src);
        this.delPicSrc = src;
      }
    },
    //基本信息提交（下一步）
    submitJbxx: function(formName) {
      let vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          if (vm.jbxxStatus == 0) {
            //新增
            if (vm.baseInforForm.dzyx1 != "" && vm.mailCheck == false) {
              vm.$message({
                message: "Please verify the Standby Email",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else {
              vm.loading = true;
              var params = {
                userid: vm.currentUser.userid,
                ywgsmc: vm.baseInforForm.ywgsmc,
                frdb: vm.baseInforForm.frdb,
                frdbdh: vm.baseInforForm.frdbdh,
                yjdzxx: vm.baseInforForm.yjdzxx,
                bgdh: vm.baseInforForm.bgdh,
                cz: vm.baseInforForm.cz,
                lxr: vm.baseInforForm.lxr,
                lxrsj: vm.baseInforForm.lxrsj,
                wz: vm.baseInforForm.wz,
                dzyx: vm.baseInforForm.dzyx1,
                email: vm.baseInforForm.email,
                sjzt: "01", //编辑中
                deleteFlag: "N",
                cjrid: vm.currentUser.userid,
                cjrmc: vm.currentUser.username,
                reserve2: vm.baseInforForm.reserve2 //邮政编码
              };
              vm.$axios.post("/qyjbxx/doInsertByVo", params).then(
                function(res) {
                  if (res.data.result != null && res.data.result != "") {
                    //this.upLoadData.qyid = res.data.result.qyid;
                    //this.$refs.uploadPics.submit();
                    vm.$message({
                      message: "Brief Company Information has been saved!",
                      type: "success"
                    });
                    vm.loading = false;
                    vm.active = 1;
                    vm.isJbxxShow = false;
                    vm.isKpxxShow = true;
                    vm.jbxxStatus = 1;
                    vm.qyid = res.data.result.qyid;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findKpxxByQyid(vm.qyid);
                    }
                  } else {
                    vm.$message({
                      message: "Brief Company Information save failed!",
                      type: "error"
                    });
                    vm.loading = false;
                  }
                }.bind(vm),
                function(error) {
                  console.log(error);
                }
              );
            }
          } else {
            //修改
            //邮箱修改且邮箱验证通过flag为false
            if (
              vm.baseInforForm.dzyx1 != "" &&
              vm.baseInforForm.dzyx != vm.baseInforForm.dzyx1 &&
              vm.mailCheck == false
            ) {
              vm.$message({
                message: "Please verify the Standby Email",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else {
              vm.loading = true;
              //判断当前公司名称是否修改
              if (vm.cygsmc == vm.baseInforForm.ywgsmc) {
                //未修改
                var params = {
                  qyid: vm.baseInforForm.qyid,
                  ywgsmc: vm.baseInforForm.ywgsmc,
                  frdb: vm.baseInforForm.frdb,
                  frdbdh: vm.baseInforForm.frdbdh,
                  yjdzxx: vm.baseInforForm.yjdzxx,
                  bgdh: vm.baseInforForm.bgdh,
                  cz: vm.baseInforForm.cz,
                  lxr: vm.baseInforForm.lxr,
                  lxrsj: vm.baseInforForm.lxrsj,
                  wz: vm.baseInforForm.wz,
                  dzyx: vm.baseInforForm.dzyx1,
                  email: vm.baseInforForm.email,
                  reserve2: vm.baseInforForm.reserve2,
                  xgrid: vm.currentUser.userid,
                  xgrmc: vm.currentUser.username
                };
              } else {
                //修改了公司名称，传参cygsmc
                var params = {
                  qyid: vm.baseInforForm.qyid,
                  ywgsmc: vm.baseInforForm.ywgsmc,
                  frdb: vm.baseInforForm.frdb,
                  frdbdh: vm.baseInforForm.frdbdh,
                  yjdzxx: vm.baseInforForm.yjdzxx,
                  bgdh: vm.baseInforForm.bgdh,
                  cz: vm.baseInforForm.cz,
                  lxr: vm.baseInforForm.lxr,
                  lxrsj: vm.baseInforForm.lxrsj,
                  wz: vm.baseInforForm.wz,
                  dzyx: vm.baseInforForm.dzyx1,
                  email: vm.baseInforForm.email,
                  reserve2: vm.baseInforForm.reserve2,
                  xgrid: vm.currentUser.userid,
                  xgrmc: vm.currentUser.username,
                  cygsmc: vm.cygsmc
                };
              }
              vm.$axios.post("/qyjbxx/doUpdateByVO", params).then(
                function(res) {
                  if (res.data.result > 0) {
                    vm.loading = false;
                    vm.cygsmc = vm.baseInforForm.ywgsmc;
                    vm.upLoadData.qyid = vm.baseInforForm.qyid;
                    vm.$message({
                      message: "Brief Company Information has been saved!",
                      type: "success"
                    });
                    vm.active = 1;
                    vm.isJbxxShow = false;
                    vm.isKpxxShow = true;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findKpxxByQyid(vm.qyid);
                    }
                  } else {
                    vm.$message({
                      message: "Brief Company Information save failed",
                      type: "error"
                    });
                    vm.loading = false;
                  }
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
    },
    //开票信息提交（下一步）
    submitKpxx: function(formName) {
      let vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          vm.loading = true;
          if (vm.kpxxStatus == 0) {
            //新增
            var params = {
              qyid: vm.qyid,
              kpgsmc: vm.kpxxForm.kpgsmc,
              gsdz: vm.kpxxForm.gsdz,
              dhhm: vm.kpxxForm.dhhm,
              yhzh: vm.kpxxForm.yhzh,
              deleteFlag: "N",
              cjrid: vm.currentUser.userid,
              cjrmc: vm.currentUser.username
            };
            vm.$axios.post("/qykpxx/doInsertByVo", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "Invoice Information has been saved!",
                    type: "success"
                  });
                  vm.loading = false;
                  vm.active = 2;
                  vm.isKpxxShow = false;
                  vm.isWjdcShow = true;
                  vm.kpxxStatus = 1;
                  if (vm.qyid != null && vm.qyid != "") {
                    vm.findWjdcByQyid(vm.qyid);
                  }
                } else {
                  vm.$message({
                    message: "Invoice Information save failed",
                    type: "error"
                  });
                  vm.loading = false;
                }
              }.bind(vm),
              function(error) {
                console.log(error);
              }
            );
          } else {
            //修改
            var params = {
              uuid: vm.kpUuid,
              kpgsmc: vm.kpxxForm.kpgsmc,
              gsdz: vm.kpxxForm.gsdz,
              dhhm: vm.kpxxForm.dhhm,
              yhzh: vm.kpxxForm.yhzh,
              xgrid: vm.currentUser.userid,
              xgrmc: vm.currentUser.username
            };
            vm.$axios.post("/qykpxx/doUpdateByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "Invoice Information has been saved!",
                    type: "success"
                  });
                  vm.loading = false;
                  vm.active = 2;
                  vm.isKpxxShow = false;
                  vm.isWjdcShow = true;
                  if (vm.qyid != null && vm.qyid != "") {
                    vm.findWjdcByQyid(vm.qyid);
                  }
                } else {
                  vm.$message({
                    message: "Invoice Information save failed",
                    type: "error"
                  });
                  vm.loading = false;
                }
              }.bind(vm),
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
    //问卷调查提交（下一步）
    submitWjdc: function(formName) {
      let vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          vm.loading = true;
          if (vm.wjdcStatus == 0) {
            //新增
            var zycp = "";
            var reserve1 = "";
            for (var i in vm.wjdcForm.zycpList) {
              var str = vm.wjdcForm.zycpList[i].substr(0, 4) + ",";
              zycp += str;
              reserve1 += vm.wjdcForm.zycpList[i] + ",";
            }
            var params = {
              qyid: vm.qyid,
              zycp: zycp.substr(0, zycp.length - 1), //eg.1001,1002,1003
              deleteFlag: "N",
              cjrid: vm.currentUser.userid,
              cjrmc: vm.currentUser.username,
              reserve1: reserve1.substr(0, reserve1.length - 1) //eg.1001消防车
            };
            vm.$axios.post("/qywjdc/doInsertByVo", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "Major Product Information has been saved!",
                    type: "success"
                  });
                  vm.loading = false;
                  vm.active = 3;
                  vm.isWjdcShow = false;
                  vm.isCpjsShow = true;
                  vm.wjdcStatus = 1;
                  if (vm.qyid != null && vm.qyid != "") {
                    vm.findQyjsByQyid(vm.qyid);
                  }
                } else {
                  vm.$message({
                    message: "Major Product Information save failed",
                    type: "error"
                  });
                  vm.loading = false;
                }
              }.bind(vm),
              function(error) {
                console.log(error);
              }
            );
          } else {
            //修改
            var zycp = "";
            var reserve1 = "";
            for (var i in vm.wjdcForm.zycpList) {
              var str = vm.wjdcForm.zycpList[i].substr(0, 4) + ",";
              zycp += str;
              reserve1 += vm.wjdcForm.zycpList[i] + ",";
            }
            var params = {
              uuid: vm.wjUuid,
              qyid: vm.qyid,
              zycp: zycp.substr(0, zycp.length - 1), //eg.1001,1002,1003
              xgrid: vm.currentUser.userid,
              xgrmc: vm.currentUser.username,
              reserve1: reserve1.substr(0, reserve1.length - 1) //eg.1001消防车
            };
            vm.$axios.post("/qywjdc/doUpdateByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "Major Product Information has been saved!",
                    type: "success"
                  });
                  vm.loading = false;
                  vm.active = 3;
                  vm.isWjdcShow = false;
                  vm.isCpjsShow = true;
                  if (vm.qyid != null && vm.qyid != "") {
                    vm.findQyjsByQyid(vm.qyid);
                  }
                } else {
                  vm.$message({
                    message: "Major Product Information save failed",
                    type: "error"
                  });
                  vm.loading = false;
                }
              }.bind(vm),
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
    //产品介绍提交（下一步）
    submitCpjs: function(formName) {
      let vm = this;
      vm.$refs[formName].validate(valid => {
        if (valid) {
          var cp =
            vm.qyjsForm.qycpjsVOList[vm.qyjsForm.qycpjsVOList.length - 1];
          var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
          if (vm.qyjsForm.imageUrl == null || vm.qyjsForm.imageUrl == "") {
            //判断企业logo是否上传
            vm.$message({
              message: "Please upload your Company Logo",
              type: "warning"
            });
            vm.loading = false;
            return false;
          } else if (cp.cplx == "" || cp.cpjj == "" || cp.src == "") {
            //判断最后一个card产品信息是否填全
            vm.$message({
              message: "Please fill out the Product Examples form",
              type: "warning"
            });
            vm.loading = false;
            return false;
          } else if (reg.test(cp.cpjj)) {
            vm.$message({
              message: "Unable to input Chinese",
              type: "warning"
            });
            vm.loading = false;
            return false;
          } else {
            //信息填写完整
            //var tempList = vm.qyjsForm.qycpjsVOList;
            var tempList = [];
            for (var i in vm.qyjsForm.qycpjsVOList) {
              var cpjj_temp = vm.qyjsForm.qycpjsVOList[i].cpjj;
              //产品类型级联下拉处理
              if (
                typeof vm.qyjsForm.qycpjsVOList[i].cplx == "object" &&
                vm.qyjsForm.qycpjsVOList[i].cplx.constructor == Array &&
                vm.qyjsForm.qycpjsVOList[i].cplx.length > 0
              ) {
                var length = vm.qyjsForm.qycpjsVOList[i].cplx.length;
                var cplx_temp = vm.qyjsForm.qycpjsVOList[i].cplx[length - 1];
              }
              var obj_temp = {
                uuid: vm.qyjsForm.qycpjsVOList[i].uuid,
                qyid: vm.qyid,
                src: vm.qyjsForm.qycpjsVOList[i].src,
                cplx: cplx_temp,
                cpjj: cpjj_temp
              };
              tempList.push(obj_temp);
            }
            if (vm.cpjsStatus == 0) {
              //新增
              vm.loading = true;
              var params = {
                qyid: vm.qyid,
                qyjj: vm.qyjsForm.qyjj,
                qycpjsVOList: tempList,
                deleteFlag: "N",
                src: vm.qyjsForm.src,
                cjrid: vm.currentUser.userid,
                cjrmc: vm.currentUser.username
              };
              vm.$axios.post("/qyjs/doInsertByVo", params).then(
                function(res) {
                  if (res.data.result != null && res.data.result != "") {
                    //vm.upLoadLogoData.uuid = res.data.result.uuid;
                    //vm.$refs.uploadLogo.submit();
                    vm.$message({
                      message:
                        "Company Information Details and Product Examples has been saved!",
                      type: "success"
                    });
                    vm.loading = false;
                    vm.active = 4;
                    vm.isCpjsShow = false;
                    vm.isXqyxShow = true;
                    vm.cpjsStatus = 1;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findXqyxByQyid(vm.qyid);
                    }
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
                    vm.unsavedPicList = [];
                  } else {
                    vm.$message({
                      message:
                        "Company Information Details and Product Examples save failed",
                      type: "error"
                    });
                    vm.loading = false;
                  }
                }.bind(vm),
                function(error) {
                  console.log(error);
                }
              );
            } else {
              //修改
              vm.loading = true;
              var params = {
                uuid: vm.qyUuid,
                qyid: vm.qyid,
                src: vm.qyjsForm.src,
                qyjj: vm.qyjsForm.qyjj,
                qycpjsVOList: tempList,
                xgrid: vm.currentUser.userid,
                xgrmc: vm.currentUser.username
              };
              vm.$axios.post("/qyjs/doUpdateQyCpByVO", params).then(
                function(res) {
                  if (res.data.result != null && res.data.result != "") {
                    //this.upLoadLogoData.uuid = res.data.result.uuid;
                    //this.$refs.uploadLogo.submit();
                    vm.$message({
                      message:
                        "Company Information Details and Product Examples has been saved!",
                      type: "success"
                    });
                    vm.loading = false;
                    vm.active = 4;
                    vm.isCpjsShow = false;
                    vm.isXqyxShow = true;
                    vm.cpjsStatus = 1;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findXqyxByQyid(vm.qyid);
                    }
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
                    vm.unsavedPicList = [];
                  } else {
                    vm.$message({
                      message:
                        "Company Information Details and Product Examples save failed",
                      type: "error"
                    });
                    vm.loading = false;
                  }
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
    },
    //需求意向提交
    submitXqyx: function() {
      let vm = this;
      if (
        vm.xqyxForm.bzzwgs > 0 ||
        vm.xqyxForm.sngdzw > 0 ||
        vm.xqyxForm.swgdzw > 0
      ) {
        vm.loading = true;
        if (vm.xqyxStatus == 0) {
          //新增
          var params = {
            qyid: vm.qyid,
            bzzwgs: vm.xqyxForm.bzzwgs,
            sngdzw: vm.xqyxForm.sngdzw,
            swgdzw: vm.xqyxForm.swgdzw,
            deleteFlag: "N",
            cjrid: vm.currentUser.userid,
            cjrmc: vm.currentUser.username
          };
          vm.$axios.post("/qyzwyx/doInsertByVo", params).then(
            function(res) {
              if (res.data.result > 0) {
                vm.$message({
                  message:
                    "Questionnaire on your Booth Requirement has been saved!",
                  type: "success"
                });
                vm.loading = false;
                vm.active = 5;
                vm.xqyxStatus = 1;
                vm.submit();
              } else {
                vm.$message({
                  message:
                    "Questionnaire on your Booth Requirement save failed",
                  type: "error"
                });
                vm.loading = false;
              }
            }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
        } else {
          //修改
          var params = {
            uuid: vm.xqUuid,
            qyid: vm.qyid,
            bzzwgs: vm.xqyxForm.bzzwgs,
            sngdzw: vm.xqyxForm.sngdzw,
            swgdzw: vm.xqyxForm.swgdzw,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          };
          vm.$axios.post("/qyzwyx/doUpdateByVO", params).then(
            function(res) {
              if (res.data.result > 0) {
                vm.$message({
                  message:
                    "Questionnaire on your Booth Requirement has been saved!",
                  type: "success"
                });
                vm.loading = false;
                vm.active = 5;
                //提交展位预报名信息
                vm.submit();
              } else {
                vm.$message({
                  message:
                    "Questionnaire on your Booth Requirement save failed",
                  type: "error"
                });
                vm.loading = false;
              }
            }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
        }
      } else {
        vm.$message({
          message: "Please choose at least one kind of booth!",
          type: "warning"
        });
        console.log("error submit!!");
        vm.loading = false;
        return false;
      }
    },
    //提交
    submit: function() {
      if (this.currentUser.deptid == "ZSYH") {
        //如果是展商用户跳转到确认页
        this.$router.push({name:"exhpredictionConfirm", query: {userid: this.currentUser.userid, type: 'BJ'}});
      } else {
        //如果是管理员跳转到列表页
        this.$router.push({name:"exhprediction"});
      }
    },
    //开票信息上一步
    cancelKpxx: function() {
      this.active = 1;
      this.isKpxxShow = false;
      this.isJbxxShow = true;
    },
    //问卷调查上一步
    cancelWjdc: function() {
      this.active = 2;
      this.isWjdcShow = false;
      this.isKpxxShow = true;
    },
    //产品介绍上一步
    cancelCpjs: function() {
      let vm = this;
      vm.active = 3;
      vm.delPicList = [];
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
      vm.isCpjsShow = false;
      vm.isWjdcShow = true;
    },
    //需求意向上一步
    cancelXqyx: function() {
      this.active = 4;
      this.isXqyxShow = false;
      this.isCpjsShow = true;
    },

    //新增产品card
    addDomain: function() {
      //判断最后一个card产品信息是否填全
      var cp = this.qyjsForm.qycpjsVOList[
        this.qyjsForm.qycpjsVOList.length - 1
      ];
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (cp.cplx == "" || cp.cpjj == "" || cp.src == "") {
        this.$message({
          message: "Please fill out the Product Examples form",
          type: "warning"
        });
        return false;
      } else if (reg.test(cp.cpjj)) {
        this.$message({
          message: "Unable to input Chinese",
          type: "warning"
        });
        return false;
      } else {
        if (this.qyjsForm.qycpjsVOList.length < 6) {
          this.qyjsForm.qycpjsVOList.push({
            qyid: this.qyid,
            cplx: [],
            cpjj: "",
            src: "",
            imageUrl: "",
            key: Date.now()
          });
        } else {
          this.$message({
            message: "You can add at most 6 product Examples",
            type: "warning"
          });
        }
      }
    },
    //删除产品card
    removeDomain: function(item) {
      if (this.qyjsForm.qycpjsVOList.length > 1) {
        var index = this.qyjsForm.qycpjsVOList.indexOf(item);
        if (index !== -1) {
          if (
            this.qyjsForm.qycpjsVOList[index].src != "" &&
            this.qyjsForm.qycpjsVOList[index].src != null &&
            this.qyjsForm.qycpjsVOList[index].src != undefined
          ) {
            this.delPicList.push(this.qyjsForm.qycpjsVOList[index].src);
          }
          this.qyjsForm.qycpjsVOList.splice(index, 1);
        }
      } else {
        this.$message({
          message: "Please fill out at least one product example",
          type: "warning"
        });
      }
    },

    //邮箱验证表单提交
    yxformSubmit: function() {
      if (this.yxform.yzm == this.mailCodeReal) {
        this.mailCheck = true;
        this.checkedMailAddress = this.baseInforForm.dzyx1;
        this.dialogYxFormVisible = false;
        this.$message({
          message: "success",
          type: "success"
        });
        this.mailCodeText = "verify";
      } else {
        this.$message({
          message: "Error Verification Code",
          type: "error"
        });
      }
    },
    //修改邮箱，默认是登录名
    openEmail: function() {
      this.dialogEmailFormVisible = true;
      // $("#email-btn").attr("disabled", "disabled");
      //this.emailBtnDisable = true;
    },
    //email提交
    emailformSubmit: function() {
      if (this.emailform.email != null && this.emailform.email != "") {
        if (
          this.emailform.yzm == this.emailCodeReal &&
          this.emailCodeReal != ""
        ) {
          this.baseInforForm.email = this.emailform.email;
          this.dialogEmailFormVisible = false;
          //  $("#email-btn").removeAttr("disabled");
          this.emailBtnDisable = false;
          //  $("#email-btn2").removeAttr("disabled");
          this.$message({
            message: "success",
            type: "success"
          });
        } else {
          this.$message({
            message: "Error Verification Code",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "Email is required",
          type: "warning"
        });
      }
    },
    //邮箱修改验证
    openYxYz: function() {
      let vm = this;
      if (
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(
          vm.baseInforForm.dzyx1
        )
      ) {
        vm.$message({
          message: "error email",
          type: "warning"
        });
        return false;
      } else {
        //查询邮箱是否注册
        vm.$axios
          .get("/qyjbxx/getMailNum/" + vm.baseInforForm.dzyx1 + "/static")
          .then(
            function(res) {
              if (res.data.result == 0) {
                vm.mailCodeText = "sending...";
                //$("#mail-btn").attr("disabled", "disabled");
                vm.mailBtnDisable = true;
                vm.$axios
                  .get("/signin/sendMailEng?mail=" + vm.baseInforForm.dzyx1)
                  .then(
                    function(res) {
                      vm.mailCodeReal = res.data.msg;
                      var count = vm.time;
                      vm.timer = setInterval(() => {
                        if (count == 0) {
                          clearInterval(vm.timer);
                          vm.timer = null;
                          vm.mailCodeText = "verify";
                          //$("#mail-btn").removeAttr("disabled");
                          vm.mailBtnDisable = false;
                        } else {
                          vm.mailCodeText = count + "s";
                          count--;
                          //$("#mail-btn").attr("disabled", "disabled");
                          vm.mailBtnDisable = true;
                        }
                      }, 1000);
                      vm.dialogYxFormVisible = true;
                    }.bind(vm),
                    function(error) {
                      console.log(error);
                    }
                  );
              } else if (vm.baseInforForm.dzyx1 == vm.baseInforForm.dzyx) {
                vm.$message({
                  message: "success!",
                  type: "success"
                });
                return false;
              } else {
                vm.$message({
                  message: "This email address has been used!",
                  type: "warning"
                });
                return false;
              }
            }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
      }
    },
    getEMessageCode: function() {
      let vm = this;
      if (
        !/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/.test(
          vm.emailform.email
        )
      ) {
        vm.$message({
          message: "Error Email",
          type: "warning"
        });
        return false;
      } else {
        vm.emailCodeText = "sending...";
        vm.emailCodeText1 = "sending...";
        //$("#email-btn").attr("disabled", "disabled");
        vm.emailBtnDisable = true;
        //  $("#email-btn2").attr("disabled", "disabled");
        vm.$axios.get("/signin/sendMailEng?mail=" + vm.emailform.email).then(
          function(res) {
            vm.emailCodeReal = res.data.msg;
            var count = vm.time2;
            vm.timer2 = setInterval(() => {
              if (count == 0) {
                clearInterval(vm.timer2);
                vm.timer2 = null;
                vm.emailCodeText = "verify";
                vm.emailCodeText1 = "change";
                //$("#email-btn").removeAttr("disabled");
                vm.emailBtnDisable = false;
                // $("#email-btn2").removeAttr("disabled");
              } else {
                vm.emailCodeText = count + "s";
                vm.emailCodeText1 = count + "s";
                count--;
                //$("#email-btn").attr("disabled", "disabled");
                vm.emailBtnDisable = true;
                // $("#email-btn2").attr("disabled", "disabled");
              }
            }, 1000);
          }.bind(vm),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    //关闭邮箱验证对话
    closeYxDialog: function() {
      this.dialogYxFormVisible = false;
      //this.yxform.yx = "";
      this.yxform.yzm = "";
    },
    //关闭email
    closeEmailDialog: function() {
      this.dialogEmailFormVisible = false;
      this.emailform.email = "";
      this.emailform.yzm = "";
      //$("#email-btn").removeAttr("disabled");
      this.emailBtnDisable = false;
      // $("#email-btn2").removeAttr("disabled");
    },
    //邮箱change判断需不需要重新验证
    dzyxChange: function() {
      if (
        this.checkedMailAddress != this.baseInforForm.dzyx1 &&
        this.checkedMailAddress != ""
      ) {
        this.mailCheck = false;
      }
    }
  }
};
</script>

<style lang="scss">
#ExhpredictionEdit_ENG {
  #qycpArea .el-form-item__error {
    padding-top: 8px !important;
  }
  #cp_card .el-card__header {
    padding: 1px 15px;
  }
  .el-card__body {
    padding: 10px 0px 10px 0px;
  }
  .el-message {
    z-index: 10005 !important;
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
  .el-dialog {
    width: 45%;
  }
  .el-button--small {
    padding: 9px 9px;
  }
  .yxLabel {
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    font-weight: 700;
    max-width: 100%;
    margin-bottom: 5px;
  }
  #cplx_btn_group {
    margin-bottom: 10px;
  }
  #cplx_btn_group .el-button--small {
    margin-right: 10px;
  }
  #cplx_btn_group .el-button + .el-button {
    margin-left: 0;
  }
  #cplx_chb_group .el-checkbox {
    margin-right: 30px;
  }
  #cplx_chb_group .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
  #cplx_btn_group .el-form-item__error {
    padding-top: 8px;
  }
  #tagCheckbox .el-checkbox__label {
    padding-left: 5px;
    font-size: 10px;
  }
  #remark {
    line-height: 31px;
    padding: 5px 15px;
    border: 1px solid #e40613;
    border-radius: 5px;
    color: #e40613;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  #remark i.icon-alarm {
    width: 28px;
    height: 25px;
    display: inline-block;
    margin-bottom: -5px;
    background: url("/static/images/prediction/alarm.png") no-repeat;
    background-size: cover;
  }
  #cpjsArea .el-form-item__error {
    padding-top: 8px;
  }
}
</style>
