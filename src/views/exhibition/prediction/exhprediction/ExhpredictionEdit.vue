<template>
  <div id="exhpredictionEdit">
    <div class="main-container" v-loading="this.loading" element-loading-text="加载中">
      <!--步骤条-->
      <div id="steps">
        <el-steps :active="this.active" align-center finish-status="success" style="margin-top:10px;">
          <el-step title="企业基本信息"></el-step>
          <el-step title="企业开票信息"></el-step>
          <el-step title="企业问卷调查"></el-step>
          <el-step title="企业和产品介绍"></el-step>
          <el-step title="企业参展展位需求意向"></el-step>
          <el-step title="确认并提交"></el-step>
        </el-steps>
      </div>
      <!--审核状态-->
      <div id="remark" v-if="isYbh">
        <el-row>
          <el-col :span="1" style="text-align: center"><i class="icon-alarm"></i>&nbsp;</el-col>
          <el-col :span="5" style="text-align: left">上次审核状态：已驳回</el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="15" style="text-align: left">审核意见：<span v-text="baseInforForm.reserve1"></span></el-col>
        </el-row>
      </div>
      <!--基本信息-->
      <div id="inforView" class="pt15" v-show="isJbxxShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">基本信息</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="baseInforForm" :model="baseInforForm" label-width="150px" label-position="right" :rules="baseInforRules">
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="zwgsmc" label="中文公司名称">
                <el-input size="small" v-model="baseInforForm.zwgsmc" placeholder="中文公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="ywgsmc" label="英文公司名称">
                <el-input size="small" v-model="baseInforForm.ywgsmc" placeholder="英文公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="xzqh" label="邮寄地址（省市）">
                <el-cascader id="ShengShiCascader" :options="xzqhDataTree" :props="defaultProps" size="small" v-model="baseInforForm.xzqh"
                    placeholder="省/市" class="searchSelect" clearable show-all-levels></el-cascader>
                </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="yjdzxx" label="邮寄详细地址">
                <el-input size="small" v-model="baseInforForm.yjdzxx" placeholder="详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="bgdh" label="办公电话">
                <el-input size="small" v-model="baseInforForm.bgdh" maxlength="50" placeholder="办公电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="cz" label="传真">
                <el-input size="small" v-model="baseInforForm.cz" placeholder="传真"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="frdb" label="法人代表">
                <el-input size="small" v-model="baseInforForm.frdb" placeholder="法人代表"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="frdbdh" label="法人代表电话">
                <el-input size="small" v-model="baseInforForm.frdbdh" placeholder="法人代表电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="lxr" label="联系人">
                <el-input size="small" v-model="baseInforForm.lxr" placeholder="联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <el-form-item prop="lxrsj" label="手机">
                <el-input disabled size="small" v-model="baseInforForm.lxrsj" placeholder="手机">
                  <el-button slot="append" @click="openSjYz">修改</el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="11">
              <el-form-item prop="wz" label="网址" :rules="noWebsit?baseInforRules.wz:[{ required: true, message: '请输入网址', trigger: 'blur' }]">
                <el-input size="small" v-model="baseInforForm.wz" placeholder="网址" :disabled=noWebsit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-checkbox id="tagCheckbox" v-model="noWebsit" style="margin-left: 10px;line-height: 40px;font-size: 14px;position: relative;">无网站</el-checkbox>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="dzyx1" label="邮箱" v-show="true">
                <el-input size="small" v-model="baseInforForm.dzyx1" placeholder="邮箱" @change="dzyxChange()">
                  <el-button id="mail-btn" :disabled=mailBtnDisable slot="append" @click="openYxYz" v-text=mailCodeText></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
            <el-col :span="24">
              <strong style="color: #463132;"><span style="color: red">*</span>&nbsp;营业执照</strong>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-upload class="avatar-uploader" ref="uploadPics" :headers="myHeaders" action="http://localhost:8809/qyjbxx/upload" :data="upLoadData" :on-success="picSuccess"
                   :before-upload="PicChange" :show-file-list="false">
                <img v-if="baseInforForm.src!=='' && baseInforForm.src!==null" :src="baseInforForm.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">jpg/png、单页pdf文件，且小于2MB</div>
              </el-upload>
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="success" size="small" class="btn_submit" @click="submitJbxx('baseInforForm')">下一步&nbsp;
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
            <strong style="color: #463132;">企业开票信息</strong>
          </el-col>
        </el-row>
       
        <el-form class="el-form demo-form-inline" ref="kpxxForm" :model="kpxxForm" label-position="right" label-width="150px" :rules="kpxxRules">
           <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="kplx" label="开票类型" style="text-align: left">
                <el-radio-group v-model="kpxxForm.kplx" size="small" auto-complete="off" @change="fplxChange()">
                  <el-radio class="radio" :label="'1'">增值税专用发票</el-radio>
                  <el-radio class="radio" :label="'2'">增值税普通发票</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="kpgsmc" label="开票公司名称">
                <el-input size="small" v-model="kpxxForm.kpgsmc" placeholder="开票公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="tyshxydm" label="统一社会信用代码" :onkeyup="addBlankXydm()">
                <el-input size="small" v-model="kpxxForm.tyshxydm" placeholder="统一社会信用代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="gsdz" label="公司地址" :rules="this.isZyfp?kpxxRules.gsdz:[{ required: false, message: '请输入公司地址', trigger: 'blur' },{ min: 1, max: 150, message: '最多可输入150个字', trigger: 'blur' }]">
                <el-input size="small" v-model="kpxxForm.gsdz" placeholder="公司地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="isZyfp">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="dhhm" label="电话号码" :rules="this.isZyfp?kpxxRules.dhhm:[{ required: false, message: '请输入电话号码', trigger: 'blur' }]">
                <el-input size="small" v-model="kpxxForm.dhhm" maxlength="50" placeholder="电话号码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="isZyfp">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="khyh" label="开户银行" :rules="this.isZyfp?kpxxRules.khyh:[{ required: false, message: '请输入开户银行', trigger: 'blur' }]">
                <el-input size="small" v-model="kpxxForm.khyh" placeholder="开户银行"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="isZyfp">
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="12">
              <el-form-item prop="yhzh" label="银行账号" :onkeyup="addBlankYhzh()" :rules="this.isZyfp?kpxxRules.yhzh:[{ required: false, message: '请输入银行账号', trigger: 'blur' }]">
                <el-input size="small" v-model="kpxxForm.yhzh" placeholder="银行账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelKpxx('kpxxForm')">上一步</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitKpxx('kpxxForm')">下一步&nbsp;
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
            <strong style="color: #463132;">企业问卷调查</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="wjdcForm" :model="wjdcForm" label-position="right" label-width="200px" :rules="wjdcRules">
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="gsxz" label="公司性质" style="text-align: left">
                <el-radio-group v-model="wjdcForm.gsxz" size="small" auto-complete="off">
                  <el-radio v-for="item in gsxz_data" :label="item.codeValue" :key="item.codeValue" class="radio">
                    <span v-text="item.codeName"></span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="sfhwdlcp" label="是否代理海外产品" style="text-align: left">
                <el-radio-group v-model="wjdcForm.sfhwdlcp" size="small" auto-complete="off" @change="sfhwdlcpChange()">
                  <el-radio class="radio" :label="'1'">是</el-radio>
                  <el-radio class="radio" :label="'0'">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="ishwdlcp">
            <el-col :span="22">
              <el-form-item prop="hwdlcppp" label="代理海外产品品牌" :rules="this.ishwdlcp?wjdcRules.hwdlcppp:[{ required: false, message: '请输入产品品牌', trigger: 'blur' }]">
                <el-input size="small" v-model="wjdcForm.hwdlcppp" placeholder="代理海外产品品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="fmzl" label="发明专利(项)">
                <el-input-number v-model="wjdcForm.fmzl" size="small" :min="0" :max="10000" :precision="0" label="发明专利(项)"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="syxxzl" label="实用新型专利(项)">
                <el-input-number v-model="wjdcForm.syxxzl" size="small" :min="0" :max="10000" :precision="0" label="实用新型专利(项)"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="wgsjzl" label="外观设计专利(项)">
                <el-input-number v-model="wjdcForm.wgsjzl" size="small" :min="0" :max="10000" :precision="0" label="外观设计专利(项)"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="sfgxjsqy" label="是否为高新技术企业" style="text-align: left">
                <el-radio-group v-model="wjdcForm.sfgxjsqy" size="small" auto-complete="off" @change="sfgxjsqyChange()">
                  <el-radio class="radio" :label="'1'">是</el-radio>
                  <el-radio class="radio" :label="'0'">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="isgxjsqy">
            <el-col :span="22">
              <el-form-item label="企业高新技术级别" prop="gxjsjb" :rules="this.isgxjsqy?wjdcRules.gxjsjb:[{ required: false, message: '请选择企业高新技术级别', trigger: 'blur' }]"
                  style="text-align: left">
                <el-radio-group v-model="wjdcForm.gxjsjb" size="small" auto-complete="off">
                  <el-radio v-for="item in gxjsjb_data" :label="item.codeValue" :key="item.codeValue" class="radio">
                    <span v-text="item.codeName"></span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22" style="text-align:left">
              <el-form-item label="公司主营产品类型" prop="zycpList" id="cplx_btn_group">
                <el-button v-for="item in zycp_data" :key="item.codeValue" plain size="small" @click="selectCpfl(item.codeValue)">
                  <span v-text="item.codeName"></span>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row id="childrenRow" class="tr mb5" style="text-align:left">
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
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22" style="text-align:left">
              <el-form-item prop="sfhyxydj" label="是否在2016或2017或2018年参与中国消防协会消防行业信用等级初评">
                <el-radio-group v-model="wjdcForm.sfhyxydj" size="small" auto-complete="off" @change="sfhyxydjChange()">
                  <el-radio class="radio" :label="'1'">是</el-radio>
                  <el-radio class="radio" :label="'0'">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5" v-show="isSfhyxydj">
            <el-col :span="22" style="text-align:left">
              <el-form-item label="行业信用等级" prop="hyxydj" :rules="this.isSfhyxydj?wjdcRules.hyxydj:[{ required: false, message: '请选择行业信用等级', trigger: 'blur' }]">
                <el-radio-group v-model="wjdcForm.hyxydj" size="small" auto-complete="off">
                  <el-radio v-for="item in hyxydj_data" :label="item.codeValue" :key="item.codeValue" class="radio">
                      <span v-text="item.codeName"></span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelWjdc('wjdcForm')">上一步</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitWjdc('wjdcForm')">下一步&nbsp;
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
            <strong style="color: #463132;">企业介绍</strong>
          </el-col>
        </el-row>
        <el-row>
          <el-form class="el-form demo-form-inline" ref="qyjsForm" :model="qyjsForm" label-position="right" label-width="150px" :rules="qyjsRules">
            <el-row class="tr mb5">
              <el-col :span="9">
                <el-form-item label="企业LOGO图标" style="text-align: left" class="is-required">
                  <el-upload class="avatar-uploader" ref="uploadLogo" :headers="myHeaders" action="http://localhost:8809/qyjs/upload" :data="upLoadLogoData" :on-success="logoPicSuccess"
                    :before-upload="LogoChange" :show-file-list="false">
                    <img v-if="qyjsForm.src!==''&& qyjsForm.src!==null" :src="qyjsForm.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div class="el-upload__tip" slot="tip">jpg/png文件，且小于1MB</div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="1">&nbsp;</el-col> -->
              <el-col :span="14" style="margin-left: -10%" id="qycpArea">
                <el-row>
                  <el-form-item prop="qyjj" style="text-align: left" label="企业简介">
                    <el-input type="textarea" :rows="2" maxlength="200" placeholder="企业简介" v-model="qyjsForm.qyjj" :onkeyup="checkWord(qyjsForm.qyjj,'qyjsLength','200')"></el-input>
                  </el-form-item>
                  <el-row>
                    <div class="el-upload__tip">还可输入<span style="color: red" id="qyjsLength">{{200-qyjsForm.qyjj.length}}</span>个字</div>
                  </el-row>
                </el-row>
                <el-row>
                  <el-form-item prop="reserve1" style="text-align: left" label="企业英文简介">
                    <el-input type="textarea" :rows="2" maxlength="500" placeholder="企业英文简介" v-model="qyjsForm.reserve1" :onkeyup="checkWord(qyjsForm.reserve1,'qyywjsLength','500')"></el-input>
                  </el-form-item>
                  <el-row>
                    <div class="el-upload__tip">还可输入
                      <span v-if="qyjsForm.reserve1!=null" style="color: red" id="qyywjsLength">{{500-qyjsForm.reserve1.length}}</span>
                      <span v-else style="color: red" id="qyywjsLength">500</span>
                      个英文字符</div>
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="1">&nbsp;</el-col>
            </el-row>
            <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
              <el-col :span="12">
                <strong style="color: #463132;">产品介绍（可添加1至6条产品信息）</strong>
              </el-col>
              <el-col :span="12" class="pb1">
                <el-button type="primary" icon="el-icon-plus" size="small" class="r" @click="addDomain">增加产品</el-button>
              </el-col>
            </el-row>
            <el-row class="mt15 mb20" style="overflow-x: hidden">
              <el-card class="card_style" id="cp_card" v-for="(domain, index) in qyjsForm.qycpjsVOList" :key="index">
                <div slot="header" class="clearfix">
                  <strong class="card_title_font">产品{{index+1}}</strong>
                  <el-button type="danger" icon="el-icon-minus" size="small" @click.prevent="removeDomain(domain)" class="r" style="margin: 4px -15px 0px 0px">删除产品</el-button>
                </div>
                <el-row class="tr">
                  <el-col :span="9">
                    <el-form-item label="产品图片" style="text-align: left" class="is-required">
                      <el-upload class="avatar-uploader" ref="uploadCpPics" :headers="myHeaders" action="http://localhost:8809/qycpjs/upload" :on-success="cpjsPicSuccess" :before-upload="CpPicsChange"
                          :show-file-list="false" :data="CpjsUpLoadData">
                          <img @click="getIndex(index,domain.src)" v-if="domain.src!=='' && domain.src!==null" :src="domain.imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon" @click="getIndex(index)"></i>
                        <div class="el-upload__tip" slot="tip">jpg/png文件，且小于2MB</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14" style="margin-left: -10%">
                    <el-row>
                      <el-form-item label="产品所属分类" class="is-required" :prop = "'qycpjsVOList.' + index + '.cplx'" :rules="qyjsRules.cplx">
                        <el-cascader :options="cpssfl_data" :props="defaultProps" size="small" v-model="domain.cplx" placeholder="产品所属分类" class="searchSelect"
                              clearable show-all-levels></el-cascader>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <div class="el-upload__tip"></div>
                    </el-row>
                    <el-row id="cpjsArea">
                      <el-form-item label="产品简介" :prop = "'qycpjsVOList.' + index + '.cpjj'" :rules="qyjsRules.cpjj">
                        <el-input type="textarea" maxlength="150" :rows="2" placeholder="产品简介" v-model="domain.cpjj" :onkeyup="checkWord(domain.cpjj,index+100,'150')"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <div class="el-upload__tip" >还可输入<span style="color: red" :id="index+100">{{150-domain.cpjj.length}}</span>个字</div>
                    </el-row>
                    <el-row id="cpjsArea">
                      <el-form-item label="产品英文简介" :prop = "'qycpjsVOList.' + index + '.reserve1'" :rules="qyjsRules.reserve1">
                        <el-input type="textarea" maxlength="400" :rows="2" placeholder="产品英文简介" v-model="domain.reserve1" :onkeyup="checkWord(domain.reserve1,index+200,'400')"></el-input>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <div class="el-upload__tip" >还可输入
                      <span v-if="domain.reserve1!=null" style="color: red" :id="index+200">{{400-domain.reserve1.length}}</span>
                      <span v-else style="color: red" :id="index+200">400</span>个英文字符</div>
                    </el-row>
                  </el-col>
                </el-row>
              </el-card>
            </el-row>                
          </el-form>
        </el-row>
        <el-row class="buttonSubmit">
          <el-col :span="24">
            <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelCpjs('qyjsForm')">上一步</el-button>
            <el-button type="success" size="small" class="btn_submit" @click="submitCpjs('qyjsForm')">下一步&nbsp;
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!--企业参展展位需求意向-->
      <div id="xqyxView" class="pt15" v-show="isXqyxShow">
        <el-row class="mb5" style="border-bottom:1px solid #463132;line-height: 29px;">
          <el-col :span="24">
            <strong style="color: #463132;">参展展位需求意向</strong>
          </el-col>
        </el-row>
        <el-form class="el-form demo-form-inline" ref="xqyxForm" :model="xqyxForm" label-width="150px" label-position="right">
          <el-row class="tr mb5">
            <el-col :span="8">
              <span class="mr5 vbm yxLabel">标准展位（每个12 平方米）</span>
            </el-col>
            <el-col :span="8">
              <el-input-number size="small" v-model="xqyxForm.bzzwgs" :min="0" :max="6" :precision="0" placeholder="标准展位"></el-input-number>
            </el-col>
            <el-col :span="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;个</span>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="8">
              <span class="mr5 vbm yxLabel">室内光地展位（需要特装搭建，24平方米起）</span>
            </el-col>
            <el-col :span="8">
              <el-input-number size="small" v-model="xqyxForm.sngdzw" :min="24" :max="1000" :precision="0" placeholder="室内光地展位"></el-input-number>
            </el-col>
            <el-col :span="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;平方米</span>
            </el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="8">
              <span class="mr5 vbm yxLabel">室外光地展位（仅限<span style="color: red">举高</span>消防车类）</span>
            </el-col>
            <el-col :span="8">
              <el-input-number size="small" v-model="xqyxForm.swgdzw" :min="0" :max="2000" :precision="0" placeholder="室外光地展位"></el-input-number>
            </el-col>
            <el-col :span="2" style="text-align: left">
              <span class="mr5 vbm yxLabel">&nbsp;&nbsp;平方米</span>
            </el-col>
          </el-row>
          <el-row class="buttonSubmit">
            <el-col :span="24">
              <el-button type="info" icon="el-icon-arrow-left" size="small" class="btn_submit" @click="cancelXqyx()">上一步</el-button>
              <el-button type="success" size="small" class="btn_submit" @click="submitXqyx()">下一步&nbsp;
                <i class="el-icon-arrow-right"></i>
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!--手机验证dialog-->
      <el-dialog title="手机号码验证" :visible.sync="dialogSjFormVisible" @close="closeDialog()" :close-on-click-modal="false">
        <el-form class="el-form demo-form-inline" ref="sjform" :model="sjform" label-position="right" label-width="120px" :rules="sjformRules">
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="sjh" label="手机号">
                <el-input size="small" v-model="sjform.sjh" placeholder="手机号">
                  <el-button id="mobile-btn" slot="append" @click="getMessageCode()" v-text=messageCodeText></el-button>
                </el-input>
               </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="yzm" label="短信验证码">
                <el-input size="small" v-model="sjform.yzm" placeholder="短信验证码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click.native="closeDialog(sjform)">取消</el-button>
          <el-button size="small" type="primary" @click.native="sjformSubmit(sjform)">提交</el-button>
        </div>
      </el-dialog>
      <!--邮箱验证dialog-->
      <el-dialog title="邮箱验证" :visible.sync="dialogYxFormVisible" @close="closeYxDialog()" :close-on-click-modal="false">
        <el-form class="el-form demo-form-inline" ref="yxform" :model="yxform" label-width="120px" label-position="right">
          <el-row class="tr mb5" style="text-align: left;margin-left: 10px">
            请输入邮箱<span v-text="this.baseInforForm.dzyx1" style="font-style:italic;margin-right: 2px;"></span>收到的验证码
          </el-row>
          <el-row class="tr mb5">
            <el-col :span="22">
              <el-form-item prop="yzm" label="验证码">
                <el-input size="small" v-model="yxform.yzm" placeholder="验证码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;</el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click.native="closeYxDialog()">取消</el-button>
          <el-button size="small" type="primary" @click.native="yxformSubmit()">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "exhpredictionEdit",
  data() {
    return {
      baseUrl: window.config.baseUrl,
      myHeaders: {XTOKEN: localStorage.getItem("XTOKEN")},
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
      // childrenCpflSelect:[],
      //进度条
      active: 0,
      //要删除的图片路径list
      delPicList: [],
      delPicSrc: "",
      //上传后未保存的图片list
      unsavedPicList: [],
      //基本信息表单
      baseInforForm: {
        zwgsmc: "",
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
        yyzzgs: "",
        src: "",
        imageUrl: ""
      },
      //开票信息表单
      kpxxForm: {
        kplx:"",
        kpgsmc:"",
        tyshxydm:"",
        gsdz:"",
        dhhm:"",
        khyh:"",
        yhzh:""
      },
      //问卷调查表单
      wjdcForm: {
        syxxzl: "",
        wgsjzl: "",
        fmzl: "",
        zycpList: []
      },
      //企业介绍表单
      qyjsForm: {
        qyid: "",
        //logo:'',
        qyjj: "",
        qycpjsVOList: [],
        src: "",
        imageUrl: "",
        reserve1: ""
      },
      //需求意向表单
      xqyxForm: {
      },
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
      //增值税专用发票flag
      isZyfp: false,
      //代理海外产品flag
      ishwdlcp: false,
      //是否高新技术企业flag
      isgxjsqy: false,
      //是否行业信用等级flag
      isSfhyxydj: false,
      //问卷调查产品类型选择标识
      isCplxSelect: false,
      //手机验证表单显示标识
      dialogSjFormVisible: false,
      //邮箱表单显示标识
      dialogYxFormVisible: false,
      //邮箱验证flag
      mailCheck: false,
      //邮箱验证按钮可用flag
      mailBtnDisable : false,
      //上传的文件为pdf标识
      isPdf: false,
      //是否为已驳回的申请
      isYbh: false,
      //有无网址flag
      noWebsit: false,
      //通过验证的邮箱地址（记录以防验证后修改邮箱）
      checkedMailAddress: "",
      //短信验证按钮文字
      messageCodeText: "获取验证码",
      //短信验证码
      messageCodeReal: "",
      //邮箱验证码
      mailCodeReal: "",
      //邮箱验证按钮文字
      mailCodeText: "验证",
      time: 60,
      timer: null,
      time2: 60,
      timer2: null,
      //产品index
      index: 0,

      //行政区划tree
      xzqhDataTree: [],
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
      //产品图片上传参数
      CpjsUpLoadData: {
        qyid: ""
      },
      //上传logo加参数
      upLoadLogoData: {
        uuid: "",
        qyid: ""
      },
      //公司logo
      imageUrl: "",
      //公司性质data
      gsxz_data: [],
      //高新技术级别data
      gxjsjb_data: [],
      //公司主营产品
      zycp_data: [],
      //行业信用等级
      hyxydj_data: [],
      //产品所属分类
      cpssfl_data: [],
      //曾用公司名称
      cygsmc: "",
      //手机验证表单
      sjform: {
        sjh: "",
        yzm: ""
      },
      yxform: {
        yzm: ""
      },
      baseInforRules: {
        zwgsmc: [
          { required: true, message: "请输入中文公司名称", trigger: "blur" },
          { min: 1, max: 100, message: "最多可输入100个字", trigger: "blur" }
        ],
        ywgsmc: [
          { required: false, message: "请输入英文公司名称", trigger: "blur" },
          {
            pattern: /^[a-z\d\.\,\，\|\-\(\)\'\!\<\>\_\*\&\（\） ]+$/i,
            message: "英文公司名称只能输入字母、空格、括号和 .,-|",
            trigger: "blur"
          },
          { min: 1, max: 100, message: "最多可输入100个字符", trigger: "blur" }
        ],
        xzqh: [
          { required: true, message: "请选择邮寄地址省市", trigger: "change" }
        ],
        yjdzxx: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { min: 1, max: 100, message: "最多可输入100个字", trigger: "blur" }
        ],
        bgdh: [{ required: true, message: "请输入办公电话", trigger: "blur" }],
        frdb: [
          { required: true, message: "请输入法人代表", trigger: "blur" },
          { min: 1, max: 25, message: "最多可输入25个字", trigger: "blur" }
        ],
        frdbdh: [
          { required: true, message: "请输入法人代表电话", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "只能输入数字", trigger: "blur" },
          { min: 1, max: 15, message: "电话格式不正确", trigger: "blur" }
        ],
        cz: [
          { pattern: /^[0-9]*$/, message: "只能输入数字", trigger: "blur" },
          { min: 1, max: 30, message: "传真格式不正确", trigger: "blur" }
        ],
        lxr: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          { min: 1, max: 25, message: "最多可输入25个字", trigger: "blur" }
        ],
        lxrsj: [
          { required: true, message: "请输入联系人手机号码", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "只能输入数字", trigger: "blur" },
          { min: 1, max: 30, message: "最多输入30个数字", trigger: "blur" }
        ],
        wz: [
          { required: false, message: "请输入网址", trigger: "blur" },
          { min: 1, max: 100, message: "最多可输入100个字", trigger: "blur" }
        ],
        dzyx1: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9A-Za-z]+(?:\.[0-9A-Za-z]+)+$/,
            message: "仅支持数字和字母组合的邮箱地址，最多可连续出现一个连接符",
            trigger: "blur"
          },
          { min: 1, max: 30, message: "最多输入30个字符", trigger: "blur" }
        ]
      },
      kpxxRules: {
        kplx: [
          { required: true, message: "请选择开票类型", trigger: "change" }
        ],
        kpgsmc: [
          { required: true, message: "请输入开票公司名称", trigger: "blur" },
          { min: 1, max: 100, message: "最多可输入100个字", trigger: "blur" }
        ],
        tyshxydm: [
          {required: true,message: "请输入统一社会信用代码",trigger: "blur"},
          {pattern: /^[A-Za-z0-9 ]+$/, message: "只能输入数字和字母", trigger: "blur"},
          {min: 22, max: 22, message: "请输入18位统一社会信用代码（不包含空格）", trigger: "blur"}
        ],
        gsdz: [
          { required: true, message: "请输入公司地址", trigger: "blur" },
          { min: 1, max: 150, message: "最多可输入150个字", trigger: "blur" }
        ],
        dhhm: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { min: 1, max: 50, message: "最多输入50个数字", trigger: "blur" }
        ],
        khyh: [
          { required: true, message: "请输入开户银行", trigger: "blur" },
          { min: 1, max: 50, message: "最多可输入50个字", trigger: "blur" }
        ],
        yhzh: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          { pattern: /^[0-9 ]*$/, message: "只能输入数字", trigger: "blur" },
          { min: 0, max: 37, message: "最多可输入30位银行账号", trigger: "blur" }
        ]
      },
      wjdcRules: {
        gsxz: [
          { required: true, message: "请选择公司性质", trigger: "change" }
        ],
        sfhwdlcp: [
          { required: true, message: "请选择是否代理海外产品", trigger: "change" }
        ],
        hwdlcppp: [
          { required: true, message: "请输入产品品牌", trigger: "blur" },
          { min: 1, max: 100, message: "最多可输入100个字", trigger: "blur" }
        ],
        fmzl: [
          { required: true, message: "请输入发明专利(项)", trigger: "blur" }
        ],
        syxxzl: [
          { required: true, message: "请输入实用新型专利(项)", trigger: "blur" }
        ],
        wgsjzl: [
          { required: true, message: "请输入外观设计专利(项)", trigger: "blur" }
        ],
        sfgxjsqy: [
          { required: true, message: "请选择是否为高新技术企业", trigger: "change" }
        ],
        gxjsjb: [
          { required: true, message: "请选择高新技术级别", trigger: "change" }
        ],
        sfhyxydj: [
          { required: true, message: "请选择是否在2018年参与中国消防协会消防行业信用等级评价", trigger: "change" }
        ],
        hyxydj: [
          { required: true, message: "请选择行业信用等级", trigger: "change" }
        ],
        zycpList: [
          { required: true, message: "请选择主营产品类型号", trigger: "change" }
        ]
      },
      qyjsRules: {
        qyjj: [
          { required: true, message: "请输入企业简介", trigger: "blur" },
          { min: 1, max: 200, message: "最多可输入200个字", trigger: "blur" }
        ],
        reserve1: [
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-]*$/,
            message: "只能输入字母、数字和英文符号",
            trigger: "blur"
          },
          { min: 1, max: 500, message: "最多可输入500个字符", trigger: "blur" }
        ],
        cpjj: [{ required: true, message: "请输入产品简介", trigger: "blur" }],
        reserve1: [
          {
            pattern: /^[\da-zA-Z \!\?\r\n\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-\。\·\…\！\、\“\”\‘\’\《\》\<\>\【\】\：\；\？]*$/,
            message: "只能输入字母、数字和英文符号",
            trigger: "blur"
          }
        ],
        cplx: [
          {
            validator: (rule, value, callback) => {
              if (value.length == 0) {
                callback(new Error("请选择产品所属分类"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      },
      cpjsRules: {
        cplx: [
          { required: true, message: "请选择产品所属分类", trigger: "change" }
        ],
        cpjj: [
          { required: true, message: "请输入产品简介", trigger: "blur" },
          { min: 1, max: 150, message: "最多可输入150个字", trigger: "blur" }
        ],
        reserve1: [
          {
            pattern: /^[\da-zA-Z \!\?\|\<\>\.\,\，\;\:\'\"\@\#\$\￥\=\+\_\—\%\^\&\*\(\)\（\）\[\]\{\}\\\/\~\`\-]*$/,
            message: "只能输入字母、数字和英文符号",
            trigger: "blur"
          },
          { min: 1, max: 400, message: "最多可输入400个字符", trigger: "blur" }
        ]
      },
      sjformRules: {
        sjh: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确格式的手机号",
            trigger: "blur"
          },
          { min: 1, max: 15, message: "最多可输入15个数字", trigger: "blur" }
        ],
        yzm: [{ required: true, message: "请输入验证码", trigger: "blur" }]
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
    this.getXzqhDataTree();
    this.getGsxz(); //公司性质
    this.getGxjsjb(); //高新技术级别
    this.getCplx(); //产品类型
    this.getHyxydj(); //行业信用等级
    this.getCpssfl(); //产品所属分类
  },
  methods: {
    //行政区划级联选择数据
    getXzqhDataTree: function() {
      let vm = this;
      vm.$axios.post("/codelist/getYjdz").then(
        function(res) {
          vm.xzqhDataTree = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据代码集获取公司性质
    getGsxz: function() {
      let vm = this;
      vm.$axios.get("/codelist/getCodetype/GSXZ").then(
        function(res) {
          vm.gsxz_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据代码集获取高新技术级别
    getGxjsjb: function() {
      let vm = this;
      vm.$axios.get("/codelist/getCodetype/GXJSJB").then(
        function(res) {
          vm.gxjsjb_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据代码集获取公司主营产品tree
    getCplx: function() {
      let vm = this;
      vm.$axios.post("/codelist/getZycpTree/CPLX").then(
        function(res) {
          vm.zycp_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //根据代码集获取行业信用等级
    getHyxydj: function() {
      let vm = this;
      vm.$axios.get("/codelist/getCodetype/HYXYDJ").then(
        function(res) {
          vm.hyxydj_data = res.data.result;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
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
    findInfoByQyid: function(qyid){
      this.loading = true;
      var params = {
        qyid: qyid,
        deleteFlag: "N"
      };
      this.findInfoByVo(params);
    },
    //查询基本信息数据主体方法
    findInfoByVo: function(params){
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
              //曾用公司名称 记录当前中文公司名称
              vm.cygsmc = res.data.result.zwgsmc;
              if (vm.baseInforForm.src !== null &&vm.baseInforForm.src !== "") {
                vm.baseInforForm.imageUrl = vm.baseUrl + "/upload/" + vm.baseInforForm.src;
              }
              //行政区划级联下拉处理
              var xzqhArray = [];
              xzqhArray.push(res.data.result.yjdzsheng);
              xzqhArray.push(res.data.result.yjdzshi);
              vm.baseInforForm.xzqh = xzqhArray;
              vm.baseInforForm.dzyx1 = vm.baseInforForm.dzyx;
              if (vm.baseInforForm.wz == "" || vm.baseInforForm.wz == null ) {
                vm.noWebsit = true;
              }
              vm.jbxxStatus = 1; //修改
              vm.qyid = res.data.result.qyid;
              vm.upLoadData.qyid = res.data.result.qyid;
            } else {
              //已提交，已审核 直接跳转到确认页
              var params = {
                userid: vm.currentUser.userid,
                type: "BJ"
              };
           ///////////////////////////////////////////   loadDivParam("prediction/exhprediction_confirm", params);
            }
          } else {
            vm.jbxxStatus = 0; //新增
            vm.baseInforForm.lxrsj = vm.currentUser.username;
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
            if (vm.kpxxForm.kplx == "1") {
              //专票
              vm.isZyfp = true;
            }
            vm.kpxxStatus = 1; //修改
            vm.kpUuid = res.data.result[0].uuid;
          } else {
            vm.kpxxStatus = 0; //新增
            //开票公司名称：必填，把企业基本信息中的“中文公司名称“带到文本框中，文本框可修改
            vm.kpxxForm.kpgsmc = vm.baseInforForm.zwgsmc;
            //把企业基本信息中的“邮寄地址“带到文本框中，可修改
            var obj = document.getElementById("ShengShiCascader");
            var text = obj.textContent.replace(/\s/gi, ""); // 选中文本
            vm.kpxxForm.gsdz = text + vm.baseInforForm.yjdzxx;
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
            if (vm.wjdcForm.sfhwdlcp == "1") {
              //海外产品代理
              vm.ishwdlcp = true;
            }
            if (vm.wjdcForm.sfgxjsqy == "1") {
              //是否为高新技术企业
              vm.isgxjsqy = true;
            }
            if (vm.wjdcForm.sfhyxydj == "1") {
              //是否在2018年参与中国消防协会消防行业信用等级评价
              vm.isSfhyxydj = true;
            }
            //    this.wjdcForm.zycpList = this.wjdcForm.reserve1.split(",");
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
                    reserve1: result[i].reserve1,
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
                reserve1: "",
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
            //this.xqyxForm = res.data.result[0];
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
      for (var i in this.zycp_data) {
        if (this.zycp_data[i].codeValue == codeValue) {
          if (codeValue == "9000") {
            this.childrenCpfl = [];
            this.childrenCpfl.push({
              codeName: "其他",
              codeValue: "9000",
              children: null
            });
          } else {
            this.childrenCpfl = this.zycp_data[i].children;
          }
        }
      }
      //document.getElementById("childrenRow").innerHTML="";
    },
    //关闭标签
    handleTagClose: function(tag) {
      this.wjdcForm.zycpList.splice(this.wjdcForm.zycpList.indexOf(tag), 1);
    },
    //营业执照图片上传成功回调方法
    picSuccess: function(res, file) {
      this.baseInforForm.src = res.src;
      this.baseInforForm.imageUrl = this.baseUrl + "/upload/" + res.src;
      //this.unsavedPicList.push(res.src);
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
    //营业执照change
    PicChange: function(file, fileList) {
      var fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      var fileNameLength = file.name.length; //取到文件名长度
      var fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const isPng = fileFormat.toLowerCase() == "png";
      const isJpg = fileFormat.toLowerCase() == "jpg";
      this.isPdf = fileFormat.toLowerCase() == "pdf";
      const isLt2M = file.size / 1024 / 1024 <= 2;
      if (!isPng && !isJpg && !this.isPdf) {
        //if(!isPng && !isJpg){
        this.$message.error("只能上传jpg、png格式的图片");
        fileList.splice(-1, 1);
      } else if (!isLt2M) {
        this.$message.error("上传图片大小须小于2MB!");
        fileList.splice(-1, 1);
      } else {
        this.delPicList.push(this.baseInforForm.src);
        //上次营业执照格式为pdf则删除同名pdf文件
        if (this.baseInforForm.yyzzgs == ".pdf") {
          if (
            this.baseInforForm.src != null &&
            this.baseInforForm.src != undefined &&
            this.baseInforForm.src != ""
          ) {
            var path = this.baseInforForm.src.split(".")[0];
            var pdfSrc = path + ".pdf";
            this.delPicList.push(pdfSrc);
          }
        }
        if (isPng || isJpg) {
          this.baseInforForm.yyzzgs = "";
        } else {
          this.baseInforForm.yyzzgs = ".pdf";
        }
      }
    },
    //企业logochange
    LogoChange: function(file, fileList) {
      var fileName = file.name.lastIndexOf("."); //取到文件名开始到最后一个点的长度
      var fileNameLength = file.name.length; //取到文件名长度
      var fileFormat = file.name.substring(fileName + 1, fileNameLength);
      const isPng = fileFormat.toLowerCase() == "png";
      const isJpg = fileFormat.toLowerCase() == "jpg";
      const isLt1M = file.size / 1024 / 1024 <= 1;
      if (!isPng && !isJpg) {
        this.$message.error("只能上传jpg、png格式的图片");
        fileList.splice(-1, 1);
      } else if (!isLt1M) {
        this.$message.error("上传图片大小须小于1MB!");
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
      const isLt2M = file.size / 1024 / 1024 <= 2;
      if (!isPng && !isJpg) {
        this.$message.error("只能上传jpg、png格式的图片");
        fileList.splice(-1, 1);
      } else if (!isLt2M) {
        this.$message.error("上传图片大小须小于2MB!");
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
            if (
              vm.baseInforForm.dzyx1 != null &&
              vm.baseInforForm.dzyx1 != "" &&
              vm.baseInforForm.dzyx1 != undefined &&
              vm.mailCheck == false
            ) {
              vm.$message({
                message: "请对修改后的邮箱进行验证",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else if (
              vm.baseInforForm.src == null ||
              vm.baseInforForm.src == ""
            ) {
              vm.$message({
                message: "请上传企业营业执照",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else {
              vm.loading = true;
              var params = {
                userid: vm.currentUser.userid,
                zwgsmc: vm.baseInforForm.zwgsmc,
                ywgsmc: vm.baseInforForm.ywgsmc,
                frdb: vm.baseInforForm.frdb,
                frdbdh: vm.baseInforForm.frdbdh,
                yjdzsheng: vm.baseInforForm.xzqh[0],
                yjdzshi: vm.baseInforForm.xzqh[1],
                yjdzxx: vm.baseInforForm.yjdzxx,
                bgdh: vm.baseInforForm.bgdh,
                cz: vm.baseInforForm.cz,
                lxr: vm.baseInforForm.lxr,
                lxrsj: vm.baseInforForm.lxrsj,
                wz: vm.baseInforForm.wz,
                dzyx: vm.baseInforForm.dzyx1,
                sjzt: "01", //编辑中
                deleteFlag: "N",
                cjrid: vm.currentUser.userid,
                cjrmc: vm.currentUser.username,
                src: vm.baseInforForm.src,
                yyzzgs: vm.baseInforForm.yyzzgs
              };
              vm.$axios.post("/qyjbxx/doInsertByVo", params).then(
                function(res) {
                  if (res.data.result != null && res.data.result != "") {
                    vm.$message({
                      message: "企业基本信息暂存成功",
                      type: "success"
                    });
                    vm.loading = false;
                    vm.active = 1;
                    vm.isJbxxShow = false;
                    vm.isKpxxShow = true;
                    vm.jbxxStatus = 1;
                    vm.qyid = res.data.result.qyid;
                    vm.baseInforForm.qyid = res.data.result.qyid;
                    vm.upLoadData.qyid = res.data.result.qyid;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findKpxxByQyid(vm.qyid);
                    }
                    //删除旧营业执照
                    if (vm.delPicList.length > 0) {
                      vm.$axios.post("/qycpjs/delPic", vm.delPicList).then(function(res) {
                        vm.delPicList = [];
                      }.bind(vm),
                      function(error) {
                         console.log(error);
                      }
                     );
                    }
                    vm.unsavedPicList = [];
                    //给营业执照移动到qyid文件夹中
                    var params = {
                      qyid: vm.qyid,
                      src: vm.baseInforForm.src,
                      yyzzgs: vm.baseInforForm.yyzzgs
                    };
                    vm.$axios.post("/qyjbxx/movePic", params).then(
                      function(res) {
                        vm.baseInforForm.src = res.data.src;
                      }.bind(vm),
                      function(error) {
                        console.log(error);
                      }
                    );
                  } else {
                    vm.$message({
                      message: "企业基本信息暂存失败",
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
              vm.baseInforForm.dzyx1 != null &&
              vm.baseInforForm.dzyx1 != "" &&
              vm.baseInforForm.dzyx1 != undefined &&
              vm.baseInforForm.dzyx != vm.baseInforForm.dzyx1 &&
              vm.mailCheck == false
            ) {
              vm.$message({
                message: "请对修改后的邮箱进行验证",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else if (
              vm.baseInforForm.src == null ||
              vm.baseInforForm.src == ""
            ) {
              vm.$message({
                message: "请上传企业营业执照",
                type: "warning"
              });
              console.log("error submit!!");
              return false;
            } else {
              vm.loading = true;
              //判断当前公司名称是否修改
              if (vm.cygsmc == vm.baseInforForm.zwgsmc) {
                //未修改
                var params = {
                  qyid: vm.baseInforForm.qyid,
                  zwgsmc: vm.baseInforForm.zwgsmc,
                  ywgsmc: vm.baseInforForm.ywgsmc,
                  frdb: vm.baseInforForm.frdb,
                  frdbdh: vm.baseInforForm.frdbdh,
                  yjdzsheng: vm.baseInforForm.xzqh[0],
                  yjdzshi: vm.baseInforForm.xzqh[1],
                  yjdzxx: vm.baseInforForm.yjdzxx,
                  bgdh: vm.baseInforForm.bgdh,
                  cz: vm.baseInforForm.cz,
                  lxr: vm.baseInforForm.lxr,
                  lxrsj: vm.baseInforForm.lxrsj,
                  wz: vm.baseInforForm.wz,
                  dzyx: vm.baseInforForm.dzyx1,
                  //yyzz:vm.baseInforForm.yyzz,
                  xgrid: vm.currentUser.userid,
                  xgrmc: vm.currentUser.username,
                  src: vm.baseInforForm.src,
                  yyzzgs: vm.baseInforForm.yyzzgs
                };
              } else {
                //修改了公司名称，传参cygsmc
                var params = {
                  qyid: vm.baseInforForm.qyid,
                  zwgsmc: vm.baseInforForm.zwgsmc,
                  ywgsmc: vm.baseInforForm.ywgsmc,
                  frdb: vm.baseInforForm.frdb,
                  frdbdh: vm.baseInforForm.frdbdh,
                  yjdzsheng: vm.baseInforForm.xzqh[0],
                  yjdzshi: vm.baseInforForm.xzqh[1],
                  yjdzxx: vm.baseInforForm.yjdzxx,
                  bgdh: vm.baseInforForm.bgdh,
                  cz: vm.baseInforForm.cz,
                  lxr: vm.baseInforForm.lxr,
                  lxrsj: vm.baseInforForm.lxrsj,
                  wz: vm.baseInforForm.wz,
                  dzyx: vm.baseInforForm.dzyx1,
                  //yyzz:vm.baseInforForm.yyzz,
                  xgrid: vm.currentUser.userid,
                  xgrmc: vm.currentUser.username,
                  src: vm.baseInforForm.src,
                  yyzzgs: vm.baseInforForm.yyzzgs,
                  cygsmc: vm.cygsmc
                };
              }
              vm.$axios.post("/qyjbxx/doUpdateByVO", params).then(
                function(res) {
                  if (res.data.result > 0) {
                    vm.cygsmc = vm.baseInforForm.zwgsmc;
                    vm.$message({
                      message: "企业基本信息暂存成功",
                      type: "success"
                    });
                    vm.loading = false;
                    vm.active = 1;
                    vm.isJbxxShow = false;
                    vm.isKpxxShow = true;
                    if (vm.qyid != null && vm.qyid != "") {
                      vm.findKpxxByQyid(vm.qyid);
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
                      message: "企业基本信息暂存失败",
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
          var yhzh_str = null;
          if (
            vm.kpxxForm.yhzh != null &&
            vm.kpxxForm.yhzh != "" &&
            vm.kpxxForm.yhzh != undefined
          ) {
            yhzh_str = vm.kpxxForm.yhzh.replace(/ /g, "");
          } else {
            yhzh_str = "";
          }
          if (vm.kpxxStatus == 0) {
            //新增
            var params = {
              qyid: vm.qyid,
              kplx: vm.kpxxForm.kplx,
              kpgsmc: vm.kpxxForm.kpgsmc,
              tyshxydm: vm.kpxxForm.tyshxydm.replace(/ /g, ""),
              gsdz: vm.kpxxForm.gsdz,
              dhhm: vm.kpxxForm.dhhm,
              khyh: vm.kpxxForm.khyh,
              yhzh: yhzh_str,
              deleteFlag: "N",
              cjrid: vm.currentUser.userid,
              cjrmc: vm.currentUser.username
            };
            vm.$axios.post("/qykpxx/doInsertByVo", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "企业开票信息暂存成功",
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
                    message: "企业开票信息暂存失败",
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
              kplx: vm.kpxxForm.kplx,
              kpgsmc: vm.kpxxForm.kpgsmc,
              tyshxydm: vm.kpxxForm.tyshxydm.replace(/ /g, ""),
              gsdz: vm.kpxxForm.gsdz,
              dhhm: vm.kpxxForm.dhhm,
              khyh: vm.kpxxForm.khyh,
              yhzh: yhzh_str,
              xgrid: vm.currentUser.userid,
              xgrmc: vm.currentUser.username
            };
            vm.$axios.post("/qykpxx/doUpdateByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "企业开票信息暂存成功",
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
                    message: "企业开票信息暂存失败",
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
              gsxz: vm.wjdcForm.gsxz,
              sfhwdlcp: vm.wjdcForm.sfhwdlcp,
              hwdlcppp: vm.wjdcForm.hwdlcppp,
              fmzl: vm.wjdcForm.fmzl,
              syxxzl: vm.wjdcForm.syxxzl,
              wgsjzl: vm.wjdcForm.wgsjzl,
              sfgxjsqy: vm.wjdcForm.sfgxjsqy,
              gxjsjb: vm.wjdcForm.gxjsjb,
              zycp: zycp.substr(0, zycp.length - 1), //eg.1001,1002,1003
              sfhyxydj: vm.wjdcForm.sfhyxydj,
              hyxydj: vm.wjdcForm.hyxydj,
              deleteFlag: "N",
              cjrid: vm.currentUser.userid,
              cjrmc: vm.currentUser.username,
              reserve1: reserve1.substr(0, reserve1.length - 1) //eg.1001消防车
            };
            vm.$axios.post("/qywjdc/doInsertByVo", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "企业问卷调查暂存成功",
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
                    message: "企业问卷调查暂存失败",
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
              gsxz: vm.wjdcForm.gsxz,
              sfhwdlcp: vm.wjdcForm.sfhwdlcp,
              hwdlcppp: vm.wjdcForm.hwdlcppp,
              fmzl: vm.wjdcForm.fmzl,
              syxxzl: vm.wjdcForm.syxxzl,
              wgsjzl: vm.wjdcForm.wgsjzl,
              sfgxjsqy: vm.wjdcForm.sfgxjsqy,
              gxjsjb: vm.wjdcForm.gxjsjb,
              zycp: zycp.substr(0, zycp.length - 1), //eg.1001,1002,1003
              sfhyxydj: vm.wjdcForm.sfhyxydj,
              hyxydj: vm.wjdcForm.hyxydj,
              xgrid: vm.currentUser.userid,
              xgrmc: vm.currentUser.username,
              reserve1: reserve1.substr(0, reserve1.length - 1) //eg.1001消防车
            };
            vm.$axios.post("/qywjdc/doUpdateByVO", params).then(
              function(res) {
                if (res.data.result > 0) {
                  vm.$message({
                    message: "企业问卷调查暂存成功",
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
                    message: "企业问卷调查暂存失败",
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
          //判断最后一个card产品信息是否填全
          var cp = vm.qyjsForm.qycpjsVOList[
            vm.qyjsForm.qycpjsVOList.length - 1
          ];
          if (cp.cplx == "" || cp.cpjj == "" || cp.src == "") {
            vm.$message({
              message: "请完整填写产品信息",
              type: "warning"
            });
            return false;
          } else if (
            vm.qyjsForm.imageUrl == null ||
            vm.qyjsForm.imageUrl == ""
          ) {
            //判断企业logo是否上传
            vm.$message({
              message: "请上传企业logo",
              type: "warning"
            });
            console.log("error submit!!");
            return false;
          } else {
            //信息填写完整
            var tempList = [];
            for (var i in vm.qyjsForm.qycpjsVOList) {
              var qycpjsVO = vm.qyjsForm.qycpjsVOList[i];
              //产品类型级联下拉处理
              if (qycpjsVO.cplx.constructor == Array && qycpjsVO.cplx.length > 0) {
                var length = qycpjsVO.cplx.length;
                var cplx_temp = qycpjsVO.cplx[length - 1];
              }
              var obj_temp = {
                uuid: qycpjsVO.uuid,
                qyid: vm.qyid,
                src: qycpjsVO.src,
                cplx: cplx_temp,
                cpjj: qycpjsVO.cpjj,
                reserve1: qycpjsVO.reserve1
              };
              tempList.push(obj_temp);
            }
            if (vm.cpjsStatus == 0) {
              //新增
              vm.loading = true;
              var params = {
                qyid: vm.qyid,
                qyjj: vm.qyjsForm.qyjj,
                reserve1: vm.qyjsForm.reserve1,
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
                      message: "企业产品介绍暂存成功",
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
                      vm.$axios.post("/qycpjs/delPic", vm.delPicList).then(function(res) {
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
                      message: "企业产品介绍暂存失败",
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
                reserve1: vm.qyjsForm.reserve1,
                qycpjsVOList: tempList,
                xgrid: vm.currentUser.userid,
                xgrmc: vm.currentUser.username
              };
              vm.$axios.post("/qyjs/doUpdateQyCpByVO", params).then(
                function(res) {
                  if (res.data.result != null && res.data.result != "") {
                    //vm.upLoadLogoData.uuid = res.data.result.uuid;
                    //vm.$refs.uploadLogo.submit();
                    vm.$message({
                      message: "企业产品介绍暂存成功",
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
                      vm.$axios.post("/qycpjs/delPic", vm.delPicList).then(function(res) {
                        vm.delPicList = [];
                      }.bind(vm),
                      function(error) {
                        console.log(error);
                      });
                    }
                    vm.unsavedPicList = [];
                  } else {
                    vm.$message({
                      message: "企业产品介绍暂存失败",
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
                  message: "企业参展展位需求意向暂存成功",
                  type: "success"
                });
                vm.loading = false;
                vm.active = 5;
                vm.xqyxStatus = 1;
                vm.submit();
              } else {
                vm.$message({
                  message: "企业参展展位需求意向暂存失败",
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
                  message: "企业参展展位需求意向暂存成功",
                  type: "success"
                });
                vm.loading = false;
                vm.active = 5;
                //提交展位预报名信息
                vm.submit();
              } else {
                vm.$message({
                  message: "企业参展展位需求意向暂存失败",
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
          message: "请至少填写一种展位需求意向",
          type: "warning"
        });
        console.log("error submit!!");
        return false;
      }
    },
    //提交
    submit: function() {
      if (this.currentUser.deptid == "ZSYH") {
        //如果是展商用户跳转到确认页
        var params = {
          userid: this.currentUser.userid,
          type: "BJ"
        };
    ///////////////////////////////////    loadDivParam("prediction/exhprediction_confirm", params);
      } else {
        //如果是管理员跳转到列表页
      ////////////////////////////////////////  loadDivParam("prediction/exhprediction_list");
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
    //发票类型change
    fplxChange: function() {
      if (this.kpxxForm.kplx == "1") {
        //增值税专用发票
        this.isZyfp = true;
      } else {
        this.isZyfp = false;
        this.kpxxForm.dhhm = "";
        this.kpxxForm.khyh = "";
        this.kpxxForm.yhzh = "";
      }
    },
    //是否代理海外产品change
    sfhwdlcpChange: function() {
      if (this.wjdcForm.sfhwdlcp == "1") {
        //是
        this.ishwdlcp = true;
      } else {
        this.ishwdlcp = false;
        this.wjdcForm.hwdlcppp = "";
      }
    },
    //是否高新技术企业change
    sfgxjsqyChange: function() {
      if (this.wjdcForm.sfgxjsqy == "1") {
        //是
        this.isgxjsqy = true;
      } else {
        this.isgxjsqy = false;
        this.wjdcForm.gxjsjb = "";
      }
    },
    //是否行业信用等级change
    sfhyxydjChange: function() {
      if (this.wjdcForm.sfhyxydj == "1") {
        //是
        this.isSfhyxydj = true;
      } else {
        this.isSfhyxydj = false;
        this.wjdcForm.hyxydj = "";
      }
    },
    //新增产品card
    addDomain: function() {
      //判断最后一个card产品信息是否填全
      var cp = this.qyjsForm.qycpjsVOList[
        this.qyjsForm.qycpjsVOList.length - 1
      ];
      if (cp.cplx == "" || cp.cpjj == "" || cp.src == "") {
        this.$message({
          message: "请完整填写产品信息中的全部内容",
          type: "warning"
        });
        return false;
      } else {
        if (this.qyjsForm.qycpjsVOList.length < 6) {
          this.qyjsForm.qycpjsVOList.push({
            qyid: this.qyid,
            cplx: [],
            cpjj: "",
            reserve1: "",
            src: "",
            imageUrl: "",
            key: Date.now()
          });
        } else {
          this.$message({
            message: "最多可添加6条产品介绍",
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
          message: "请最少填写一条产品介绍",
          type: "warning"
        });
      }
    },
    //手机修改验证
    openSjYz: function() {
      this.dialogSjFormVisible = true;
    },
    //关闭手机验证对话
    closeDialog: function() {
      this.dialogSjFormVisible = false;
      this.sjform.sjh = "";
      this.sjform.yzm = "";
    },
    //获取短信验证码
    getMessageCode: function() {
      let vm = this;
      vm.sjform.yzm = "";
      if (/^1[34578]\d{9}$/.test(vm.sjform.sjh)) {
        vm.messageCodeText = "发送中...";
        $("#mobile-btn").attr("disabled", "disabled");
        vm.$axios.get("/signin/sendMessage?phone=" + vm.sjform.sjh).then(
          function(res) {
            vm.messageCodeReal = res.data.msg;
            var count = vm.time;
            vm.timer = setInterval(() => {
              if (count == 0) {
                clearInterval(vm.timer);
                vm.timer = null;
                vm.messageCodeText = "获取验证码";
                $("#mobile-btn").removeAttr("disabled");
              } else {
                vm.messageCodeText = count + "秒后获取";
                count--;
                $("#mobile-btn").attr("disabled", "disabled");
              }
            }, 1000);
          }.bind(vm),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    //手机验证码form提交
    sjformSubmit: function(formName) {
      if (this.sjform.sjh != null && this.sjform.sjh != "") {
        if (
          this.sjform.yzm == this.messageCodeReal &&
          this.messageCodeReal != ""
        ) {
          this.baseInforForm.lxrsj = this.sjform.sjh;
          this.dialogSjFormVisible = false;
        } else {
          this.$message({
            message: "验证码错误",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "请输入手机号",
          type: "error"
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
          message: "邮箱验证成功",
          type: "success"
        });
      } else {
        this.$message({
          message: "验证码错误",
          type: "error"
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
          message: "邮箱格式不正确",
          type: "warning"
        });
        return false;
      } else {
        //查询邮箱是否注册
        vm.$axios.get("/qyjbxx/getMailNum/" + vm.baseInforForm.dzyx1 + "/static").then(function(res) {
              //session失效
              if (res.data.result == undefined) {
                vm.$confirm("用户登陆超时，请重新登陆。", "提示", {
                  confirmButtonText: "是",
                  cancelButtonText: "否",
                  type: "warning"
                })
                  .then(() => {
                    window.location.href = "/templates/login.html";
                  })
                  .catch(() => {});
              } else if (res.data.result == 0) {
                vm.mailCodeText = "发送中...";
              //  $("#mail-btn").attr("disabled", "disabled");
                vm.mailBtnDisable = true;
                vm.$axios.get("/signin/sendMail?mail=" + vm.baseInforForm.dzyx1).then(
                    function(res) {
                      vm.mailCodeReal = res.data.msg;
                      var count = vm.time2;
                      vm.timer2 = setInterval(() => {
                        if (count == 0) {
                          clearInterval(vm.timer2);
                          vm.timer2 = null;
                          vm.mailCodeText = "验证";
                          //////$("#mail-btn").removeAttr("disabled");
                          this.mailBtnDisable = false;
                        } else {
                          vm.mailCodeText = count + "秒后获取";
                          count--;
                        //  $("#mail-btn").attr("disabled", "disabled");
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
                  message: "此邮箱已通过验证",
                  type: "success"
                });
                return false;
              } else {
                vm.$message({
                  message: "此邮箱已被注册,请更换邮箱",
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

    //关闭邮箱验证对话
    closeYxDialog: function() {
      this.dialogYxFormVisible = false;
      //this.yxform.yx = "";
      this.yxform.yzm = "";
    },
    //邮箱change判断需不需要重新验证
    dzyxChange: function() {
      if (
        this.checkedMailAddress != this.baseInforForm.dzyx1 &&
        this.checkedMailAddress != ""
      ) {
        this.mailCheck = false;
      }
    },
    addBlankYhzh: function() {
      if (
        this.kpxxForm.yhzh != undefined &&
        this.kpxxForm.yhzh != "" &&
        this.kpxxForm.yhzh != null
      ) {
        this.kpxxForm.yhzh = this.kpxxForm.yhzh.replace(/\s/g, "").replace(/(\w{4})(?=\w)/g, "$1 ");
      }
    },
    addBlankXydm: function() {
      if (
        this.kpxxForm.tyshxydm != undefined &&
        this.kpxxForm.tyshxydm != "" &&
        this.kpxxForm.tyshxydm != null
      ) {
        this.kpxxForm.tyshxydm = this.kpxxForm.tyshxydm.replace(/\s/g, "").replace(/(\w{4})(?=\w)/g, "$1 ");
      }
    },
    


  }
};
</script>

<style lang="scss">
#exhpredictionEdit{
  .mb5{
    margin-bottom:5px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
}

</style>
