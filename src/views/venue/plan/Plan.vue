<template>
  <div id="plan">
   <div class="containers clearfix">
                <div class="zgzongpmt">
                <div class="title">
                    <span>展馆平面图</span>
                </div>
                <div class="content">
                    <div class="west">南登录厅</div>
                <div class="south">东登录厅</div>
                <div class="east">西登录厅</div>
                    <div class="north"><a href="javascript:;" @click="planClick('B409603791EE41E4988C8177843810DB')"  target="_blank">室外展区</a></div>
                    <!-- <div class="north"><a href="javascript:;" @click="planClick('7DBEDCE714DBEC8DE050007F01003EF1')"  target="_blank">室外展区</a></div> -->
                <div class="wqu ">
                    <ul class="clearfix">
                    <li>
                        <h1><span><a href="javascript:;" @click="planClick('7D5D040F274DAE6EE050007F010038F8')"  target="_blank">装备器材类展区</a></span></h1>
                        <!-- <h1><span><a target="_blank">装备器材类展区</a></span></h1> -->
                        <h2>卸货区</h2>
                        <!-- <h1><span><a href="javascript:;" @click="planClick('9494385990084C7B9AA05256A3F5E052')"  target="_blank">综合馆</a></span></h1>
                    -->
                    <h1><span><a   target="_blank">综合馆</a></span></h1>
                    </li>
                    <li class="double sec">
                        <h1><span><a href="javascript:;" @click="planClick('7D6E36A4AFD76787E050007F010078DA')" target="_blank">装备器材类展区</a></span></h1>
                        <h2>卸货区</h2>
                        <h1><span><a href="javascript:;" @click="planClick('7D702E88928B3ABFE050007F0100591B')" target="_blank">消防车辆类展区</a></span></h1>
                        <!-- <h1><span><a  target="_blank">装备器材类展区</a></span></h1>
                        <h2>卸货区</h2>
                        <h1><span><a  href="javascript:;" @click="planClick('7D702E88928B3ABFE050007F0100591B')" target="_blank">消防车辆类展区</a></span></h1>  -->
                    </li>
                    <li>
                        <h1><span><a href="javascript:;" @click="planClick('7D6C9486A4F3BD83E050007F01002DC8')" target="_blank">建筑防火类展区</a></span></h1>
                        <h2>卸货区</h2>
                        <h1><span><a href="javascript:;" @click="planClick('7D6E5081F9236243E050007F010078E8')" target="_blank">建筑防火类展区</a></span></h1>
                        <!-- <h1><span><a  target="_blank">建筑防火类展区</a></span></h1>
                        <h2>卸货区</h2>
                        <h1><span><a  target="_blank">建筑防火类展区</a></span></h1> -->
                    </li>
                    <li class="double">
                        <h1><span><a href="javascript:;" @click="planClick('7D702E88928A3ABFE050007F0100591B')" target="_blank">消防车辆类展区</a></span></h1>
                        <h2>卸货区</h2>
                        <h1><span><a href="javascript:;" @click="planClick('7D6E508202416243E050007F010078E8')" target="_blank">消防车辆类展区</a></span></h1>
                    </li>
                    </ul>
     
                </div>
     </div>
  </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'plan',
  methods: {
      planClick(uuid) {
		  let fullpath=this.$route.fullPath
		  if(fullpath.indexOf("Anon")>0){
			this.$router.push({ path: '/booth/anon' ,query: {uuid: uuid}})	
			return	  
		  }
		  if(this.CONSTANT.currentUser.deptid != "ZSYH"){
			this.$router.push({ path: '/booth/positionDesign' ,query: {uuid: uuid}})
		  }else{
			this.$router.push({ path: '/booth/select' ,query: {uuid: uuid}})
		  }
      }
  }
}
</script>

<style>

.zgzongpmt{
	border:1px solid #e0e0e0;
}
.zgzongpmt .title{
	border-bottom:1px solid #e0e0e0;
	text-align:center;
	height: 40px;
}
.zgzongpmt .title span{
	display:inline-block;
	padding:5px;
	/* border-bottom:3px solid #dd0000; */
	margin-bottom:-1px;
	font-size:20px;
	color:#000;
	font-weight:bold;
}
.zgzongpmt .content{
	background:url(/static/images/venue/zhanguan_zong.jpg) center 20px no-repeat;
	height:900px;
	position:relative;
}
.zgzongpmt .content .east,.zgzongpmt .content .west,.zgzongpmt .content .south{
	position:absolute;
	width:120px;
	text-align:center;
	font-family:"微软雅黑";
	font-size:16px;
	line-height:40px;
}
.zgzongpmt .content .east{
	left:28px;
	top:413px;
}
.zgzongpmt .content .south{
	right:16px;
	top:280px;
}
.zgzongpmt .content .west{
	bottom:70px;
	left:437px;
}
.zgzongpmt .wqu{
	width:780px;
	margin:0px 0 0 176px;
	padding-top:80px;
}
.zgzongpmt .wqu li{
	float:left;
	width:255px;
	height:270px;
	margin-right:130px;
	margin-bottom:30px;
}
.zgzongpmt .wqu li h1{
	height:110px;
	font-size:24px;
	font-family:"微软雅黑";
	padding-left:68px;
	font-weight:normal;
}
.zgzongpmt .wqu li h1 span{
	padding-top:40px;
	display:block;
}
.zgzongpmt .wqu li h1 a:hover{
	color: #00F;
	font-weight: bold;
}
.zgzongpmt .wqu li h2{
	line-height:50px;
	color:#fff;
	margin-left:20px;
	width:180px;
	text-align:center;
	font-weight:normal;
}
.zgzongpmt .wqu li.double h1{
	padding-left:55px;
}
.zgzongpmt .wqu li.double h2{
	margin-left:60px;
}
.zgzongpmt .wqu li.sec h1{
	height:105px;
}
.zgzongpmt .wqu li.sec h1 span{
	padding-top:34px;
}
.zgzongpmt .wqu li.sec h2{
	margin-top:10px;
	line-height:42px;
}

.zgzongpmt .wqu_en li h1{
	font-size:14px;
	font-family:Arial;
}
.north{
    top:535px;
    right:30px;
    position:absolute;
    font-size:24px;
    font-family:"微软雅黑";
}
.clearfix{
  clear:both;
  overflow:hidden;
}
.containers{
  width:980px;
  margin:0 auto;
	margin-top: 10px;
}
.min-containers{
	min-width:980px;
}
</style>
