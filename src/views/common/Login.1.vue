<template>
  <div class="tc abs">
            <!--center-->
            <div class="login_center">
                <div class="lg_center"></div>
                <div class="QRCode" ></div>
                <div class="lanz"><p><span class="lana"><img class="sc" src="/static/images/btn/sc.png"/><a class="lana" href="http://61.161.226.197:8090/templates/帮助手册.doc">帮助手册</a></span><a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a><span class="lana">中文</span><a class="lan">&nbsp;&nbsp;|&nbsp;&nbsp;</a><span class="lanb">English</span></p></div>
                <div class="Login">
                    <div id="login" class="Login_n" v-show="formFlag=='loginFlag'||formFlag=='bakFlag'">
                        <div class="Login_nTop">
                            <a @click="changeForm('GLYloginFlag')">
                                <img width="26" height="26" src="static/images/login/icon-changeuser_hover.png" onMouseOver="this.src='../static/images/login/icon-changeuser.png'"
                                    onMouseOut="this.src='static/images/login/icon-changeuser_hover.png'" draggable="false"></a>
                            <span class="yhdl_span current">用户登录</span>
                            <div style="float:right;font-size: 12px;color: #fb6a74">没有账户？<a @click="changeForm('regFlag')"><u
                                        style="color: #fb6a74">去注册</u></a></div>
                        </div>
                        <form id="login-form" autocomplete="off" name="login-form" action="/xfxhapi/login" method="post">
                            <ul id="forma" style="display:block;">
                                <li>
                                    <i class="icon-user"></i>
                                    <input type="text" class="inputstyle" v-model="username" name="username" id="username" placeholder="用户名">
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="password" name="password" id="password" placeholder="密码">
                                </li>
                                <li>
                                    <i class="icon-verficode" style="margin-left:14px;"></i>
                                    <input type="text" class="inputstyle" v-model="validateCode" name="validateCode" id="validateCode" placeholder="验证码" @keyup.enter="login()">
                                    <a href="javascript:;" @click="reloadCode()">
                                        <img v-bind:src="src" id="checkCode" class="verficode" onerror="javascript:this.src='../static/images/img-error.png';" style="vertical-align: bottom;border-radius:20px;"
                                            width="50" height="20">
                                    </a>
                                </li>
                            </ul>
                            <ul id="formb" style="display:none;">
                                <li>
                                    <i class="icon-jxcs"></i>
                                    <input type="text" class="inputstyle" v-model="unscid" name="unscid" id="unscid" placeholder="统一社会信用代码">
                                </li>
                                <li style="visibility: hidden;">
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle">
                                </li>
                                <li style="visibility: hidden;">
                                    <i class="icon-verficode"></i>
                                    <input type="text" class="inputstyle">
                                    <a href="javascript:;">
                                        <img v-bind:src="src" id="checkCode" class="verficode" onerror="javascript:this.src='../static/images/img-error.png';" style="vertical-align: bottom"
                                            width="50" height="20">
                                    </a>
                                </li>
                            </ul>

                            <div class="formbar">
                                <a @click="changeForm('REAAFlag')">重置账户</a>
                                <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
                                <a @click="changeForm('FPAFlag')">忘记密码</a>
                                <a>&nbsp;&nbsp;|&nbsp;&nbsp;</a>
                                <a @click="changeForm('FUAFlag')">忘记用户名</a>
                                <!-- <input class="checkbox" type="checkbox" name="rememberMe" id="rememberMe" />&nbsp;&nbsp;
                                <span style="color:#fb6a74">记住我</span> -->
                            </div>
                            <div class="LoginBtn">
                                <a @click="login()" id="lg" style="display:block;margin-top:70px;">登 录</a>
                                <a @click="nlogin()" id="nlg" style="display:none;margin-top:70px;">登 录</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" v-model="loginType"/>
                            <input type="hidden" class="comfrom" name="comfrom" v-model="CNcomfrom"/>
                        </form>
                    </div>
                    <div id="GLYlogin" class="Login_n" v-show="formFlag=='GLYloginFlag'">
                        <div class="Login_nTop">
                            <a @click="changeForm('loginFlag')">
                                <img width="26" height="26" src="static/images/login/icon-changeuser_hover.png" onMouseOver="this.src='../static/images/login/icon-changeuser.png'"
                                    onMouseOut="this.src='static/images/login/icon-changeuser_hover.png'" draggable="false"></a>
                            <span class="yhdl_span current">管理员登录</span>
                        </div>
                        <form id="GLYlogin-form" autocomplete="off" name="login-form" action="/xfxhapi/login" method="post">
                            <ul style="display:block;">
                                <li>
                                    <input type="text" class="kong">
                                </li>
                                <li>
                                    <i class="icon-user"></i>
                                    <input type="text" class="inputstyle" v-model="GLYusername" name="username" id="GLYusername" placeholder="用户名">
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="GLYpassword" name="password" id="GLYpassword" placeholder="密码" @keyup.enter="GLYlogin()">
                                </li>
                                
                                <!-- <li>
                                    <i class="icon-verficode" style="margin-left:14px;"></i>
                                    <input type="text" class="inputstyle" v-model="GLYvalidateCode" name="validateCode" id="GLYvalidateCode" placeholder="验证码"
                                        @keyup.enter="GLYlogin()">
                                    <a href="javascript:;" @click="reloadGLYCode()">
                                        <img v-bind:src="GLYsrc" id="GLYcheckCode" class="verficode" onerror="javascript:this.src='../static/images/img-error.png';"
                                            style="vertical-align: bottom;border-radius:20px;" width="50" height="20">
                                    </a>
                                </li> -->
                            </ul>
                            <!-- <div class="formbar">
                                <input type="checkbox" name="rememberMe" id="GLYrememberMe" />&nbsp;&nbsp;
                                <span style="color:#fb6a74">记住我</span>
                            </div> -->
                            <div class="LoginBtn">
                                <a @click="GLYlogin()" id="lg" style="display:block;margin-top:70px;">登 录</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" v-model="GLYloginType" />
                        </form>
                    </div>
                    <div id="reg" class="Login_n" v-show="formFlag=='regFlag'">
                        <div class="Login_nTop"><span class="yhzc_span current">用户注册</span>
                            <div style="float:right;font-size: 12px;color:#fb6a74;">已有账户？<a @click="changeForm('loginFlag')"><u
                                        style="color:#fb6a74;">去登录</u></a></div>
                        </div>
                        <form autocomplete="off" name="reg-form">
                            <ul>
                                <li>
                                    <i class="icon-call"></i>
                                    <input type="text" class="inputstyle" v-model="mobile" name="mobile" id="mobile" placeholder="请输入手机号" @blur="mobileCheck">
                                    <button type="button" id="mobile-btn" class="verficode phonebtn" @click="getMessageCode()" v-text=messageCodeText></button>
                                    <p class="alert" v-show="mobileAlertFlag">*请填写正确的手机号码</p>
                                </li>
                                <li>
                                    <i class="icon-code"></i>
                                    <input type="text" class="inputstyle" v-model="messageCode" name="messageCode" id="messageCode" placeholder="请输入手机验证码" @blur="messageCodeCheck">
                                    <p class="alert" v-show="messageCodeAlertFlag">*请填写正确的手机验证码</p>
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="password1" name="password1" id="password1" placeholder="请输入密码" @focus="password1Tip"
                                        @blur="password1Check">
                                    <p class="tip" v-show="password1TipFlag">*密码需为6-16位字母数字组合</p>
                                    <p class="alert" v-show="password1AlertFlag">*密码不合规，请重新填写</p>
                                </li>
                                <li>
                                    <i class="icon-password-true"></i>
                                    <input type="password" class="inputstyle" v-model="password2" name="password2" id="password2" placeholder="请再次输入密码" @blur="password2Check">
                                    <p class="alert" v-show="password2AlertFlag">*两次填写不一致，请重新填写</p>
                                </li>
                            </ul>
                            <div class="LoginBtn" style="margin-top:-1px;">
                                <a @click="register()">注 册</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                    </div>
                    <div id="forgetUsername" class="Login_n" v-show="formFlag=='FUAFlag'||formFlag=='FUBFlag'">
                        <div class="Login_nTop"><span class="FU_span current">用户名找回</span>
                            <div style="float:right;font-size: 12px;"><a @click="changeForm('bakFlag')"><u class="btncolor">返回登录</u></a></div>
                        </div>
                        <form id="FUAform" v-show="formFlag=='FUAFlag'" autocomplete="off">
                            <ul style="display:block;">
                                <li>
                                    <input type="text" class="kong">
                                </li>
                                <li>
                                    <i class="icon-email"></i>
                                    <input type="text" class="inputstyle" v-model="FUmail" name="FUmail" id="FUmail" placeholder="邮箱">
                                    <button type="button" id="FUmail-btn" class="verficode phonebtn" @click="getFUMailCode()" v-text=FUmailCodeText></button>
                                </li>
                                <li>
                                    <i class="icon-message"></i>
                                    <input type="text" class="inputstyle" v-model="FUmailCode" name="FUmailCode" id="FUmailCode" placeholder="邮件验证码">
                                </li>

                            </ul>
                            <div class="LoginBtn" id="btn_mt">
                                <a @click="FUIdentify()">确 定</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                        <form id="FUBform" v-show="formFlag=='FUBFlag'" autocomplete="off">
                            <ul style="display:block;">
                                <li>
                                    <i class="icon-user"></i>
                                    <input type="text" class="inputstyle" v-model="FUusername" name="FUusername" id="FUusername" placeholder="用户名">
                                    <button type="button" id="FUmobile-btn" class="verficode" @click="getFUMessageCode()" v-text=FUmessageCodeText></button>
                                </li>
                                <li>
                                    <i class="icon-code"></i>
                                    <input type="text" class="inputstyle" v-model="FUmessageCode" name="FUmessageCode" id="FUmessageCode" placeholder="短信验证码">
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="FUpassword" name="FUpassword" id="FUpassword" placeholder="密码">
                                </li>
                                <li>
                                    <i class="icon-verficode"></i>
                                    <input type="text" class="inputstyle" v-model="FUvalidateCode" name="FUvalidateCode" id="FUvalidateCode" placeholder="验证码"
                                        @keyup.enter="login()">
                                    <a href="javascript:;" @click="reloadFUCode()">
                                        <img v-bind:src="FUsrc" id="FUcheckCode" class="verficode" onerror="javascript:this.FUsrc='../static/images/img-error.png';"
                                            style="vertical-align: bottom" width="50" height="20">
                                    </a>
                                </li>
                            </ul>
                            <div class="LoginBtn">
                                <a @click="FUlogin()">登录</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                    </div>
                    <div id="forgetPassword" class="Login_n" v-show="formFlag=='FPAFlag'||formFlag=='FPBFlag'||formFlag=='FPCFlag'||formFlag=='FPDFlag'">
                        <div class="Login_nTop"><span class="FP_span current">密码修改</span>
                            <div style="float:right;font-size: 12px;"><a @click="changeForm('bakFlag')"><u class="btncolor">返回登录</u></a></div>
                        </div>
                        <form id="FPAform" class="mt_value" v-show="formFlag=='FPAFlag'" autocomplete="off">
                            <ul style="display:block;">
                                <li>
                                    <div class="LoginBtn">
                                        <a @click="changeForm('FPBFlag')">邮箱找回</a>
                                    </div>
                                </li>
                                <li>
                                    <div class="LoginBtn">
                                        <a @click="changeForm('FPCFlag')">手机找回</a>
                                    </div>
                                </li>
                            </ul>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                        <form id="FPBform" v-show="formFlag=='FPBFlag'" autocomplete="off">
                            <ul style="display:block;">
                                <li>
                                    <input type="text" class="kong">
                                </li>
                                <li>
                                    <i class="icon-email"></i>
                                    <input type="text" class="inputstyle" v-model="FPBmail" name="FPBmail" id="FPBmail" placeholder="邮箱">
                                    <button type="button" id="FPBmail-btn" class="verficode phonebtn" @click="getFPBMailCode()" v-text=FPBmailCodeText></button>
                                </li>
                                <li>
                                    <i class="icon-message"></i>
                                    <input type="text" class="inputstyle" v-model="FPBmailCode" name="FPBmailCode" id="FPBmailCode" placeholder="邮件验证码">
                                </li>
                            </ul>
                            <div class="LoginBtn" id="btn_mt">
                                <a @click="FPBIdentify()">确 定</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                        <form id="FPCform" v-show="form.flag=='FPCFlag'" autocomplete="off">
                            <ul style="display:block;">
                                <li>
                                    <input type="text" class="kong">
                                </li>
                                <li>
                                    <i class="icon-call"></i>
                                    <input type="text" class="inputstyle" v-model="FPCmobile" name="FPCmobile" id="FPCmobile" placeholder="手机号">
                                    <button type="button" id="FPCmobile-btn" class="verficode phonebtn" @click="getFPCMessageCode()" v-text=FPCmessageCodeText></button>
                                </li>
                                <li>
                                    <i class="icon-code"></i>
                                    <input type="text" class="inputstyle" v-model="FPCmessageCode" name="FPCmessageCode" id="FPCmessageCode" placeholder="短信验证码">
                                </li>
                            </ul>
                            <div class="LoginBtn" id="btn_mt">
                                <a @click="FPCIdentify()">确 定</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                        <form id="FPDform" v-show="formFlag=='FPDFlag'" autocomplete="off">
                            <ul>
                                <li>
                                    <i class="icon-user"></i>
                                    <input type="text" class="inputstyle" v-model="FPDusername" name="FPDusername" id="FPDusername" placeholder="用户名">
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="FPDpassword1" name="FPDpassword1" id="FPDpassword1" placeholder="请输入密码"
                                        @focus="FPDpassword1Tip" @blur="FPDpassword1Check">
                                    <p class="tip" v-show="FPDpassword1TipFlag">*密码需为6-16位字母数字组合</p>
                                    <p class="alert" v-show="FPDpassword1AlertFlag">*密码不合规，请重新填写</p>
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="FPDpassword2" name="FPDpassword2" id="FPDpassword2" placeholder="请再次输入密码"
                                        @blur="FPDpassword2Check">
                                    <p class="alert" v-show="FPDpassword2AlertFlag">*两次填写不一致，请重新填写</p>
                                </li>
                            </ul>
                            <div class="LoginBtn">
                                <a @click="FPregister()">修改密码</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                    </div>
                    <div id="rearrange" class="Login_n" v-show="formFlag=='REAAFlag'||formFlag=='REABFlag'">
                        <div class="Login_nTop"><span class="zhcz_span current">账户重置</span>
                            <div style="float:right;font-size: 12px;"><a @click="changeForm('bakFlag')"><u class="btncolor">返回登录</u></a></div>
                        </div>
                        <form id="REAAform" v-show="formFlag=='REAAFlag'" autocomplete="off">
                            <ul>
                                <li>
                                    <input type="text" class="kong">
                                </li>
                                <li>
                                    <i class="icon-company"></i>
                                    <input type="text" class="inputstyle" v-model="REAcompanyName" name="REAcompanyName" id="REAcompanyName" placeholder="单位名称">
                                </li>
                                <li>
                                    <i class="icon-unscid"></i>
                                    <input type="text" class="inputstyle" v-model="REAunscid" name="REAunscid" id="REAunscid" placeholder="统一社会信用代码">
                                </li>
                            </ul>
                            <div class="LoginBtn" id="btn_mt">
                                <a @click="REAIdentify()">确 定</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                        <form id="REABform" v-show="formFlag=='REABFlag'" autocomplete="off">
                            <ul>
                                <li>
                                    <i class="icon-call"></i>
                                    <input type="text" class="inputstyle" v-model="REAmobile" name="REAmobile" id="REAmobile" placeholder="请输入手机号" @blur="REAmobileCheck">
                                    <button type="button" id="REAmobile-btn" class="verficode" @click="getREAMessageCode()" v-text=REAmessageCodeText></button>
                                    <p class="alert" v-show="REAmobileAlertFlag">*请填写正确的手机号码</p>
                                </li>
                                <li>
                                    <i class="icon-code"></i>
                                    <input type="text" class="inputstyle" v-model="REAmessageCode" name="REAmessageCode" id="REAmessageCode" placeholder="请输入手机验证码"
                                        @blur="REAmessageCodeCheck">
                                    <p class="alert" v-show="REAmessageCodeAlertFlag">*请填写正确的手机验证码</p>
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="REApassword1" name="REApassword1" id="REApassword1" placeholder="请输入密码"
                                        @focus="REApassword1Tip" @blur="REApassword1Check">
                                    <p class="tip" v-show="REApassword1TipFlag">*密码需为6-16位字母数字组合</p>
                                    <p class="alert" v-show="REApassword1AlertFlag">*密码不合规，请重新填写</p>
                                </li>
                                <li>
                                    <i class="icon-password"></i>
                                    <input type="password" class="inputstyle" v-model="REApassword2" name="REApassword2" id="REApassword2" placeholder="请再次输入密码"
                                        @blur="REApassword2Check">
                                    <p class="alert" v-show="REApassword2AlertFlag">*两次填写不一致，请重新填写</p>
                                </li>
                            </ul>
                            <div class="LoginBtn">
                                <a @click="REAregister()">提交</a>
                            </div>
                            <input type="hidden" class="loginType" name="loginType" />
                        </form>
                    </div>
                </div>
                <div class="footText2">建议使用谷歌、搜狗、360和火狐浏览器</div>
                <div class="footText">如在登录、注册、信息录入时遇到问题，请联系技术支持024-31530337，分机号608；13998821420</div>
            </div>
        </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form:{

      }
    }
  }
}
</script>


