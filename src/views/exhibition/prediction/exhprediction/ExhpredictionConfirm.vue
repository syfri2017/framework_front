<template>
  <div id="exhpredictionConfirm">
    <div class="main-container" v-loading="this.loading" element-loading-text="加载中">
      <el-row id="btnB">
        <el-button type="danger" v-if="editPage==false && userType=='CHN'" class="redFont topScroll remark">
          (1) 贵公司此次填写的展位需求仅为参展意向调查。实际展位选择结果需以贵公司在展位选择阶段的最终自主选择结果为准。
          <br>(2) 贵公司所提供的营业执照、法人代表及企业联系人相关信息仅用于贵公司申请参加第十八届国际消防展的审核工作；
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贵公司自主填写的公司信息及产品信息则将显示在网站的产品及展商名录内容里。
        </el-button>
        <el-button type="danger" v-if="editPage==false && userType=='ENG'" class="redFont topScroll remark">
          (1) Booth Requirement Information we collect in Part 5 will be used as references for the booth design.
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It is Your Booth Selection at our going-to-open online Booth selection process that will be your final choice.
          <br>(2) The information of legal representative and contact person you have filled in will only be used as references for censors of our commission,
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;in order to guarantee all exhibitors are from the fire and safety industry.
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Company introduction, product introduction and related information will be displayed in the company list and product list on our website,
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;which targets to provide a longer promotion period through website channel for our exhibitors.
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have any concern about this, please contact the commission.
        </el-button>
        <el-button type="success" v-if="editPage&&jbxxData.shzt==='03'&&zwxzzt==='00' && userType=='CHN'" class="topScroll remark">
          经审核您的信息已经通过
          <!-- ，请进行展位选择。 -->
          <i class="el-icon-warning"></i>
        </el-button>
        <el-button type="success" v-if="editPage&&jbxxData.shzt==='03'&&zwxzzt==='00' && userType=='ENG'" class="topScroll remark">
          Your information has been approved
          <!-- ，请进行展位选择。 -->
          <i class="el-icon-warning"></i>
        </el-button>
        <el-button type="warning" icon="el-icon-warning" v-if="editPage&&jbxxData.shzt==='01' && userType=='CHN'" class="topScroll remark">
          展会报名信息已经提交，请等待审核，审核时间大概需要5个工作日！
          <i class="el-icon-warning"></i>
        </el-button>
        <el-button type="warning" icon="el-icon-warning" v-if="editPage&&jbxxData.shzt==='01' && userType=='ENG'" class="topScroll remark">
          Your information has been submitted, please waiting for the audit. The audited time will take about 5 working days.
          <i class="el-icon-warning"></i>
        </el-button>
        <el-button type="danger" icon="el-icon-warning" v-if="editPage&&jbxxData.shzt==='03'&&zwxzzt==='01' && userType=='CHN'" class="topScroll remark">
          已选展位:
          <span v-text="yxzwxx"></span>
          <i class="el-icon-warning"></i>
        </el-button>
        <el-button type="danger" icon="el-icon-warning" v-if="editPage&&jbxxData.shzt==='03'&&zwxzzt==='01' && userType=='ENG'" class="topScroll remark">
          You have selected Booths of
          <span v-text="yxzwxx"></span>. Please wait for the committee to send you booth contract through fireexpo@cfpa.cn.
          <br> If you have any concerns, pleasd feel free to contact us at this email.
          <i class="el-icon-warning"></i>
        </el-button>
      </el-row>
      <!--中文步骤条-->
      <div id="steps" v-if="editPage==false && userType=='CHN'" style="margin-top:80px;">
        <el-steps :active="5" align-center finish-status="success" class="pt10">
          <el-step title="企业基本信息"></el-step>
          <el-step title="企业开票信息"></el-step>
          <el-step title="企业问卷调查"></el-step>
          <el-step title="企业和产品介绍"></el-step>
          <el-step title="企业参展展位需求意向"></el-step>
          <el-step title="确认并提交"></el-step>
        </el-steps>
      </div>
      <!--英文步骤条-->
      <div id="steps" v-if="editPage==false && userType=='ENG'" style="margin-top:170px;">
        <el-steps :active="5" align-center finish-status="success" class="pt10">
          <el-step title="Brief Information"></el-step>
          <el-step title="Invoice"></el-step>
          <el-step title="Product Category"></el-step>
          <el-step title="Company and Product Details"></el-step>
          <el-step title="Questionnaire"></el-step>
          <el-step title="confirmation and Submission"></el-step>
        </el-steps>
      </div>
      <!--企业基本信息-->
      <div id="qyjbxx" class="mb5">
        <el-row class="mb10" v-if="editPage==false" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业基本信息</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;" class="f15">Brief Company Information</strong>
        </el-row>
        <el-row class="mb10 mt30" v-if="editPage&&(jbxxData.shzt==='03'||jbxxData.shzt==='01')" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业基本信息</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;" class="f15">Brief Company Information</strong>
        </el-row>
        <!--中文-->
        <el-row v-if="userType=='CHN'">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row>
              <el-col :span="12">
                <strong class="vt">营业执照：</strong>
                <img v-if="jbxxData.imageUrl!==''" :src="jbxxData.imageUrl" @click="imgPreview(jbxxData.imageUrl)" style="max-width:100%;max-height:140px;" class="poi">
                <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
              </el-col>
              <el-col :span="12">
                <el-row class="mb10">
                  <strong>办公电话：</strong>
                  <span v-text="jbxxData.bgdh||'无'"></span>
                </el-row>
                <el-row class="mb10">
                  <strong>传真：</strong>
                  <span v-text="jbxxData.cz||'无'"></span>
                </el-row>
                <el-row class="mb10">
                  <strong>网址：</strong>
                  <span v-text="jbxxData.wz||'无'"></span>
                </el-row>
                <el-row class="mb10">
                  <strong>电子邮箱：</strong>
                  <span v-text="jbxxData.dzyx||'无'"></span>
                </el-row>
                <el-row class="mb10">
                  <strong>法人代表：</strong>
                  <span v-text="jbxxData.frdb||'无'"></span>
                </el-row>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>中文公司名称：</strong>
                <span v-text="jbxxData.zwgsmc||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>法人代表电话：</strong>
                <span v-text="jbxxData.frdbdh||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>英文公司名称：</strong>
                <span v-text="jbxxData.ywgsmc||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>联系人：</strong>
                <span v-text="jbxxData.lxr||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>邮寄地址：</strong>
                <span v-text="jbxxData.yjdz||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>联系人手机：</strong>
                <span v-text="jbxxData.lxrsj||'无'"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--英文-->
        <el-row v-if="userType=='ENG'">
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22">
              <strong>Company Name：</strong>
              <span v-text="jbxxData.ywgsmc||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="22">
              <strong>Company Address：</strong>
              <span v-text="jbxxData.yjdz||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <strong>Postal Code：</strong>
              <span v-text="jbxxData.reserve2||'no'"></span>
            </el-col>
            <el-col :span="11">
              <strong>Legal Representative：</strong>
              <span v-text="jbxxData.frdb||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <strong>Phone：</strong>
              <span v-text="jbxxData.bgdh||'no'"></span>
            </el-col>
            <el-col :span="11">
              <strong>Legal Representative's Phone：</strong>
              <span v-text="jbxxData.frdbdh||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <strong>Fax：</strong>
              <span v-text="jbxxData.cz||'no'"></span>
            </el-col>
            <el-col :span="11">
              <strong>Contact Person：</strong>
              <span v-text="jbxxData.lxr||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <strong>Email：</strong>
              <span v-text="jbxxData.email||'no'"></span>
            </el-col>
            <el-col :span="11">
              <strong>Contact Person's Phone：</strong>
              <span v-text="jbxxData.lxrsj||'no'"></span>
            </el-col>
          </el-row>
          <el-row class="mb10">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="11">
              <strong>Standby Email for Password Retrieve：</strong>
              <span v-text="jbxxData.dzyx||'no'"></span>
            </el-col>
            <el-col :span="11">
              <strong>Company Website：</strong>
              <span v-text="jbxxData.wz||'no'"></span>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <!-- 企业已选展位 -->
      <div id="qyyxzw" v-if="sfkqYxzwzs">
        <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业已选展位</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;">Booths you have selected</strong>
        </el-row>
        <el-row v-for="data in yxzwData" :key="data.zwh">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <el-col :span="12">
                <strong v-if="userType=='CHN'">展位编号：</strong>
                <span v-if="userType=='CHN'" v-text="data.zwh||'无'"></span>
                <strong v-if="userType=='ENG'">Booth No：</strong>
                <span v-if="userType=='ENG'" v-text="data.zwh||'no'"></span>
              </el-col>
              <el-col :span="12">
                <strong v-if="userType=='CHN'">展位面积：</strong>
                <span v-if="userType=='CHN'" v-text="data.zwmj||'无'"></span>
                <strong v-if="userType=='ENG'">Booth Area(m2)：</strong>
                <span v-if="userType=='ENG'" v-text="data.zwmj||'no'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong v-if="userType=='CHN'">横向长度：</strong>
                <span v-if="userType=='CHN'" v-text="data.zwcd||'无'"></span>
                <strong v-if="userType=='ENG'">Horizontal Length(m)：</strong>
                <span v-if="userType=='ENG'" v-text="data.zwcd||'no'"></span>
              </el-col>
              <el-col :span="12">
                <strong v-if="userType=='CHN'">纵向长度：</strong>
                <span v-if="userType=='CHN'" v-text="data.zwkd||'无'"></span>
                <strong v-if="userType=='ENG'">Vertical Length(m)：</strong>
                <span v-if="userType=='ENG'" v-text="data.zwkd||'no'"></span>
              </el-col>
            </el-row>
            <el-row class="mb20">
              <el-col :span="12">
                <strong v-if="userType=='CHN'">展位类型：</strong>
                <span v-if="userType=='CHN'" v-text="data.zwlb||'无'"></span>
                <strong v-if="userType=='ENG'">Booth type：</strong>
                <span v-if="userType=='ENG'" v-text="data.zwlb||'no'"></span>
              </el-col>
              <el-col :span="12">
                <strong v-if="userType=='CHN'">出口类型：</strong>
                <span v-if="userType=='CHN'" v-text="data.cklx||'无'"></span>
                <strong v-if="userType=='ENG'">Export type：</strong>
                <span v-if="userType=='ENG'" v-text="data.cklx||'no'"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!--企业开票信息-->
      <div id="qykpxx" class="mb5">
        <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业开票信息</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;" class="f15">Invoice Information</strong>
        </el-row>
        <!--中文-->
        <el-row v-if="userType=='CHN'">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>开票公司名称：</strong>
              <span v-text="kpxxData.kpgsmc||'无'"></span>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>开票类型：</strong>
                <span v-text="kpxxData.kplxmc||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>统一社会信用代码：</strong>
                <span v-text="kpxxData.tyshxydm||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>公司地址：</strong>
                <span v-text="kpxxData.gsdz||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>电话号码：</strong>
                <span v-text="kpxxData.dhhm||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>开户银行：</strong>
                <span v-text="kpxxData.khyh||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>银行账号：</strong>
                <span v-text="kpxxData.yhzh||'无'"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--英文-->
        <el-row v-if="userType=='ENG'">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>Company Name on the Invoice：</strong>
              <span v-text="kpxxData.kpgsmc||'no'"></span>
            </el-row>
            <el-row class="mb10">
              <strong>Customer Contact：</strong>
              <span v-text="kpxxData.gsdz||'no'"></span>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>Fax：</strong>
                <span v-text="kpxxData.yhzh||'no'"></span>
              </el-col>
              <el-col :span="12">
                <strong>Phone Number：</strong>
                <span v-text="kpxxData.dhhm||'no'"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!--问卷调查-->
      <div id="qywjdc" class="mb5">
        <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业问卷调查</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;" class="f15">Major Product Information</strong>
        </el-row>
        <!--中文-->
        <el-row v-if="userType=='CHN'">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>公司性质：</strong>
              <span v-text="wjdcData.gsxzmc||'无'"></span>
            </el-row>
            <el-row class="mb10">
              <strong>主营产品：</strong>
              <span v-text="wjdcData.zycp||'无'"></span>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>是否代理海外产品：</strong>
                <span v-text="wjdcData.sfhwdlcp==1?'是':wjdcData.sfhwdlcp==0?'否':'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>海外代理产品品牌：</strong>
                <span v-text="wjdcData.hwdlcppp||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>是否高新技术企业：</strong>
                <span v-text="wjdcData.sfgxjsqy==1?'是':wjdcData.sfgxjsqy==0?'否':'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>高新技术级别：</strong>
                <span v-text="wjdcData.gxjsjbmc||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>是否获得行业信用等级：</strong>
                <span v-text="wjdcData.sfhyxydj==1?'是':wjdcData.sfhyxydj==0?'否':'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>行业信用等级：</strong>
                <span v-text="wjdcData.hyxydjmc||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>发明专利(项)：</strong>
                <span v-text="wjdcData.fmzl||'无'"></span>
              </el-col>
              <el-col :span="12">
                <strong>实用新型专利(项)：</strong>
                <span v-text="wjdcData.syxxzl||'无'"></span>
              </el-col>
            </el-row>
            <el-row class="mb10">
              <el-col :span="12">
                <strong>外观设计专利(项)：</strong>
                <span v-text="wjdcData.wgsjzl||'无'"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!--英文-->
        <el-row v-if="userType=='ENG'" class="mb10">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <strong>Category of Your Major Products：</strong>
            <span v-text="wjdcData.zycp||'no'"></span>
          </el-col>
        </el-row>
      </div>
      <!--企業產品介紹-->
      <div id="qycpjs" class="mb5">
        <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong v-if="userType=='CHN'" style="color: #463132;">企业和产品介绍</strong>
          <strong v-if="userType=='ENG'" style="color: #463132;" class="f15">Company Information Details and Product Examples</strong>
        </el-row>
        <el-row class="mb10">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="11">
            <strong v-if="userType=='CHN'" class="vt">企业Logo：</strong>
            <strong v-if="userType=='ENG'" class="vt">Company Logo：</strong>
            <img v-if="qyjsData.imageUrl!==''" :src="qyjsData.imageUrl" @click="imgPreview(qyjsData.imageUrl)" style="max-width:100%;max-height:140px;" class="poi">
            <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
          </el-col>
          <el-col :span="11">
            <strong v-if="userType=='CHN'">企业简介：</strong>
            <span v-if="userType=='CHN'" v-text="qyjsData.qyjj||'无'"></span>
            <strong v-if="userType=='ENG'">Company Introduction：</strong>
            <span v-if="userType=='ENG'" v-text="qyjsData.qyjj||'no'"></span>
            <br>
            <strong v-if="userType=='CHN'">企业英文简介：</strong>
            <span v-if="userType=='CHN'" v-text="qyjsData.reserve1||'无'"></span>
          </el-col>
        </el-row>
        <!--产品介绍中文-->
        <el-row v-if="userType=='CHN'" class="mb10">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>产品介绍：</strong>
            </el-row>
            <el-form id="cpjs" v-if="cpjsData.length>0" :inline="true" style="width: 100%;" class="demo-form-inline">
              <el-form-item v-for="(cpjs,index) in cpjsData" style="width: 49%;" :key="index">
                <el-card class="mb10 card_style" id="cpjsImg">
                  <el-row class="h100">
                    <el-col :span="5" class="h100 tc">
                      <img v-if="cpjs.imageUrl!==''" :src="cpjs.imageUrl" @click="imgPreview(cpjs.imageUrl)" class="poi">
                      <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
                    </el-col>
                    <el-col :span="19" style="line-height: 24px;" class="pl15">
                      <strong>产品类型：</strong>
                      <span v-text="cpjs.cplxmc||'无'"></span>
                      <br>
                      <strong>产品简介：</strong>
                      <span v-text="cpjs.cpjj||'无'"></span>
                      <br>
                      <strong>产品英文简介：</strong>
                      <span v-text="cpjs.reserve1||'无'"></span>
                    </el-col>
                  </el-row>
                </el-card>
              </el-form-item>
            </el-form>
            <span v-else>暂无产品信息</span>
          </el-col>
        </el-row>
        <!--产品介绍英文-->
        <el-row v-if="userType=='ENG'" class="mb10">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>Product Introduction：</strong>
            </el-row>
            <el-form id="cpjs" v-if="cpjsData.length>0" :inline="true" style="width: 100%;" class="demo-form-inline">
              <el-form-item v-for="(cpjs,index) in cpjsData" style="width: 49%;" :key="index">
                <el-card class="mb10 card_style" id="cpjsImg">
                  <el-row class="h100">
                    <el-col :span="5" class="h100 tc">
                      <img v-if="cpjs.imageUrl!==''" :src="cpjs.imageUrl" class="poi" @click="imgPreview(cpjs.imageUrl)">
                      <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
                    </el-col>
                    <el-col :span="19" style="line-height: 24px;" class="pl15">
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
            <span v-else>no product</span>
          </el-col>
        </el-row>
      </div>
      <!--企業展位意向-->
      <div id="qyzwyx" class="mb20">
        <el-row class="mb10" style="border-bottom:1px solid #463132;line-height: 29px;">
          <strong style="color: #463132;vertical-align: -webkit-baseline-middle;">
            <span v-if="userType=='CHN'">企业参展展位需求意向</span>
            <span v-if="userType=='ENG'" class="f15">Questionnaire on your Booth Requirement</span>
          </strong>
          <el-button v-if="editZwyx&&editPage" type="success" icon="el-icon-document" size="small" class="r" @click="saveClick">
            <span v-if="userType=='CHN'">保存</span>
            <span v-if="userType=='ENG'">Save</span>
          </el-button>
          <el-button v-else-if="editPage" type="primary" icon="el-icon-edit" size="small" class="r" @click="editZwyx=true">
            <span v-if="userType=='CHN'">修改</span>
            <span v-if="userType=='ENG'">Edit</span>
          </el-button>
        </el-row>
        <!--中文-->
        <el-row v-if="userType=='CHN'">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>标准展位：</strong>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.bzzwgs" :min="0" :max="6" placeholder="标准展位" :precision="0"></el-input-number>
              <span v-else v-text="(zwyxForm.bzzwgs==''||zwyxForm.bzzwgs==null)?'无':zwyxForm.bzzwgs+' 个'"></span>
              &nbsp;&nbsp;(标准展位：每个12平方米)
            </el-row>
            <el-row class="mb10">
              <strong>室内展位：</strong>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.sngdzw" :min="24" :max="1000" placeholder="室内光地展位" :precision="0"></el-input-number>
              <span v-else v-text="(zwyxForm.sngdzw==''||zwyxForm.sngdzw==null)?'无':zwyxForm.sngdzw+' m²'"></span>
              &nbsp;&nbsp;(室内光地展位：需要特装搭建，24平方米起)
            </el-row>
            <el-row class="mb10">
              <strong>室外展位：</strong>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.swgdzw" :min="0" :max="2000" placeholder="室外光地展位" :precision="0"></el-input-number>
              <span v-else v-text="(zwyxForm.swgdzw==''||zwyxForm.swgdzw==null)?'无':zwyxForm.swgdzw+' m²'"></span>
              &nbsp;&nbsp;(室外光地展位：仅限消防
              <span style="color:red;">举高</span>车类)
            </el-row>
          </el-col>
        </el-row>
        <!--英文-->
        <el-row v-if="userType=='ENG'" class="mb10">
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="22">
            <el-row class="mb10">
              <strong>Standard Booth：</strong>
              <span v-if="editZwyx">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.bzzwgs" :min="0" :max="6" :precision="0"></el-input-number>
              <span v-else v-text="zwyxForm.bzzwgs==''||zwyxForm.bzzwgs==null?'no':zwyxForm.bzzwgs+' Booth(s)'"></span>
              &nbsp;&nbsp;(12m² Each)
            </el-row>
            <el-row class="mb10">
              <strong>Indoor Raw Space Booth：</strong>
              <span v-if="editZwyx">&nbsp;&nbsp;</span>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.sngdzw" :min="24" :max="1000" :precision="0"></el-input-number>
              <span v-else v-text="zwyxForm.sngdzw==''||zwyxForm.sngdzw==null?'no':zwyxForm.sngdzw+' m²'"></span>
              &nbsp;&nbsp;(Minimum 24m²)
            </el-row>
            <el-row class="mb10">
              <strong>Outdoor Raw Space Booth：</strong>
              <el-input-number v-if="editZwyx" size="small" v-model="zwyxForm.swgdzw" :min="0" :max="2000" :precision="0"></el-input-number>
              <span v-else v-text="zwyxForm.swgdzw==''||zwyxForm.swgdzw==null?'no':zwyxForm.swgdzw+' m²'"></span>
              &nbsp;&nbsp;(Only Available to Fire Engines)
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!--操作按钮-->
      <div id="option" v-if="editPage==false">
        <el-row class="tc pt5" style="margin-left:-240px;">
          <el-button type="info" icon="el-icon-close" size="medium" @click="canclClick">
            <span v-if="userType=='CHN'">取消</span>
            <span v-if="userType=='ENG'">Cancle</span>
          </el-button>
          <el-button type="success" icon="el-icon-check" size="medium" @click="submitClick">
            <span v-if="userType=='CHN'">提交</span>
            <span v-if="userType=='ENG'">Submit</span>
          </el-button>
        </el-row>
      </div>
      <!--图片预览-->
      <el-dialog id="previewImgDialog" :visible.sync="showPicVisible" :close-on-click-modal="false" size="tiny">
        <img :src="previewImg" width="100%" class="mt15">
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //读取图片base路径
      baseUrl: window.config.baseUrl,
      //当前用户
      currentUser: this.CONSTANT.currentUser,
      //当前用户中英文标识
      userType: this.CONSTANT.currentUser.usertype,
      loading: false,
      showPicVisible: false,
      editZwyx: false,
      editPage: true,
      previewImg: "",
      qyid: "", //企业id
      userid: "",
      pageShzt: "",
      //企业基本信息
      jbxxData: {
        zwgsmc: "",
        tyshxydm: "",
        yyzzBase64: "",
        yjdz: "",
        frdb: "",
        frdbdh: "",
        lxr: "",
        lxrsj: "",
        cz: "",
        bgdh: "",
        dzyx: "",
        wz: "",
        sjztmc: "",
        shztmc: "",
        cjrmc: "",
        cjsj: "",
        xgrmc: "",
        xgsj: "",
        shrmc: "",
        shsj: ""
      },
      //企业开票信息
      kpxxData: {},
      //企业问卷调查
      wjdcData: {},
      //企业介绍
      qyjsData: {
        logoBase64: "",
        qyjj: ""
      },
      //产品介绍
      cpjsData: [],
      //展位需求意向
      zwyxData: [],
      zwyxForm: [],
      yxzwData: [],
      qqW: "576021001", //火灾预防   576021001
      qqE: "931270355", //灭火救援   931270355
      zwxzzt: "00", //展位选择状态
      sfkqzw: true, //是否开启选展位浮动提示框，（开始选展位开启此变量）
      yxzwxx: "",
      sfkqYxzwzs: false, //是否开启已选展位列表,
      kssj: "2018/12/24 15:15:34", //展位选择开始时间
      now: ""
    };
  },
  created: function() {
    this.loading = true;
    //  this.getNow();
    var type = this.$route.query.type;
    this.userid = this.$route.query.userid;
    this.getYxzwData();
    //  this.tishi();
  },
  methods: {
    /*
    tishi: function() {
      var i = 1;
      $(document).ready(function() {
        $("#menu-toggle-btn").click(function(e) {
          var e = document.getElementsByClassName("topScroll");
          if (i % 2 == 1) {
            e[0].style.width = "calc(100% - 60px)";
            i++;
          } else {
            e[0].style.width = "calc(100% - 300px)";
            i++;
          }
        });
      });
    },
    getNow: function() {
      let vm = this;
      vm.$axios.post("/zwjbxx/getNow").then(
        function(res) {
          vm.now = res.data;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    // 内部特权是打开，否则注释掉
    isInternal: function() {
      let vm = this;
      vm.$axios.post("/zwjbxx/isInternal").then(
        function(res) {
          if (res.data) {
            this.sfkqzw = true;
            this.sfkqYxzwzs = true;
            if (
              this.jbxxData.shzt == "03" &&
              this.sfkqzw &&
              this.yxzwData.length <= 0
            ) {
            //  $("#imgDiv").show();
            }
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    */
    compareDate(d1, d2) {
      return new Date(d1.replace(/-/g, "/")) > new Date(d2.replace(/-/g, "/"));
    },
    //已选展位
    getYxzwData: function() {
      let vm = this;
      vm.$axios.post("/zwjbxx/getSelectedPos").then(
        function(res) {
          if (res.data.result.length > 0) {
            var datas = res.data.result;
            //英文版翻译出口类型
            if (vm.userType == "ENG") {
              for (var i = 0; i < datas.length; i++) {
                if (i == 0) {
                  vm.yxzwxx += datas[i].zwh;
                } else {
                  vm.yxzwxx += "," + datas[i].zwh;
                }
                //展位类别，出口类型翻译
                if (datas[i].zwlb == "标准展位") {
                  datas[i].zwlb = "Standard booth";
                }
                if (datas[i].zwlb == "光地") {
                  datas[i].zwlb = "Raw space";
                }
                if (datas[i].cklx == "一面开") {
                  datas[i].cklx = "1 Sides open";
                }
                if (datas[i].cklx == "两面开") {
                  datas[i].cklx = "2 Sides open";
                }
                if (datas[i].cklx == "三面开") {
                  datas[i].cklx = "3 Sides open";
                }
                if (datas[i].cklx == "全开") {
                  datas[i].cklx = "4 Sides open";
                }
              }
            } else if (vm.userType == "CHN") {
              //中文版遍历展馆号，加不同qq群号
              var qq = "";
              for (var i = 0; i < datas.length; i++) {
                if (i == 0) {
                  vm.yxzwxx += datas[i].zwh;
                  if (
                    (datas[i].zwh.indexOf("W1") != -1 ||
                      datas[i].zwh.indexOf("W2") != -1 ||
                      datas[i].zwh.indexOf("W3-A") != -1) &&
                    qq.indexOf(vm.qqW) == -1
                  ) {
                    qq += vm.qqW;
                  } else {
                    if (qq.indexOf(vm.qqE) == -1) {
                      qq += vm.qqE;
                    }
                  }
                } else {
                  vm.yxzwxx += "，" + datas[i].zwh;
                  if (
                    (datas[i].zwh.indexOf("W1") != -1 ||
                      datas[i].zwh.indexOf("W2") != -1 ||
                      datas[i].zwh.indexOf("W3-A") != -1) &&
                    qq.indexOf(vm.qqW) == -1
                  ) {
                    if (qq) {
                      qq += "和" + vm.qqW;
                    } else {
                      qq = vm.qqW;
                    }
                  } else {
                    if (qq.indexOf(vm.qqE) == -1) {
                      if (qq) {
                        qq += "和" + vm.qqE;
                      } else {
                        qq = vm.qqE;
                      }
                    }
                  }
                }
              }
              if (qq != "" && vm.userType == "CHN") {
                vm.yxzwxx += "，请尽快添加QQ群：" + qq;
              }
            }
            vm.yxzwData = datas;
            vm.zwxzzt = "01";
            vm.sfkqYxzwzs = true;
          }
          vm.getJbxxData(vm.userid);
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //企业基本信息
    getJbxxData: function(val) {
      let vm = this;
      vm.loading = true;
      var params = {
        userid: val,
        deleteFlag: "N"
      };
      vm.$axios.post("/qyjbxx/doFindByVo", params).then(
        function(res) {
          if (res.data.result != null) {
            vm.jbxxData = res.data.result;
            if(vm.jbxxData.src != ""){
              vm.jbxxData.imageUrl = vm.baseUrl + "/upload/" + vm.jbxxData.src;
            }
            vm.jbxxData.yjdz =
              vm.jbxxData.yjdzshengmc +
              vm.jbxxData.yjdzshimc +
              vm.jbxxData.yjdzxx;
            if (vm.jbxxData.sjzt == "01" || vm.jbxxData.sjzt == "04") {
              vm.editPage = false;
            } else {
              vm.editPage = true;
            }
            vm.qyid = vm.jbxxData.qyid;
            vm.getZwyxData(vm.qyid);
            vm.getKpxxData(vm.qyid);
            vm.getWjdcData(vm.qyid);
            vm.getQyjsData(vm.qyid);
            vm.getCpjsData(vm.qyid);
            // 内部特权是打开，否则注释掉
            //  vm.isInternal();
            // 开启展位选择
            if (vm.compareDate(vm.now, vm.kssj)) {
              if (vm.jbxxData.shzt == "03" && vm.sfkqzw) {
                //  $("#imgDiv").show();
              }
            }
            vm.pageShzt = vm.jbxxData.shzt;
          }
          vm.loading = false;
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //企业开票信息
    getKpxxData: function(val) {
      let vm = this;
      vm.$axios.get("/qykpxx/" + val).then(
        function(res) {
          if (res.data.result != null) {
            vm.kpxxData = res.data.result;
            //统一社会信用代码格式化
            vm.kpxxData.tyshxydm = vm.longNumFormat(vm.kpxxData.tyshxydm);
            //银行账户格式化
            vm.kpxxData.yhzh = vm.longNumFormat(vm.kpxxData.yhzh);
          }
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    },
    //企业问卷调查
    getWjdcData: function(val) {
      let vm = this;
      vm.$axios.get("/qywjdc/" + val).then(
        function(res) {
          if (res.data.result != null) {
            this.wjdcData = res.data.result;
            var tempList = this.wjdcData.reserve1.split(",");
            var zycp = "";
            for (var i in tempList) {
              zycp = zycp + tempList[i].substr(4) + "、";
            }
            this.wjdcData.zycp = zycp.substr(0, zycp.length - 1);
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //企业介绍
    getQyjsData: function(val) {
      let vm = this;
      vm.$axios.get("/qyjs/doFindQyjsById/" + val).then(
        function(res) {
          if (res.data.result != null) {
            this.qyjsData = res.data.result;
            this.qyjsData.imageUrl =
              vm.baseUrl + "/upload/" + this.qyjsData.src;
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //产品介绍
    getCpjsData: function(val) {
      var param = {
        qyid: val
      };
      let vm = this;
      vm.$axios.post("/qycpjs/list", param).then(
        function(res) {
          if (res.data.result != null) {
            this.cpjsData = res.data.result;
            for (var i in this.cpjsData) {
              this.cpjsData[i].imageUrl =
                vm.baseUrl + "/upload/" + this.cpjsData[i].src;
            }
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //展位需求意向
    getZwyxData: function(val) {
      var params = {
        qyid: val,
        deleteFlag: "N"
      };
      let vm = this;
      vm.$axios.post("/qyzwyx/list", params).then(
        function(res) {
          if (res.data.result.length == 0) {
            this.zwyxData = null;
          } else if (res.data.result.length > 0) {
            //this.xqyxForm = res.data.result[0];
            //返回null时不自动带入min值
            this.zwyxData = res.data.result[0];
            if (res.data.result[0].bzzwgs != null) {
              // this.zwyxData.bzzwgs = res.data.result[0].bzzwgs;
              this.zwyxForm.bzzwgs = res.data.result[0].bzzwgs;
            }
            if (res.data.result[0].sngdzw != null) {
              // this.zwyxData.sngdzw = res.data.result[0].sngdzw;
              this.zwyxForm.sngdzw = res.data.result[0].sngdzw;
            }
            if (res.data.result[0].swgdzw != null) {
              // this.zwyxData.swgdzw = res.data.result[0].swgdzw;
              this.zwyxForm.swgdzw = res.data.result[0].swgdzw;
            }
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    imgPreview: function(val) {
      this.previewImg = val;
      this.showPicVisible = true;
    },
    saveClick: function() {
      let vm = this;
      if (
        vm.zwyxForm.bzzwgs > 0 ||
        vm.zwyxForm.sngdzw > 0 ||
        vm.zwyxForm.swgdzw > 0
      ) {
        if (vm.zwyxData == null) {
          //新增
          var params = {
            qyid: vm.qyid,
            bzzwgs: vm.zwyxForm.bzzwgs,
            sngdzw: vm.zwyxForm.sngdzw,
            swgdzw: vm.zwyxForm.swgdzw,
            deleteFlag: "N",
            cjrid: vm.currentUser.userid,
            cjrmc: vm.currentUser.username
          };
          vm.$axios.post("/qyzwyx/doInsertByVo", params).then(
            function(res) {
              if (res.data.result == 1) {
                if (vm.userType == "CHN") {
                  vm.$message({
                    message: "成功保存企业参展展位需求意向",
                    type: "success"
                  });
                } else if (vm.userType == "ENG") {
                  vm.$message({
                    message:
                      "Questionnaire on your Booth Requirement has been saved!",
                    type: "success"
                  });
                }
                vm.getZwyxData(vm.qyid);
                vm.editZwyx = false;
              }
            }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
        } else {
          //修改
          var params = {
            uuid: vm.zwyxData.uuid,
            qyid: vm.qyid,
            bzzwgs: vm.zwyxForm.bzzwgs,
            sngdzw: vm.zwyxForm.sngdzw,
            swgdzw: vm.zwyxForm.swgdzw,
            xgrid: vm.currentUser.userid,
            xgrmc: vm.currentUser.username
          };
          vm.$axios.post("/qyzwyx/doUpdateByVO", params).then(
            function(res) {
              if (res.data.result == 1) {
                if (vm.userType == "CHN") {
                  vm.$message({
                    message: "成功保存企业参展展位需求意向",
                    type: "success"
                  });
                } else if (vm.userType == "ENG") {
                  vm.$message({
                    message:
                      "Questionnaire on your Booth Requirement has been saved!",
                    type: "success"
                  });
                }
                vm.getZwyxData(vm.qyid);
                vm.editZwyx = false;
              }
            }.bind(vm),
            function(error) {
              console.log(error);
            }
          );
        }
      } else {
        if (vm.userType == "CHN") {
          vm.$message({
            message: "请至少选择一种展位填写需求意向",
            type: "warning"
          });
        } else if (vm.userType == "ENG") {
          vm.$message({
            message:
              "Please select at least one booth to fill out the requirements.",
            type: "warning"
          });
        }
      }
    },
    canclClick: function() {
      if (this.userType == "CHN") {
        this.$router.push({
          name: "exhpredictionEdit",
          query: { userid: this.userid, type: "BJ" }
        });
      } else if (this.userType == "ENG") {
        this.$router.push({
          name: "exhpredictionEdit_ENG",
          query: { userid: this.userid, type: "BJ" }
        });
      }
    },
    submitClick: function() {
      let vm = this;
      if(vm.userType == "CHN"){
        vm.$confirm("提交后仅可修改展位意向信息，其他信息不能修改", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          vm.submitClickMain();
        }).catch(() => {
          vm.$message({
            type: "info",
            message: "已取消提交"
          });
        });
      }else if(vm.userType == "ENG"){
        vm.$confirm("The information of booth intention can only be modified after submitting. Other information cannot be modified.", "Attention", {
          confirmButtonText: "Submit",
          cancelButtonText: "Cancle",
          type: "warning"
        })
        .then(() => {
          vm.submitClickMain();
        }).catch(() => {
          vm.$message({
            type: "info",
            message: "uncommitted"
          });
        });
      }
      
    },
    submitClickMain: function() {
      let vm = this;
      var params = {
        qyid: vm.qyid,
        sjzt: "03",
        shzt: "01",
        xgrid: vm.currentUser.userid,
        xgrmc: vm.currentUser.username
      };
      vm.$axios.post("/qyjbxx/doUpdateByVO", params).then(
        function(res) {
          if (res.data.result == 1) {
            if(vm.userType == "CHN"){
              vm.$message({
                message: "报名信息已提交待审核",
                type: "success"
              });
            }else if(vm.userType == "ENG"){
              vm.$message({
                message: "Application information has been submitted for review.",
                type: "success"
              });
            }
            
            vm.editPage = true;
            vm.jbxxData.shzt = "01";
            vm.pageShzt = "01";
          }
        }.bind(vm),
        function(error) {
          console.log(error);
        }
      );
    }
  }
};
</script>

<style lang="scss">
#exhpredictionConfirm {
  #cpjs .el-form-item__content {
    width: 100% !important;
  }
  #cpjsImg img {
    max-height: 100%;
    max-width: 100%;
  }
  #cpjs .el-form-item:nth-child(even) {
    margin-right: 0;
  }
  .inform-content .el-tabs__content {
    padding: 20px 25px 20px 30px !important;
  }
  #previewImgDialog .el-dialog {
    background-color: rgba(0, 0, 0, 0.2);
  }
  #qyzwyx .el-input-number--small {
    width: 300px;
  }

  .remark {
    line-height: 14px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    width: 80%;
    z-index: 2;
  }
  /* .remarka{
    width: 100%;
}

.row{
    display: flex;
    wrap:no-wrap;
} */

  .topScroll {
    position: fixed;
    top: 65px;
    /* right:calc(50% - 216px); */
    /* background:#fff; */
    /* width: calc(100% - 60px); */
    width: calc(100% - 300px);
  }

  .topScroll2 {
    position: fixed;
    top: 51px;
    width: calc(100% - 300px);
    color: #333;
  }

  .redFont {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
  }
  .greenFont {
    color: #67c23a;
    border: 1px solid #67c23a;
  }
  .yellowFont {
    color: #f7962f;
    border: 1px solid #f7962f;
  }
  #cpjs .el-card__body {
    height: 106px;
  }
  #option {
    position: fixed;
    bottom: 0;
    background: #fff;
    z-index: 2;
    height: 50px;
    width: 100%;
  }
}
</style>