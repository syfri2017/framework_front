<template>
  <div id="exhpredictionDetail">
    <div id="tableView">
      <div class="nameBox">
        <el-row>
          <el-col :span="3" class="tc">
              <img v-if="qyjsData.src!==''" :src="qyjsData.imageUrl" @click="imgPreview(qyjsData.imageUrl)" class="detail_picture_top poi">
              <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
              <br>企业Logo

          </el-col>
          <el-col :span="18">
            <div class="dib" id="basic-Inform-Title">
              <div>
                <h3 class="dib inform-h3">
                  <span v-if="jbxxData.usertype === 'CHN'" v-text="jbxxData.zwgsmc||'无'" class="mr20"></span>
                  <span v-else-if="jbxxData.usertype === 'ENG'" v-text="jbxxData.ywgsmc||'无'" class="mr20"></span>
                </h3>
              </div>
              <dl>
                <i class="iconfont icon-shuzi"></i>
                <dt v-if="!isENG" class="dib inform-small-title detail_margin">统一社会信用代码：</dt>
                <dd v-if="!isENG" class="dtdlStyle" v-text="kpxxData.tyshxydm||'无'"></dd>
                <br v-if="!isENG">
                <i class="iconfont icon-jieshao"></i>
                <dt class="dib inform-small-title detail_margin">企业简介：</dt>
                <dd class="dtdlStyle" v-if="qyjsData!==null" v-text="qyjsData.qyjj||'无'"></dd>
                <dd class="dtdlStyle" v-else>无</dd>
                <br>
                <i class="iconfont icon-yingwen"></i>
                <dt class="dib inform-small-title detail_margin">企业英文简介：</dt>
                <dd class="dtdlStyle" v-if="qyjsData!==null" v-text="qyjsData.reserve1||'无'"></dd>
                <dd class="dtdlStyle" v-else>无</dd>
              </dl>
            </div>
          </el-col>
          <el-col :span="3" v-if="!isENG" class="tc">
            <img v-if="jbxxData.src!==''" :src="jbxxData.imageUrl" @click="imgPreview(jbxxData.imageUrl)" class="detail_picture_top poi">
            <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
            <br>营业执照
          </el-col>
        </el-row>
      <el-row class="mb10" v-if="hasPermission('prediction/exhprediction_approve:approve')">
        <el-button type="danger" icon="el-icon-check" class="r" size="small" @click="approveClick">审核</el-button>
      </el-row>
      <!-- <div v-if="!isENG" class="r tc">
          <img v-if="jbxxData.yyzzBase64!==''" :src="'data:image/png;base64,'+jbxxData.yyzzBase64" @click="imgPreview(jbxxData.yyzzBase64)"
              class="detail_picture_top poi">
          <img v-else src="../../static/images/noPic.png" style="width:100px;">
          <br>营业执照
      </div> -->
      </div>
      <div class="inform-content">
        <template>
          <el-tabs v-model="activeName" type="border-card">
            <el-tab-pane label="企业基本信息" name="first">
              <el-row class="mb10">
                <strong>公司名称：</strong>
                <span v-if="jbxxData.usertype === 'CHN'" v-text="jbxxData.zwgsmc||'无'"></span>
                <span v-else-if="jbxxData.usertype === 'ENG'" v-text="jbxxData.ywgsmc||'无'"></span>
              </el-row>
              <el-row v-if="isENG" class="mb10">
                <el-col :span="12">
                  <strong>邮寄地址：</strong>
                  <span v-text="jbxxData.yjdz||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>邮政编码：</strong>
                  <span v-text="jbxxData.reserve2||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-else class="mb10">
                <strong>邮寄地址：</strong>
                <span v-text="jbxxData.yjdz||'无'"></span>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>法人代表：</strong>
                  <span v-text="jbxxData.frdb||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>法人代表电话：</strong>
                  <span v-text="jbxxData.frdbdh||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>联系人：</strong>
                  <span v-text="jbxxData.lxr||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>联系人手机：</strong>
                  <span v-text="jbxxData.lxrsj||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>传真：</strong>
                  <span v-text="jbxxData.cz||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>办公电话：</strong>
                  <span v-text="jbxxData.bgdh||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>电子邮箱：</strong>
                  <span v-if="jbxxData.usertype==='CHN'" v-text="jbxxData.dzyx||'无'"></span>
                  <span v-if="jbxxData.usertype==='ENG'" v-text="jbxxData.email||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>网址：</strong>
                  <span v-text="jbxxData.wz||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10" v-if="jbxxData.usertype==='ENG'">
                <strong>密码找回邮箱：</strong>
                <span v-text="jbxxData.dzyx||'无'"></span>
              </el-row>
              <el-row class="mb10">&nbsp;</el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>数据状态：</strong>
                  <span v-text="jbxxData.sjztmc||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>创建人：</strong>
                  <span v-text="jbxxData.cjrmc||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>创建时间：</strong>
                  <span v-text="jbxxData.cjsj||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>修改人：</strong>
                  <span v-text="jbxxData.xgrmc||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>修改时间：</strong>
                  <span v-text="jbxxData.xgsj||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">&nbsp;</el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>审核状态：</strong>
                  <span v-text="jbxxData.shztmc||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>审核人：</strong>
                  <span v-text="jbxxData.shrmc||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>审核时间：</strong>
                  <span v-text="jbxxData.shsj||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <strong>审核意见：</strong>
                <span v-text="jbxxData.reserve1||'无'"></span>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="企业开票信息" name="second">
                <!-- <div v-if="kpxxData!==null"> -->
              <el-row class="mb10">
                <el-col :span="12">
                  <strong>开票公司名称：</strong>
                  <span v-text="kpxxData.kpgsmc||'无'"></span>
                </el-col>
                <el-col v-if="!isENG" :span="12">
                  <strong>开票类型：</strong>
                  <span v-text="kpxxData.kplxmc||'无'"></span>
                </el-col>
                <el-col v-if="isENG" :span="12">
                  <strong>传真：</strong>
                  <span v-text="kpxxData.yhzh||'无'"></span>
                </el-col>
              </el-row>
              <el-row class="mb10">
                <el-col :span="12">
                  <strong v-if="isENG">联系人：</strong>
                  <strong v-else>公司地址：</strong>
                  <span v-text="kpxxData.gsdz||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong v-if="isENG">联系人电话：</strong>
                  <strong v-else>电话号码：</strong>
                  <span v-text="kpxxData.dhhm||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>开户银行：</strong>
                  <span v-text="kpxxData.khyh||'无'"></span>
                </el-col>
                  <el-col :span="12">
                    <strong>银行账户：</strong>
                    <span v-text="kpxxData.yhzh||'无'"></span>
                  </el-col>
              </el-row>
                <!-- </div> -->
            </el-tab-pane>
            <el-tab-pane label="企业问卷调查" name="third">
              <!-- <div v-if="wjdcData!==null"> -->
              <el-row v-if="!isENG" class="mb10">
                <strong>公司性质：</strong>
                <span v-text="wjdcData.gsxzmc||'无'"></span>
              </el-row>
              <el-row class="mb10">
                <strong>主营产品：</strong>
                <span v-text="wjdcData.zycp||'无'"></span>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>是否代理海外产品：</strong>
                  <span v-text="wjdcData.sfhwdlcp==1?'是':wjdcData.sfhwdlcp==0?'否':'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>海外代理产品品牌：</strong>
                  <span v-text="wjdcData.hwdlcppp||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>是否高新技术企业：</strong>
                  <span v-text="wjdcData.sfgxjsqy==1?'是':wjdcData.sfgxjsqy==0?'否':'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>高新技术级别：</strong>
                  <span v-text="wjdcData.gxjsjbmc||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>是否获得行业信用等级初评：</strong>
                  <span v-text="wjdcData.sfhyxydj==1?'是':wjdcData.sfhyxydj==0?'否':'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>行业信用等级：</strong>
                  <span v-text="wjdcData.hyxydjmc||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>发明专利(项)：</strong>
                  <span v-text="wjdcData.fmzl||'无'"></span>
                </el-col>
                <el-col :span="12">
                  <strong>实用新型专利(项)：</strong>
                  <span v-text="wjdcData.syxxzl||'无'"></span>
                </el-col>
              </el-row>
              <el-row v-if="!isENG" class="mb10">
                <el-col :span="12">
                  <strong>外观设计专利(项)：</strong>
                  <span v-text="wjdcData.wgsjzl||'无'"></span>
                </el-col>
              </el-row>
              <!-- </div> -->
            </el-tab-pane>
            <el-tab-pane label="企业产品介绍" name="forth">
              <!-- <el-form v-if="cpjsData.length>0" :inline="true" style="width: 100%;" class="demo-form-inline">
                  <el-form-item v-for="(cpjs,index) in cpjsData" style="width: 49%;"> -->
              <el-row v-if="cpjsData.length>0">
                <el-card v-for="(cpjs,index) in cpjsData" class="mb10" id="cpjsImg" :key="cpjs.src">
                  <el-row class="h100">
                    <el-col :span="3" class="h100 tc">
                      <img v-if="cpjs.src!==''" :src="cpjs.imageUrl" @click="imgPreview(cpjs.imageUrl)" class="poi">
                      <div v-else style="width:100px;" class="iconfont icon-noPic"></div>
                    </el-col>
                    <el-col :span="21" class="pl15 lh24">
                      <strong>产品类型：</strong>
                      <span v-if="jbxxData.usertype === 'CHN'" v-text="cpjs.cplxmc||'无'"></span>
                      <span v-if="jbxxData.usertype === 'ENG'" v-text="cpjs.cplxmc_ENG||'无'"></span>
                      <br>
                      <strong>产品简介：</strong>
                      <span v-text="cpjs.cpjj||'无'"></span>
                      <br>
                      <strong>产品英文简介：</strong>
                      <span v-text="cpjs.reserve1||'无'"></span>
                    </el-col>
                  </el-row>
                </el-card>
              </el-row>
              <span v-else>暂无产品信息</span>
            </el-tab-pane>
            
            <el-tab-pane label="企业参展展位需求意向" name="fifth">
              <el-row class="mb10">
                <strong>标准展位(每个12平方米)：</strong>
                <span v-text="zwyxData.bzzwgs==null?'无':zwyxData.bzzwgs+' 个'"></span>
              </el-row>
              <el-row class="mb10">
                <strong>室内光地展位(需要特装搭建，24平方米起)：</strong>
                <span v-text="zwyxData.sngdzw==null?'无':zwyxData.sngdzw+' m²'"></span>
              </el-row>
              <el-row class="mb10">
                <strong>室外光地展位(仅限消防
                  <span style="color:red;">举高</span>车类)：</strong>
                <span v-text="zwyxData.swgdzw==null?'无':zwyxData.swgdzw+' m²'"></span>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="合同所需信息" name="sixth">
              <el-row>
                <el-col :span="8">
                  <el-row>
                    <el-card class="card_style" style="width: 90%;">
                      <div class="bottom clearfix">
                        <el-row class="mb10">
                          <el-col :span="24">
                            <strong>
                              <span v-if="jbxxData.usertype === 'CHN'" v-text="jbxxData.zwgsmc||'无'"></span>
                              <span v-else-if="jbxxData.usertype === 'ENG'" v-text="jbxxData.ywgsmc||'无'"></span>
                            </strong>
                          </el-col>
                        </el-row>
                        <el-row class="mb10">
                          <el-col :span="12">
                            <strong>
                              <span v-text="jbxxData.lxr||'无'"></span>
                            </strong>
                          </el-col>
                          <el-col :span="12">
                            <strong>
                              <span v-text="jbxxData.lxrsj||'无'"></span>
                            </strong>
                          </el-col>
                        </el-row>
                        <el-row class="mb10">
                          <el-col :span="24">
                            <strong>
                              <span v-text="jbxxData.yjdz||'无'"></span>
                            </strong>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-row>
                  <el-row>
                    <el-card class="card_style" style="width: 90%;">
                      <div class="bottom clearfix">
                        <el-row class="mb10">
                          <el-col :span="24">
                            <strong>
                              办公电话：
                              <span v-text="jbxxData.bgdh||'无'"></span>
                            </strong>
                          </el-col>
                        </el-row>
                        <el-row class="mb10">
                          <el-col :span="24">
                            <strong>
                              传真：
                              <span v-text="jbxxData.cz||'无'"></span>
                            </strong>
                          </el-col>
                        </el-row>
                      </div>
                    </el-card>
                  </el-row>
                </el-col>
                <el-col :span="16">
                  <el-card class="card_style" style="width: 100%" v-if="this.bzzwData.length>0">
                    <div slot="header" class="clearfix">
                      <strong>标准展位</strong>
                    </div>
                    <div class="bottom clearfix">
                      <el-row class="mb10">
                        <el-col :span="24">
                          <el-table :data="this.bzzwData" border show-summary style="width: 100%">
                            <el-table-column prop="zwh" label="展位号" width="120" align="center"></el-table-column>
                            <el-table-column prop="zwmj" label="面积（㎡）" align="right"> </el-table-column>
                            <el-table-column v-if="jbxxData.usertype === 'CHN'" prop="zwjg" label="价格（元）" align="right"> </el-table-column>
                            <el-table-column v-if="jbxxData.usertype === 'ENG'" prop="zwjg_eng" label="价格（美元）" align="right"> </el-table-column>
                          </el-table>
                        </el-col>
                      </el-row>
                    </div>
                  </el-card>
                  <el-card class="card_style" style="width: 100%" v-if="this.gdzwData.length>0">
                      <div slot="header" class="clearfix">
                        <strong>光地展位</strong>
                      </div>
                      <div class="bottom clearfix">
                        <el-row class="mb10">
                          <el-col :span="24">
                            <el-table :data="this.gdzwData" border show-summary style="width: 100%">
                              <el-table-column prop="zwh" label="展位号" width="100" align="center"></el-table-column>
                              <el-table-column prop="cklx" label="开口类型" align="center"></el-table-column>
                              <el-table-column prop="zwmj" label="面积（㎡）" align="right"> </el-table-column>
                              <el-table-column v-if="jbxxData.usertype === 'CHN'" prop="zwjg" label="价格（元）" align="right"> </el-table-column>
                              <el-table-column v-if="jbxxData.usertype === 'ENG'" prop="zwjg_eng" label="价格（美元）" align="right"> </el-table-column>
                            </el-table>
                          </el-col>
                        </el-row>
                      </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
      <!--图片预览-->
      <el-dialog id="previewImgDialog" :visible.sync="showPicVisible" :close-on-click-modal="false" size="tiny">
        <img :src="previewImg" width="100%" class="mt15"></img>
      </el-dialog>
      <!--审批界面-->
      <el-dialog title="展会报名审核" :visible.sync="approveFormVisible" :close-on-click-modal="false">
        <el-row>
          <el-form :model="approveForm" label-width="100px" ref="approveForm" :rules="approveFormRules">
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
                <el-form-item label="审核意见" prop="reserve1" :rules="this.approveForm.shzt=='02'?approveFormRules.reserve1:[{ required: false, message: '请输入审核意见', trigger: 'blur' }]">
                  <el-input type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="approveForm.reserve1"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="buttonSubmit">
              <el-button type="clear" icon="el-icon-close" size="small" class="btn_submit" @click.native="closeDialog('approveForm')">取消</el-button>
              <el-button type="success" icon="el-icon-check" size="small" class="btn_submit" @click.native="approveSubmit('approveForm')">审核</el-button>
            </el-row>
          </el-form>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //当前登陆用户
      currentUser: this.CONSTANT.currentUser,
      activeName: "first",
      loading: false,
      showPicVisible: false,
      isENG: false,
      previewImg: '',
      //企业id
      qyid: "",
      //企业基本信息
      jbxxData: {
        zwgsmc: '',
        tyshxydm: '',
        yyzzBase64: '',
        yjdz: '',
        frdb: '',
        frdbdh: '',
        lxr: '',
        lxrsj: '',
        cz: '',
        bgdh: '',
        dzyx: '',
        wz: '',
        sjztmc: '',
        shztmc: '',
        cjrmc: '',
        cjsj: '',
        xgrmc: '',
        xgsj: '',
        shrmc: '',
        shsj: ''
      },
      //企业开票信息
      kpxxData: {},
      //企业问卷调查
      wjdcData: {},
      //企业介绍
      qyjsData: {
        logoBase64: '',
        qyjj: ''
      },
      //产品介绍
      cpjsData: [],
      //展位需求意向
      zwyxData: {},
      //企业选择的标准展位data
      bzzwData: [],
      //光地展位data
      gdzwData: [],
      approveFormVisible: false,
      //审批表单
      approveForm: {
        shzt: -1,
        reserve1: ""
      },
      //审核Rules
      approveFormRules: {
        shzt: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        reserve1: [
          { required: true, message: '请输入审核意见', trigger: 'blur' }
        ]
      },
      isReject: false,//未通过flag
      //审核后的审核状态
      finalShzt: '',
      finalReserve1: ''
    }
  },
  created: function(){
    this.loading = true;
    this.qyid = this.$route.query.id;
    this.getJbxxData(this.qyid);
    this.getKpxxData(this.qyid);
    this.getWjdcData(this.qyid);
    this.getQyjsData(this.qyid);
    this.getCpjsData(this.qyid);
    this.getZwyxData(this.qyid);
    this.getSelectedBzzw();
    this.getSelectedGdzw();
  },
  methods: {
    //企业基本信息
    getJbxxData: function (val) {
      let vm = this;
      vm.loading = true;
      vm.$axios.get('/qyjbxx/doFindJbxxById/' + val).then(function (res) {
        if (res.data.result != null) {
          vm.jbxxData = res.data.result;
          vm.jbxxData.imageUrl = window.config.baseUrl + "/upload/" + vm.jbxxData.src;
          if (vm.jbxxData.usertype == 'ENG') {
            vm.isENG = true;
            vm.jbxxData.yjdz = vm.jbxxData.yjdzxx;
          } else {
            vm.jbxxData.yjdz = vm.jbxxData.yjdzshengmc + vm.jbxxData.yjdzshimc + vm.jbxxData.yjdzxx;
          }
          //创建时间格式化
          if (vm.jbxxData.cjsj == null || vm.jbxxData.cjsj == "") {
            vm.jbxxData.cjsj = '';
          } else {
            vm.jbxxData.cjsj = vm.dateFormat(vm.jbxxData.cjsj);
          }
          //修改时间格式化
          if (vm.jbxxData.xgsj == null || vm.jbxxData.xgsj == "") {
            vm.jbxxData.xgsj = '';
          } else {
            vm.jbxxData.xgsj = vm.dateFormat(vm.jbxxData.xgsj);
          }
          //审核时间格式化
          if (vm.jbxxData.shsj == null || vm.jbxxData.shsj == "") {
            vm.jbxxData.shsj = '';
          } else {
            vm.jbxxData.shsj = vm.dateFormat(vm.jbxxData.shsj);
          }
        }
        vm.loading = false;
      }.bind(this), function (error) {
          console.log(error)
      })
    },
    //企业开票信息
    getKpxxData: function (val) {
      let vm = this;
      vm.$axios.get('/qykpxx/' + val).then(function (res) {
        vm.kpxxData = res.data.result;
        if (vm.kpxxData != null) {
          //创建时间格式化
          if (vm.kpxxData.cjsj == null || vm.kpxxData.cjsj == "") {
            vm.kpxxData.cjsj = '';
          } else {
            vm.kpxxData.cjsj = vm.dateFormat(vm.kpxxData.cjsj);
          }
          //修改时间格式化
          if (vm.kpxxData.xgsj == null || vm.kpxxData.xgsj == "") {
            vm.kpxxData.xgsj = '';
          } else {
            vm.kpxxData.xgsj = vm.dateFormat(vm.kpxxData.xgsj);
          }
          //统一社会信用代码格式化
          vm.kpxxData.tyshxydm = vm.longNumFormat(vm.kpxxData.tyshxydm);
          //银行账户格式化
          vm.kpxxData.yhzh = vm.longNumFormat(vm.kpxxData.yhzh);
        } else {
          vm.kpxxData = {};
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //企业问卷调查
    getWjdcData: function (val) {
      let vm = this;
      vm.$axios.get('/qywjdc/' + val).then(function (res) {
        if (res.data.result != null) {
          vm.wjdcData = res.data.result;
          var tempList = vm.wjdcData.reserve1.split(",");
          var zycp = '';
          for (var i in tempList) {
            zycp = zycp + tempList[i].substr(4) + '、';
          }
          vm.wjdcData.zycp = zycp.substr(0, zycp.length - 1);
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //企业介绍
    getQyjsData: function (val) {
      let vm = this;
      vm.$axios.get('/qyjs/doFindQyjsById/' + val).then(function (res) {
        if (res.data.result != null) {
          vm.qyjsData = res.data.result;
          vm.qyjsData.imageUrl = window.config.baseUrl + "/upload/" + vm.qyjsData.src;
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //产品介绍
    getCpjsData: function (val) {
      let vm = this;
      var param = {
          qyid: val
      }
      vm.$axios.post('/qycpjs/list', param).then(function (res) {
        if (res.data.result != null) {
          vm.cpjsData = res.data.result;
          for (var i in vm.cpjsData) {
            vm.cpjsData[i].imageUrl = window.config.baseUrl + "/upload/" + vm.cpjsData[i].src;
          }
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //展位需求意向
    getZwyxData: function (val) {
      let vm = this;
      vm.$axios.get('/qyzwyx/' + val).then(function (res) {
        if (res.data.result != null) {
          vm.zwyxData = res.data.result;
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    imgPreview: function (val) {
      this.previewImg = val;
      this.showPicVisible = true;
    },

    //获取企业选择的标准展位信息
    getSelectedBzzw: function () {
      let vm = this;
      var param = {
        qyid: vm.qyid,
        zwlb: "标准展位"
      }
      vm.$axios.post('/zwjbxx/doFindZwAndJgByVo', param).then(function (res) {
        if (res.data.result.length > 0) {
          vm.bzzwData = res.data.result;
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //获取企业选择的光地展位信息
    getSelectedGdzw: function () {
      let vm = this;
      var param = {
        qyid: vm.qyid,
        zwlb: "光地"
      }
      vm.$axios.post('/zwjbxx/doFindZwAndJgByVo', param).then(function (res) {
        if (res.data.result.length > 0) {
            vm.gdzwData = res.data.result;
        }
      }.bind(this), function (error) {
        console.log(error)
      })
    },
    //审核点击事件
    approveClick: function () {
      if (this.finalShzt == '') {
        this.approveForm = {
          shzt: this.jbxxData.shzt,
          reserve1: this.jbxxData.reserve1
        };
      } else {
        this.approveForm = {
          shzt: this.finalShzt,
          reserve1: this.finalReserve1
        };
      }
      this.approveFormVisible = true;
    },
    //审核提交事件
    approveSubmit: function (val) {
      let vm = this;
      //审核状态改变才调用后台approveByVO方法
      if (vm.approveForm.shzt == vm.jbxxData.shzt && vm.approveForm.reserve1 == vm.jbxxData.reserve1) {
          vm.$message({
            message: "审核状态及审核意见未改变",
            type: "error",
            showClose: true
          });
      } else {
        vm.$refs["approveForm"].validate((valid) => {
          if (valid) {
            if (vm.approveForm.shzt == '02') {//未通过
              vm.approveForm.sjzt = '04';
            } else if (vm.approveForm.shzt == '03') {//已通过
              vm.approveForm.sjzt = '05';
            }
            var params = {
              qyid: vm.qyid,
              shzt: vm.approveForm.shzt,
              sjzt: vm.approveForm.sjzt,
              reserve1: vm.approveForm.reserve1,//审核意见
              shrid: vm.currentUser.userid,
              shrmc: vm.currentUser.username,
              shsj: '1'
            };
            vm.$axios.post('/qyjbxx/updateByVO', params).then(function (res) {
              if (res.data.result == 1) {
                vm.approveFormVisible = false;
                vm.finalShzt = vm.approveForm.shzt;
                vm.finalReserve1 = vm.approveForm.reserve1;
                vm.$message.success('已审核');
                var type = this.$route.query.type;
                if (type == 'search') {
                  // loadDivParam("prediction/exhprediction_list");
                } else if (type == 'approve') {
                  // loadDivParam("prediction/exhprediction_approve");
                }
              }
            }.bind(this), function (error) {
              console.log(error)
            })
          }
      });
      }
      
      // if (vm.approveForm.shzt == '01') {
      //   vm.$message({
      //     message: "请选择审核状态",
      //     type: "error",
      //     showClose: true
      //   });
      // } else if (vm.isReject == true && (vm.approveForm.reserve1 == null || vm.approveForm.reserve1 == '')) {
      //     vm.$message({
      //       message: "请填写审核意见",
      //       type: "error",
      //       showClose: true
      //     });
      // } else {
        
      //   
      // }
    },
    //审核状态为未通过时审核意见显示*代表必填
    radioChange: function () {
      if (this.approveForm.shzt == '02')
        this.isReject = true;
      else
        this.isReject = false;
    },
    closeDialog: function (val) {
      this.approveForm = {
        shzt: -1,
        reserve1: ""
      };
      this.$refs[val].resetFields();
      this.approveFormVisible = false;
    },
  }
}
</script>

<style lang="scss">
#exhpredictionDetail{
  .nameBox {
  min-height: 165px !important;
	background-color: #fff;
	border: 5px solid #ccc;
	/* margin-top: 15px; */
	padding: 20px 25px 0 25px;
  box-shadow: 2px 3px 5px #ccc;
  }
  #cpjs .el-form-item__content {
      width: 100% !important;
  }
  #cpjsImg img{
      max-height: 100%;
      max-width: 100%;
  }
  #cpjs .el-form-item:nth-child(even){
      margin-right: 0;
  }
  .inform-content .el-tabs__content {
      padding: 20px 25px 20px 30px !important;
  }
  #previewImgDialog .el-dialog{
      background-color: rgba(0, 0, 0, 0.2);
  }
  #qyzwyx .el-input-number--small {
      width: 300px;
  }
}
</style>