<style scoped>

li{ 
  list-style:none;
}
img{ border:0; border:none;}
a{ text-decoration:none;}
body,html{ width:100%; height:100%;}


.lg_center{background: url('/static/images/login/pic_title.png')no-repeat;background-size: 100% auto;width:820px;height: 150px; z-index:12;margin: 0 auto;margin-top:7%;}
.QRCode{
    position: absolute;
    top: 50px;
    left: 100px;
    height: 150px;
    width: 150px;
    background: url('/static/images/login/QRCode.jpg')no-repeat;
    background-size: 100% auto;
}

.footText{
    text-align: center;
    font-size: 18px;
    color: #e6e6e6;
  
    width: 100%;
    position: absolute;
    bottom: 20px;
}
.footText2{
    text-align: center;
    font-size: 18px;
    color: #e6e6e6;
    /* color: #fff; */
    width: 100%;
    position: absolute;
    bottom: 55px;
}
.sc{
    position:relative;
    top: 3.5px;
    padding-right: 8px;
}
/*切换*/
.lanz{
    color: #fff;
    font-size:18px; 
    position: absolute;
    top:50px;
    right: 100px;
}

.lana{
    color: #fff;
    font-size:24px; 
    cursor: pointer;
    letter-spacing: 2px;
}
.lan{
    color: #fff;
    font-size:24px;
}
.lanb{
    color: #2c2c2c;
    font-size:24px; 
    cursor: pointer;
}

