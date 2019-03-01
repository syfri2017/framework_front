<template>
  <div>
    <Layout id="AppViewport">
      <Content class="app-body">
        <div class="app-ploter-main">
          <div class="app-ploter-main-body">
            <div class="app-editor-ploter-navigation">
              <div class="ploter-navigation-list">
                <el-button
                  v-for="data in zgtableData"
                  :key="data.uuid"
                  @click="getStage(data.uuid,$event)"
                  class="app-ploter-tools-graphs-menu-item"
                >{{data.zgmc}}</el-button>
              </div>
              <div class="ploter-navigation-tools">
                <el-button
                  class="cancelbtn"
                  v-for="data1 in yxzwData"
                  :key="data1.uuid"
                  icon="el-icon-cancel"
                  id="closebtn"
                  @click="handlerDel($event,data1.uuid)"
                >{{data1.zwh}}</el-button>
                <!-- <el-button icon="el-icon-export"  :disabled="isExportDisabled" class="btn" @click="handlerExport">展馆导出</el-button> -->
              </div>
            </div>
            <!-- 画布容器 -->
            <div class="app-ploter-main-canvas" ref="plotStage"></div>
            <div class="app-ploter-main-mask"></div>
          </div>
        </div>
        <ComponentsBusinessShape @evt_stage_element_remove="doShapeDelete"/>
      </Content>
      <appPloterWidgetMove></appPloterWidgetMove>
      <AppPloterWidgetScale
        v-if="stage"
        :stage="stage"
        @evtStageCfgChanged="onStageCfgChanged"
        @evtStageScaleChanged="onStageScaleChanged"
        @evtStageScaleReset="onStageScaleReset"
      ></AppPloterWidgetScale>
    </Layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import drawLib from "@/views/ploter/draw";
import plotundo from "@/plugins/plotundo";
import {
  exitPlotTool,
  deleteShape
  // ,pasteShape
} from "@/views/ploter/draw/utils";
import {
  prepareStageData,
  prepareStageElements,
  getShapeOnStage,
  clearShapeStyle,
  updateStageBackgroundImg
} from "@/views/ploter/draw/stage";
import { Base64 } from "js-base64";
import { deepClone } from "@/common/ploter/utils";
// 共通组件
import componentsBusinessShape from "@/components/ploter/businessShape";
// 标绘组件
import appPloterBBarMessage from "@/views/ploter/bbar/Message";
import appPloterBBarCoordinate from "@/views/ploter/bbar/Coordinate";
import appPloterBBarStageAttr from "@/views/ploter/bbar/StageAttr";
// widget
import appPloterWidgetScale from "@/views/ploter/widget/Scale";
import appPloterWidgetMove from "@/views/ploter/widget/Move";