/* center */
.login_center{
    top:0em;
    position:absolute;
    z-index:10;
    bottom:0em;
    width:100%; 
    overflow:hidden;
    background:url('/static/images/login/bg_01.png') no-repeat 0 0; background-size:cover;}
.Login_img{ 
    position:absolute;
    top: 1.5em;
    z-index: 10;
    bottom:2em;
    left: 4em;
    width:98%;
    _height:100%; 
    margin:0 auto;
    overflow:hidden; }
.Login{
        margin:28px auto;
        width:345px; 
        height:390px; 
        background:url('/static/images/login/bg_login01.png') no-repeat 0 0; 
        overflow:hidden;
        border-radius:10px; 
        padding: 0px;
    }
.Login_n{ width:345px; height:390px; margin:0px;}
.Login_nTop{height:65px; line-height:65px; font-size:20px;padding-top:15px ; padding-left:35px; padding-right:35px;color:#c0c0c0}
.Login_nTop img{position: relative;top: 7px;right: 5px;}
.Login_nTop span{font-size: 18px;cursor: pointer;}
.Login_nTop .current{color: #EA2530;}
.Login_nTop .currentb{color: #999999;}
.Login_nTop a{cursor: pointer;}
.Login_n ul{width:298px; margin:0px auto 0;}
.Login_n ul li{margin-bottom: 15px;}
.Login_n ul li input{ outline:none; width:250px; height:39px; line-height:39px; font-size:14px; padding-left:46px; border-radius:20px; border:1px solid #d6d6d6;}
/* .Login_n ul li button.mobile-btn {width: 74px;height: 25px;position: absolute;top:132px;left:277px;} */
.Login_n ul li p{position: absolute;margin-top:-1px;}
.Login_n ul li .alert{color:#EA2530;}
/*获取验证码样式*/
.phonebtn{
    border: none;background: #ffffff;color:#fb6a74;cursor: pointer;
}
/*icon设置为单独图标，解决chrome浏览器自动填充密码时覆盖background样式问题*/
.Login_n ul i{width: 30px;height: 30px;display: inline-block;position: absolute;margin-left: 16px;margin-top: 10px;}
.Login_n ul i.icon-user{
    background: url('/static/images/login/icon-user.png') no-repeat;
}
.Login_n ul i.icon-password{
    background: url('/static/images/login/icn_password.png') no-repeat;
}
.Login_n ul i.icon-password-true{
    background: url('/static/images/login/icn_confirm.png') no-repeat;
}
.Login_n ul i.icon-verficode{
    background: url('/static/images/login/icon-verficode.png') no-repeat;
}
.Login_n ul i.icon-jxcs{
    background: url('/static/images/icon-password.png') no-repeat;
}
.Login_n ul i.icon-call{
    background: url('/static/images/login/icn_telephonenumber.png') no-repeat;
}
.Login_n ul i.icon-code{
    background: url('/static/images/login/icon-code.png') no-repeat;
}
.Login_n ul i.icon-message{
    background: url('/static/images/icon-message.png') no-repeat;
}
.Login_n ul i.icon-email{
    background: url('/static/images/icon-email.png') no-repeat;
}
.Login_n ul i.icon-company{
    background: url('/static/images/icon-company.png') no-repeat;
}
.Login_n ul i.icon-unscid{
    background: url('/static/images/icon-unscid.png') no-repeat;
}
/*样式*/
input[type=checkbox]  {  
    display: inline-block;  
    vertical-align: middle;  
    width: 12px;  
    height: 12px;   
    -webkit-appearance: none;  
    background-color: transparent;  
    border: 0;  
    outline: 0 !important;  
    line-height: 12px;  
    color: #d8d8d8;  
    }  
 
input[type=checkbox]:after  {  
    content: "";  
    display:block;   
    width: 12px;  
    height: 12px;  
    text-align: center;  
    line-height: 12px;  
    font-size: 16px;  
    color: #fff;  
    border: 1px solid #ddd;  
    background-color: #fff;    
    box-sizing:border-box;     
    }  
    
input[type=checkbox]:checked:after  {  
    border: 2px solid #ddd;  
    background-color: #EA2530;  
    }  
    
.verficode{ display:block; width:74px; height:25px; position:absolute; margin-top: -33px; margin-left: 215px;}
.Login_n ul input:focus{box-shadow:0px 0px 8px #EA2530; border: 1px solid #EA2530;}
.Login_n .formbar{width:290px; margin:10px auto 0;}
.formbar input#rememberMe{display: block;float: left;margin-top: 3px;}
.kong{visibility: hidden;}
.formbar a{float: right;font-size: 12px;color: #fb6a74;cursor: pointer;}
.btncolor{color: #fb6a74;}
.mt_value{margin-top: 50px;}
#btn_mt{margin-top: 70px;}
.LoginBtn{ margin-top:10px;cursor: pointer; } 
.LoginBtn a{
    display:block; 
    width:200px; 
    height:40px; 
    line-height:40px; 
    margin:0 auto;
    /* background:#EA2530; */
    border-radius:50px; 
    color:#FFF; 
    font-size:16px; 
    font-family:"微软雅黑"; 
    text-align:center; 
    border:1px solid #EA2530;
    cursor: pointer;
    background: -webkit-gradient(linear, left top, left bottom, from(#EF414B), to(#EA2530));
    background: -moz-linear-gradient(top,  #EF414B,  #EA2530);
    filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#faa51a', endColorstr='#f47a20');

}
.LoginBtn a:hover{ 
    display:block; 
    width:200px; 
    height:40px; 
    line-height:40px; 
    margin:0 auto;
    /* background:#EA2530; */
    border-radius:50px; 
    color:#FFF; 
    font-size:16px; 
    font-family:"微软雅黑"; 
    text-align:center; 
    border:1px solid #f47a20;
    cursor: pointer;
    background: -webkit-gradient(linear, left top, left bottom, from(#faa51a), to(#f47a20));
    background: -moz-linear-gradient(top,  #faa51a,  #f47a20);
    filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr='#faa51a', endColorstr='#f47a20');

}
 

/* 输入框 */
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #999;opacity:1; 
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #999;opacity:1;
}
input:-ms-input-placeholder {
    color: #999;opacity:1;
}
input::-webkit-input-placeholder {
    color: #999;opacity:1;
}
/*chrome自动填充变黄处理*/
input:-webkit-autofill {
    -webkit-animation: autofill-fix 1s infinite;
}
@-webkit-keyframes autofill-fix {
    from {
        background-color: transparent
    }
    to {
        background-color: transparent
    }
}
</style>