export default {
  name: "AppPloterMain",
  components: {
    ComponentsBusinessShape: componentsBusinessShape,
    AppPloterBBarMessage: appPloterBBarMessage,
    AppPloterBBarCoordinate: appPloterBBarCoordinate,
    AppPloterBBarStageAttr: appPloterBBarStageAttr,
    AppPloterWidgetScale: appPloterWidgetScale,
    AppPloterWidgetMove: appPloterWidgetMove
  },
  data() {
    return {
      //上个路由页面传过来的数据
      query: this.$route.query,
      //当前展位数据
      currentBusinessData: {},
      currentUuid: "",
      zguuid: "",
      zgtableData: null,
      yxzwData: [],
      blnbzwsj: "2018-12-27 9:25:34", //显示内部展位时间
      now: "",
      lastEl: null,
      lastEvent: null,
      //显示加载中样
      loading: false,
      shiroData: this.CONSTANT.currentUser,
      stage: null,
      currentPlotTool: null,
      currentPlotActiveItem: null,
      currentPasteItem: null,
      footer: {
        show: false
      },
      coordinateSystem: {
        system: "像素",
        x: 0,
        y: 0
      },
      ploterCfg: {
        readOnly: true,
        businessShape: {
          enable: true,
          requestLoop: 0 // 0为不轮询
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      wrapStageData: "wrapStageData",
      ploterConfig: "ploterConfig",
      stageElements: "stageElements",
      stageSize: "stageSize",
      componentsBusinessShapeData: "componentsBusinessShapeData"
    })
  },
  watch: {},
  created() {
    drawLib.initLocalSetting();
    window.wrapHandshake.$on(
      "evtBusinessShapeSelected",
      this.handlerBusinessShapeSelected
    );
  },
  mounted() {
    this.getNow();
    this.getYxzwData();
    this.initZg();
    setInterval(() => {
      this.refresh();
    }, 30000);
  },
  methods: {
    //lxy 0225 开始
    //初始化当前页面
    initZg() {
      const me = this;
      //获取展馆列表
      me.$axios.post("/zgjbxx/doSearchDataListByVO").then(
        function(res) {
          this.zgtableData = res.data.result;
          if(me.query.uuid){
            this.getStage(this.query.uuid);
            this.query=null
            return
          }
          if (this.zgtableData.length > 0) {
            this.getStage(this.zgtableData[0].uuid);
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    getNow: function() {
      const me = this;
      me.$axios.post("/zwjbxx/getNow").then(
        function(res) {
          this.now = res.data;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    refresh: function() {
      if (this.lastEvent && this.lastEl) {
        this.lastEvent.currentTargetRefresh = this.lastEl;
      }
      this.getStage(this.zguuid, this.lastEvent);
    },
    //已选展位
    getYxzwData: function() {
      const me = this;
      me.$axios.post("/zwjbxx/getSelectedPos").then(
        function(res) {
          if (res.data.result.length > 0) {
            this.yxzwData = res.data.result;
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    handlerDel: function(event, uuid) {
      var el = event.currentTarget;
      this.$confirm("此操作将取消该展位选择, 是否继续?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          if (uuid) {
            var params = {
              uuid: uuid,
              reserve2: 0
            };
            const me = this;
            me.$axios.post("/zwjbxx/doCancelByVO", params).then(
              function(res) {
                if (res.data.msg == "success") {
                  this.yxzwData = [];
                  this.getYxzwData();
                  var businessData = this.back2plot(res.data.result);
                  //需要新增
                  me.$store.dispatch("updateBusinessRecord", businessData);
                  this.$message({
                    message: "展位取消成功",
                    type: "success",
                    center: true
                  });
                  el.style.display = "none";
                } else {
                  var msg = res.data.msg;
                  if (!msg) {
                    msg = "展位取消失败！";
                  }
                  this.$message({
                    message: msg,
                    type: "error",
                    center: true
                  });
                }
              }.bind(this),
              function(error) {
                console.log(error);
              }
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "展位取消成功"
          });
        });
    },
    handlerExport: function() {
      if (this.zguuid) {
        var params = {
          uuid: this.zguuid
        };
        const me = this;
        me.$axios.post("/zgjbxx/doExportTp", params).then(
          function(res) {
            if (res.status == 200) {
              this.$message({
                message: "已将展馆图片发送到您当前账户绑定邮箱，请查收！",
                type: "success",
                center: true
              });
              this.isExportDisabled = true;
            }
          }.bind(this),
          function(error) {
            console.log(error);
          }
        );
      }
    },
    handlerBusinessShapeSelected(data) {
      var msg = "";
      if (this.shiroData.deptid != "ZSYH") {
        return;
      }
      if (this.yxzwData.length > 0) {
        var yxzwxx = "";
        for (var i = 0; i < this.yxzwData.length; i++) {
          if (i == 0) {
            yxzwxx += this.yxzwData[i].zwh;
          } else {
            yxzwxx += "，" + this.yxzwData[i].zwh;
          }
        }
        msg = "您已选择展位" + yxzwxx + " 是否继续选择此展位？";
      } else {
        msg = "是否确定选择此展位?";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          const me = this;
          var params = {
            uuid: data.uuid,
            reserve2: 2
          };
          me.$axios.post("/zwjbxx/doUpdateByVO", params).then(
            function(res) {
              if (res.data.msg == "success") {
                this.yxzwData.push(res.data.result);
                var businessData = this.back2plot(res.data.result);
                //需要新增
                me.$store.dispatch("updateBusinessRecord", businessData);
                this.$message({
                  message: "展位选择成功",
                  type: "success",
                  center: true
                });
              } else {
                var msg = res.data.msg;
                if (!msg) {
                  msg = "选择展位失败！";
                }
                var businessData = this.back2plot(res.data.result);
                //需要新增
                me.$store.dispatch("updateBusinessRecord", businessData);
                this.$alert(
                  '<span style="color:red"><h3>' + msg + "</h3></span>",
                  "注意",
                  {
                    confirmButtonText: "确定",
                    type: "error",
                    dangerouslyUseHTMLString: true
                  }
                );
              }
            }.bind(this),
            function(error) {
              console.log(error);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消选择"
          });
        });
    },
    back2plot(bd) {
      var pd = {};
      pd.uuid = bd.uuid;
      pd.code = bd.zwh;
      pd.codeFontSize = parseInt(bd.bhzh);
      pd.codeFontStyle = bd.bhzc;
      pd.codeFontFamily = bd.bhzt;
      pd.name = bd.zwmc;
      pd.nameFontSize = parseInt(bd.mczh);
      pd.nameFontStyle = bd.mczc;
      pd.nameFontFamily = bd.mczt;
      //展位类型
      pd.boothType = bd.zwlb;
      //出口类型
      pd.entryType = bd.cklx;
      //企业名称
      pd.tenantName = bd.qymc;
      pd.lateralLength = bd.zwcd;
      pd.verticalLength = bd.zwkd;
      pd.area = parseInt(bd.zwmj);
      pd.status = bd.zwzt;
      pd.stageUuid = bd.zgid;
      pd.shapeUuid = bd.reserve1;
      pd.tenantId = bd.qyid;
      if (pd.tenantName) {
        if (bd.gsjc != null && parseInt(bd.zwmj) <= 12) {
          pd.name = bd.gsjc;
          pd.tenantName = bd.gsjc;
        } else {
          pd.name = pd.tenantName;
        }
      }
      // blnbzwsj 显示内部展位时间
      if (this.compareDate(this.blnbzwsj, this.now)) {
        //如果展位状态为内部预留则展位显示初始状态
        if (bd.reserve2 && bd.reserve2 != "0") {
          if (backData.length > 1) {
            pd.status = "normal";
          }
          pd.name = "";
          pd.tenantName = "";
        }
      }
      //当前企业查看本公司展位为红色
      for (var j in this.yxzwData) {
        if (this.yxzwData[j].zwh == bd.zwh) {
          pd.status = "allotted";
          if (bd.qymc) {
            pd.name = bd.qymc;
          }
        }
      }
      return pd;
    },
    compareDate(d1, d2) {
      return new Date(d1.replace(/-/g, "/")) > new Date(d2.replace(/-/g, "/"));
    },
    plot2back(plotData) {
      var backData = [];
      for (var i = 0; i < plotData.length; i++) {
        var pd = plotData[i];
        var bd = {};
        bd.uuid = pd.uuid;
        bd.zwh = pd.code;
        bd.bhzh = pd.codeFontSize;
        bd.bhzc = pd.codeFontStyle;
        bd.bhzt = pd.codeFontFamily;
        bd.zwmc = pd.name;
        bd.mczh = pd.nameFontSize;
        bd.mczc = pd.nameFontStyle;
        bd.mczt = pd.nameFontFamily;
        //展位类型
        bd.zwlb = pd.boothType;
        //出口类型
        bd.cklx = pd.entryType;
        //企业名称
        bd.qymc = pd.tenantName;
        bd.zwcd = pd.lateralLength;
        bd.zwkd = pd.verticalLength;
        bd.zwmj = pd.area;
        bd.zwzt = pd.status;
        bd.zgid = pd.stageUuid;
        bd.reserve1 = pd.shapeUuid;
        bd.qyid = pd.tenantId;
        backData.push(bd);
      }
      return backData;
    },

    //lxy 0225 结束

    getStage(uuid, event) {
      const me = this;
      if (event) {
        this.lastEvent = event;
        var el = event.currentTarget;
        if (!el && event.currentTargetRefresh) {
          el = event.currentTargetRefresh;
        }
        if (this.lastEl) {
          this.lastEl.style.background = "#0684E5";
          this.lastEl.disabled = false;
        }
        if (el) {
          this.lastEl = el;
          el.style.background = "#666666";
          el.disabled = true;
        }
      }
      window.moftPloter = {};
      var params = {
        uuid: uuid
      };
      this.zguuid = uuid;
      me.$axios.post("/zgjbxx/doSearchHbMKListByVO", params).then(
        function(res) {
          var currentAreaStage = res.data.result.zgjbxxVOs[0].zgzwhbStr;
          var currentShapesData = res.data.result.zwmoJsonDatas;
          var stageRecord = {
            stageData: currentAreaStage,
            shapesData: currentShapesData,
            uuid: params.uuid
          };
          me.$store.commit("updateStageData", stageRecord);
          me.initPloter(currentAreaStage || null, currentShapesData || null);
          plotundo.init();
          me.initBusinessData(params.uuid);
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    initBusinessData(zgid) {
      const me = this;
      var params1 = {
        zgid: zgid
      };
      me.$axios.post("/zwjbxx/doSearchListByVO", params1).then(
        function(res) {
          var businessData = [];
          for (var i = 0; i < res.data.result.length; i++) {
            businessData.push(this.back2plot(res.data.result[i]));
          }
          // 外到里call 里到外emit
          me.$store.commit("updateBusinessShapeData", businessData);
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    initPloter(stageData, shapesData) {
      const me = this;
      me.$store.commit("updatePloterCongig", this.ploterCfg);
      if (!stageData) {
        if (me.stage) {
          const warn = confirm(
            "现在执行新建操作将放弃对当前画布做出的修改，\n点击确认按钮前请确认您的标绘成果已经保存。"
          );
          if (warn === true) {
            me.stage.destroy();
          }
        }
        const createCfg = me.ploterConfig.createCfg;
        if (createCfg) {
          if (createCfg.type === "img") {
            stageData = drawLib.createEmptyStageData({
              width: createCfg.width,
              height: createCfg.height,
              backgroundImage: createCfg.from
            });
            me.initStage(stageData, ".app-ploter-main-canvas");
          }
        } else {
          stageData = drawLib.createEmptyStageData();
          me.initStage(stageData, ".app-ploter-main-canvas");
        }
      } else {
        let stageDataObj = JSON.parse(stageData);
        stageDataObj.children[1].children = shapesData || [];
        me.initStage(stageDataObj, ".app-ploter-main-canvas");
      }
      if (!this.ploterConfig.readOnly) {
        me.footer.show = true;
      }
    },
    initStage(stageData, wrap) {
      const me = this;
      if (window.ploterStage) {
        window.ploterStage.destroy();
      }
      function onWindowReady() {
        if (window.innerWidth > 0) {
          const data = prepareStageData(stageData);
          me.$store.commit("updateStageSize", {
            width: data.attrs.width,
            height: data.attrs.height
          });
          // 画布比窗口大，设置为窗口大小
          if (data.attrs.width >= window.innerWidth) {
            data.attrs.width = window.innerWidth;
            data.attrs.height = window.innerHeight;
          }
          const stage = Konva.Node.create(data, wrap);
          me.stage = stage;
          window.ploterStage = stage;
          //  stage 存到store
          me.$store.commit("updatePloterStage", stage);
          me.setStageLayout();
          drawLib.reloadShapes(stage);
          me.initStageEvent(stage);
        } else {
          setTimeout(() => {
            onWindowReady();
          }, 100);
        }
      }
      onWindowReady();
    },
    initStageEvent(stage) {
      const me = this;
      if (!this.ploterConfig.readOnly) {
        stage.on("mousedown", e => {
          const mouseButton = e.evt.button;
          const targetShape = e.target;
          const targetShapeName = targetShape.getAttr("name");
          // ===============
          // 事件转发部分
          // ===============
          // 如果鼠标左键落下处不是交互工具，
          // 那基本不是要标绘就是要激活或取消激活交互工具
          if (mouseButton === 0) {
            // 左键单击
            if (
              targetShapeName !== "shapeAnchor" &&
              targetShape.parent.className !== "Transformer"
            ) {
              // 如果当前有激活的标绘工具，
              // 那么所有在底图上的左键单击都是画图
              if (me.currentPlotTool) {
                stage.fire("evt-draw", e);
                // }
              } else {
                // 如果当前没有激活的标绘工具，
                // 那么所有在画布上的左键单击都是选取(除了画布本身)
                if (targetShape.nodeType !== "Stage") {
                  if (
                    targetShape.getId() !== "stageBackgroundArea" ||
                    targetShape.getId() !== "stageBackgroundImg"
                  ) {
                    me.doSelectShape(targetShape);
                  }
                }
              }
            }
          } else {
            // 右/中键单击
            // 如果鼠标右/中键落下，
            // 那就是要取消激活标绘工具和交互工具
            me.doExitPlotTool();
          }
        });
        stage.on("evt_stage_element_changed", event => {
          let stageData = event.target.toJSON();
          prepareStageElements(JSON.parse(stageData));
          window.focus();
        });
        const plotStageEl = me.$refs.plotStage.querySelector(
          ".konvajs-content"
        );
        plotStageEl.addEventListener("mousemove", e => {
          const point = stage.getPointerPosition();
          me.coordinateSystem.x = point.x;
          me.coordinateSystem.y = point.y;
        });
        plotStageEl.addEventListener("mouseout", e => {
          me.coordinateSystem.x = null;
          me.coordinateSystem.y = null;
        });
        // 键盘事件
        window.addEventListener("keydown", event => {
          // console.log('event', event)
          // if (event.keyCode === 46) { // del键：删除选中
          //     if (me.currentPlotActiveItem) {
          //         me.doShapeDelete(me.currentPlotActiveItem)
          //     }
          // } else
          if (event.keyCode === 27) {
            // ESC键：中断绘制
            stage.fire("evt-stop");
            me.currentPlotActiveItem = null;
            // } else if (event.keyCode === 67 && event.ctrlKey) { // Ctrl+C
            //     if (me.currentPlotActiveItem && me.currentPlotActiveItem.className === 'MoftArrowLine') {
            //         alert('当前元素不支持复制粘贴操作')
            //     } else {
            //         me.currentPasteItem = me.currentPlotActiveItem
            //     }
            // } else if (event.keyCode === 86 && event.ctrlKey) { // Ctrl+V
            //     if (me.currentPasteItem) {
            //         pasteShape(me.currentPasteItem)
            //     }
            // } else if (event.keyCode === 90 && event.ctrlKey) { // Ctrl+Z
            //     if (window.plotstack.canUndo()) {
            //         window.plotstack['undo']()
            //     } else {
            //         alert('无可撤销内容')
            //     }
            // } else if (event.keyCode === 89 && event.ctrlKey) { // Ctrl+Y
            //     if (window.plotstack.canRedo()) {
            //         window.plotstack['redo']()
            //     } else {
            //         alert('无可恢复内容')
            //     }
          }
        });
      }
      // 屏蔽画布上的浏览器右键菜单
      me.$refs.plotStage.oncontextmenu = function() {
        return false;
      };
      // 浏览器调整大小后，重设画布布局
      window.addEventListener("resize", e => {
        me.onWindowResize();
      });
      // 激活一下子窗口，以捕获window下事件
      window.focus();
    },
    onSelectFile() {
      this.$refs.loadInput.click();
    },
    onSelectedPlotFile(e) {
      const me = this;
      const file = e.target.files[0];
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = e => {
          const content = e.target.result.replace("data:;base64,", "");
          const stageData = JSON.parse(Base64.decode(content));
          if (!stageData.attrs.mplot) {
            alert("文件无效，请选择.mplot后缀的云帆标绘文件");
            return;
          }
          if (me.stage) {
            const warn = confirm(
              "现在打开标绘文件将放弃对当前画布做出的修改，\n点击确认按钮前请确认您的标绘成果已经保存。"
            );
            if (warn === true) {
              me.initPloter(stageData);
            }
          }
          this.$refs.loadInput.value = "";
        };
        reader.readAsDataURL(file);
      } else {
        alert("您的浏览器版本太低，请升级。");
      }
    },
    onToolSelected() {
      var tool = this.area[0];
      if (this.stage) {
        this.stage.fire("evt-stop");
        this.currentPlotTool = tool;
        this.initPlotTool();
      }
    },
    onStageCfgChanged(cfg) {
      drawLib.applyStageCfg(this.stage, cfg);
    },
    onStageScaleChanged(value) {
      this.doStageScale(value);
    },
    onStageScaleReset() {
      this.doStageScaleReset();
    },
    onSelectShape(shapeUuid) {
      const me = this;
      const shape = getShapeOnStage(shapeUuid);

      if (shape) {
        me.doSelectShape(shape.findOne(".mainShape"));
      }
    },
    initPlotTool() {
      if (!this.currentPlotTool) return;
      const toolCfg = { ...deepClone(this.currentPlotTool) };
      const stage = this.stage;
      drawLib.initPlotTool(toolCfg, stage);
    },
    doShapeDelete(shape) {
      const stage = this.stage;
      const shapeWrap = shape.findAncestor(".shapeWrap");
      deleteShape(shape);
      stage.fire("evt_stage_element_changed", {
        changeType: "delete",
        element: shapeWrap
      });
      this.currentPlotActiveItem = null;
    },
    doExitPlotTool() {
      const me = this;
      const stage = me.stage;
      stage.fire("evt-stop");
      exitPlotTool(stage);
      me.currentPlotTool = null;
      me.currentPlotActiveItem = null;
    },
    doSelectShape(target) {
      const me = this;
      const targetWrap = target.findAncestor(".shapeWrap");
      const targetMain = targetWrap.findOne(".mainShape");
      targetMain.fire("evt-active", targetMain);
      me.currentPlotActiveItem = targetMain;
    },
    doStageScale(value) {
      const stage = this.stage;
      let ploterMainBody = document.querySelector(".app-ploter-main-body");
      // const ploterWrap = document.querySelector('.konvajs-content')
      const ploterWrapSize = {
        width: Math.round(this.stageSize.width * value),
        height: Math.round(this.stageSize.height * value)
      };
      ploterMainBody.style.width = ploterWrapSize.width + "px";
      ploterMainBody.style.height = ploterWrapSize.height + "px";
      // stage.setAttrs({
      //     width: ploterWrapSize.width,
      //     height: ploterWrapSize.height
      // })
      stage.scale({
        x: value,
        y: value
      });
      stage.draw();
      stage.fire("evt_stage_scale_changed", {
        scaleLevel: value
      });
      // this.setStageLayout()
    },
    doStageScaleReset() {
      const stage = this.stage;
      let ploterMainBody = document.querySelector(".app-ploter-main-body");
      // const ploterWrap = document.querySelector('.konvajs-content')

      ploterMainBody.style.width = this.stageSize.width + "px";
      ploterMainBody.style.height = this.stageSize.height + "px";
      // stage.setAttrs({
      //     width: this.stageSize.width,
      //     height: this.stageSize.height
      // })
      stage.scale({
        x: 1,
        y: 1
      });
      stage.draw();
      stage.fire("evt_stage_scale_changed", {
        scaleLevel: 1
      });
      // this.setStageLayout()
    },
    setStageLayout() {
      const me = this;
      // const plotStageEl = me.$refs.plotStage
      const stage = me.stage;

      let ploterMain = document.querySelector(".app-ploter-main");
      let ploterMainBody = document.querySelector(".app-ploter-main-body");

      ploterMainBody.style.width = me.stageSize.width + "px";
      ploterMainBody.style.height = me.stageSize.height + "px";
      window.ploterScroll = {
        top: ploterMain.scrollTop,
        left: ploterMain.scrollLeft
      };
      ploterMain.addEventListener("scroll", function() {
        let dx = ploterMain.scrollLeft;
        let dy = ploterMain.scrollTop;
        stage.container().style.transform =
          "translate(" + dx + "px, " + dy + "px)";
        stage.x(-dx);
        stage.y(-dy);
        stage.batchDraw();
        window.ploterScroll = {
          top: dy,
          left: dx
        };
      });
      // let wrapWidth = window.innerWidth
      // if (me.currentPlotActiveItem) {
      //     wrapWidth = window.innerWidth - 320
      // }

      // if (wrapWidth > stage.width()) {
      //     plotStageEl.setAttribute('data-layout-center', true)
      // } else {
      //     plotStageEl.removeAttribute('data-layout-center')
      // }
    },
    onWindowResize() {
      const stage = this.stage;
      stage.setWidth(window.innerWidth);
      stage.setHeight(window.innerHeight);
    },

    onBeforeSave() {
      const me = this;
      let ploterMain = document.querySelector(".app-ploter-main");
      ploterMain.scrollTo(0, 0);
      me.stage.x(0);
      me.stage.y(0);
      me.stage.fire("evt-stop");
      exitPlotTool(me.stage);
      me.currentPlotTool = null;
      me.currentPlotActiveItem = null;
      me.doStageScaleReset();
      me.stage.width(me.stageSize.width);
      me.stage.height(me.stageSize.height);
      clearShapeStyle();
    },
    // 发射画布数据
    emitSaveData() {
      const me = this;
      me.onBeforeSave();
      function checkFlags() {
        if (window.moftPloter.shapeFeatureChangeCount === 0) {
          let jsonData = me.stage.toJSON();
          const dataUrl = me.stage.toDataURL();
          const data = {
            stageUuid: me.wrapStageData.uuid,
            jsonData: jsonData,
            picData: dataUrl,
            businessData: me.componentsBusinessShapeData
          };
          window.wrapHandshake.emit("evtSaveDataReady", data);
        } else {
          setTimeout(() => {
            checkFlags();
          }, 300);
        }
      }
      checkFlags();
    }
  }
};
</script>

<style lang="scss">
@import "~@/assets/app.scss";
</style>
<style lang="scss" scoped>
.content[data-v-57ee01a8] {
  overflow-y: hidden;
}
#menu-toggle-btn {
  right: -26px;
  transform: rotateY(180deg);
}

.app-editor {
  width: 960px;
  margin: 16px auto;
}

.app-editor-list-item {
  display: flex;
  flex-direction: column;
  float: left;
  width: 300px;
  height: 240px;
  margin: 10px;
  > {
    .ivu-card-extra {
      top: 8px;
      right: 8px;
      .ivu-btn-text {
        padding: 4px 8px;
      }
      .ivu-icon {
        font-size: 16px;
      }
    }
    .ivu-card-body {
      position: relative;
      flex: 1;
      padding: 8px;
      background-color: #fafafa;
    }
  }
}

.app-editor-list-item-add {
  text-align: center;
  > .ivu-icon {
    line-height: 140px;
    font-size: 80px;
    font-weight: bold;
  }
}

.app-editor-list-item-thumb {
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}

.app-editor-ploter-wrap {
  flex-direction: column;
  background-color: #666;
}
/* 展位选择右侧按钮样式 */
.cancelbtn {
  border: 0px;
  height: 30px;
  line-height: 0px;
  background: rgb(243, 26, 55);
  color: #fff;
  margin: 5px 3px 5px 3px;
  padding-left: 35px;
}
.app-ploter-tools-graphs-menu-item {
  height: 30px;
  line-height: 0px;
  background: #0684e5;
  color: #fff;
  margin: 5px 3px 5px 0px;
}
.app-editor-ploter-navigation {
  position: fixed;
  z-index: 9999;
  display: flex;
  height: 40px;

  // border-bottom: 1px solid #eee;
  > {
    .ploter-navigation-list {
      flex: 1;
      line-height: 36px;
      font-size: 16px;
      text-indent: 24px;
    }
    // .ploter-navigation-tools {
    //   padding: 4px;
    //   position: absolute;
    //   top: -8px;
    //   left: 1300px;
    // }
  }
}

.app-editor-ploter-iframe {
  display: block !important;
  flex: 1;
  border: none;
}

.app-editor-create-model > .file-name {
  margin-left: 16px;
}

.app-editor-cropper-model > {
  .ivu-modal-body {
    padding: 0;
  }
  .moft-cropper {
    height: 64vh !important;
  }
}

.positionlist {
  // height: 100%;
  overflow: hidden;

  -webkit-transition-duration: 0.3s;
  -moz-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  -ms-transition-duration: 0.3s;
}

.imagez {
  float: left;
  width: 100px;
  height: 100px;
  padding: 5px;
}

.box-card {
  float: left;
  width: 130px;
  margin: 5px;
}

.box-cardz {
  float: left;
  width: 270px;
  margin: 5px;
}

.text {
  font-size: 14px;
}

.clearfix {
  font-weight: bold;
  text-align: center;
}
</style>