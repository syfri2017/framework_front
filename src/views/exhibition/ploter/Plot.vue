<template>
  <div style="display:flex;flex:1;flex-direction: column;">
    <Layout id="AppViewport">
      <Content class="app-body">
        <div class="app-ploter-main">
          <div class="app-ploter-main-body">
            <div
              ref="ploterWrap"
              v-loading="loading"
              element-loading-text="加载中"
              class="app-editor-ploter-wrap positionlist"
            >
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
                  <el-button icon="el-icon-position" class="btn" @click="onToolSelected">绘制展位</el-button>
                </div>
              </div>
            </div>

            <!-- 画布容器 -->
            <div class="app-ploter-main-canvas" ref="plotStage"></div>
            <div class="app-ploter-main-mask"></div>
          </div>
        </div>
        <ComponentsBusinessShape @evt_stage_element_remove="doShapeDelete"/>
      </Content>
      <appPloterWidgetMove class="fx"></appPloterWidgetMove>
      <AppPloterWidgetScale
        v-if="stage"
        :stage="stage"
        @evtStageCfgChanged="onStageCfgChanged"
        @evtStageScaleChanged="onStageScaleChanged"
        @evtStageScaleReset="onStageScaleReset"
        class="plusmin"
      ></AppPloterWidgetScale>
      <!-- <Footer class="app-footer app-state-bar" v-if="footer.show">
        <AppPloterBBarMessage
            :plotTool="currentPlotTool"
        ></AppPloterBBarMessage>
        <AppPloterBBarCoordinate
            :coordinate="coordinateSystem"
        ></AppPloterBBarCoordinate>
        <AppPloterBBarStageAttr
            :stage="stage"
            @evtStageCfgChanged="onStageCfgChanged"
            @evtStageScaleChanged="onStageScaleChanged"
            @evtStageScaleReset="onStageScaleReset"
        ></AppPloterBBarStageAttr>
      </Footer>-->
    </Layout>
    <el-dialog
      title="选择企业"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
    >
      <!-- 选择企业 -->
      <div id="tableView">
        <el-row>
          <el-col :span="17" class="searchInline">
            <label class="el-form-item__label" style="width:95px;">公司名称</label>
            <el-input size="small" v-model="searchForm.gsmc" placeholder="公司名称" clearable></el-input>
          </el-col>
          <el-col :span="7" class="btnSearchPlus">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchClick">查询</el-button>
            <el-button type="clear" icon="el-icon-refresh" size="small" @click="clearClick">重置</el-button>
          </el-col>
        </el-row>
        <div class="table_container">
          <el-table
            id="table"
            border
            class="tableStyle poi"
            :height="tableheight"
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            highlight-current-row
            row-style="height:40px"
            @row-click="confirm"
          >
            <el-table-column
              type="index"
              label="序号"
              show-overflow-tooltip
              width="65"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="zwgsmc"
              label="公司名称"
              show-overflow-tooltip
              min-width="25%"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.usertype == 'ENG'" v-text="scope.row.ywgsmc"></span>
                <span v-else v-text="scope.row.zwgsmc"></span>
              </template>
            </el-table-column>
            <el-table-column
              prop="tyshxydm"
              label="统一社会信用代码"
              show-overflow-tooltip
              min-width="20%"
              align="center"
              :formatter="tableLongNumFormat"
            ></el-table-column>
            <el-table-column
              prop="wz"
              label="公司网址"
              show-overflow-tooltip
              min-width="20%"
              align="center"
            ></el-table-column>
          </el-table>
          <!--列表底部工具条和分页符-->
          <el-row type="flex" justify="end">
            <el-col :span="18">
              <el-pagination
                @current-change="currentPageChange"
                @size-change="pageSizeChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="parseInt(total)"
              ></el-pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import drawLib from "./draw";
import plotundo from "@/plugins/plotundo";
import {
  exitPlotTool,
  deleteShape
  // ,pasteShape
} from "./draw/utils";
import {
  prepareStageData,
  prepareStageElements,
  getShapeOnStage,
  clearShapeStyle,
  updateStageBackgroundImg
} from "./draw/stage";
import { Base64 } from "js-base64";
import { deepClone } from "@/common/ploter/utils";
// 共通组件
import componentsBusinessShape from "@/components/ploter/businessShape";
// 标绘组件
import appPloterBBarMessage from "./bbar/Message";
import appPloterBBarCoordinate from "./bbar/Coordinate";
import appPloterBBarStageAttr from "./bbar/StageAttr";
// widget
import appPloterWidgetScale from "./widget/Scale";
import appPloterWidgetMove from "./widget/Move";

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
      zgtableData: null,
      //当前展位数据
      currentBusinessData: {},
      //搜索表单
      searchForm: {
        gsmc: ""
      },
      //显示加载中样
      loading: false,
      //当前页
      currentPage: 1,
      //分页大小
      pageSize: 10,
      //总记录数
      total: 0,
      shiroData: [], //当前用户信息
      shztData: [], //审核状态下拉框
      currentRow: "", //选中行数据
      isReject: false, //未通过flag
      previewTitle: "",
      previewImg: "",
      imgViewVisible: false,
      approveFormVisible: false,
      //弹出框是否打开
      dialogVisible: false,
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
      //展位图标
      area: [
        {
          name: "展位",
          id: "base_text_jxwbk",
          src: "../../static/images/plot/tools/base/jxwbk",
          type: "area",
          businessCode: "AREA",
          businessShape: true,
          style: {
            shapeType: "rectangle",
            textShape: [
              {
                alias: "code",
                text: "code",
                fontFamily: "simsun",
                fill: "#666",
                fontSize: 10,
                padding: 4,
                align: "left",
                verticalAlign: "top"
              },
              {
                alias: "name",
                text: "名称",
                fontFamily: "simsun",
                fill: "#666",
                fontSize: 14,
                fontStyle: "bold",
                align: "center",
                verticalAlign: "middle"
              }
            ],
            mainShape: {
              stroke: "#666",
              strokeWidth: 1,
              fill: "#eaeaea",
              fillPriority: "color"
            }
          }
        }
      ],
       ploterCfg: {
            readOnly: false,
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
    window.wrapHandshake.$on("evtStageElementSave", this.savePlotData);
    window.wrapHandshake.$on("evtBusinessDataAllot", this.allotBusinessData);
    window.wrapHandshake.$on(
      "evtBusinessDataUnAllot",
      this.evtBusinessDataUnAllot
    );
    window.wrapHandshake.$on(
      "evtStageElementRemove",
      this.evtStageElementRemove
    );
  },
  mounted() {
    const me = this;
    // const postmate = new Postmate.Model({
    //     saveHandler: me.emitSaveData,
    //     selectToolHandler: me.onToolSelected,
    //     updateBackgroundImage: updateStageBackgroundImg
    // })

    // postmate.then(function (handshake) {
    //     window.moftPloter = {}
    //     window.wrapHandshake = handshake
    //     const stageRecord = handshake.model.stageRecord
    //     me.$store.commit('updateStageData', stageRecord)
    //     const ploterCfg = handshake.model.config
    //     if (ploterCfg) {
    //         me.$store.commit('updatePloterCongig', ploterCfg)
    //     }
    //     me.initPloter(stageRecord.stageData || null, stageRecord.shapesData || null)
    // })
    // plotundo.init()

    // me.ploterCfg = {
    //             readOnly: false,
    //             businessShape: {
    //                 enable: true,
    //                 requestLoop: 0 // 0为不轮询
    //             }}
    this.initZg();
  },
  methods: {
    //lxy 0225 开始
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
    //指定展位
    allotBusinessData(businessData) {
      this.currentBusinessData = businessData;
      if (!this.isSaved()) {
        return;
      }
      this.dialogVisible = true;
      this.searchClick("page");
    },
    /**
     *选择企业信息
     */
    //表格查询事件
    searchClick: function(type) {
      const me = this;
      //按钮事件的选择
      if (type == "page") {
        this.tableData = [];
      } else if (type == "delete") {
      } else {
        this.currentPage = 1;
      }
      this.loading = true; //表格重新加载
      var params = {
        gsmc: this.searchForm.gsmc.replace(/%/g, "\\%"),
        // yjdz: this.searchForm.yjdz,
        //shzt: this.searchForm.shzt,
        shzt: "03",
        approveflag: "y",
        pageSize: this.pageSize,
        pageNum: this.currentPage
      };
      me.$axios.post("/qyjbxx/page", params).then(
        function(res) {
          var tableTemp = new Array((this.currentPage - 1) * this.pageSize);
          this.tableData = tableTemp.concat(res.data.result.list);
          this.total = res.data.result.total;
          this.loading = false;
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //清空查询条件
    clearClick: function() {
      this.searchForm.gsmc = "";
      this.searchForm.yjdz = "";
      this.searchForm.shzt = "01";
      this.searchClick("reset");
    },
    //确认功能
    confirm(val) {
      const me = this;
      var params = {
        uuid: this.currentBusinessData.uuid,
        qyid: val.qyid
      };
      me.$axios.post("/zwjbxx/doAssign", params).then(
        function(res) {
          if (res.data.msg == "success") {
            var businessData = this.back2plot(res.data.result);
            //需要新增
            me.$store.dispatch("updateBusinessRecord", businessData);
            this.currentBusinessData.qyid = {};
            this.dialogVisible = false;
            this.$message({
              message: "展位指定成功",
              type: "success",
              center: true
            });
          } else {
            var msg = res.data.msg;
            if (!msg) {
              msg = "展位指定失败！";
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
    },
    //取消指定
    evtBusinessDataUnAllot(businessData) {
      const me = this;
      if ("normal" == businessData.status) {
        this.$message({
          message: "当前展位未指定，请先右键指定展位！",
          type: "warning",
          center: true
        });
      }
      this.currentBusinessData = businessData;
      if (!this.isSaved()) {
        return;
      }
      var params = {
        uuid: businessData.uuid
      };
      me.$axios.post("/zwjbxx/doCancelByVO", params).then(
        function(res) {
          if (res.data.msg == "success") {
            var businessData = this.back2plot(res.data.result);
            //需要新增
            me.$store.dispatch("updateBusinessRecord", businessData);
            this.currentBusinessData.qyid = {};
            this.dialogVisible = false;
            this.$message({
              message: "展位取消指定成功",
              type: "success",
              center: true
            });
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //删除展位
    evtStageElementRemove(businessData) {
      const me = this;
      var zwjbxxVO = {};
      var zwmkVO = {};
      zwjbxxVO.uuid = businessData.businessUuid;
      zwmkVO.shapeUuid = businessData.shapeUuid;
      var params = {
        zwjbxxVO: zwjbxxVO,
        zwmkVO: zwmkVO
      };
      me.$axios.post("/zwjbxx/doDelByVO", params).then(
        function(res) {
          this.$message({
            message: "删除展位成功",
            type: "warning",
            center: true
          });
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },
    //保存展馆展位数据
    savePlotData(data) {
      const me = this;

      var business = data.business;
      var shape = data.shape;
      shape.stageUuid = business.stageUuid;
      //this.isDisabled = true
      var params = {
        zwjbxxVO: this.plot2back(business),
        zwmkVO: shape
      };
      me.$axios.post("/zwjbxx/doSaveByVO", params).then(
        function(res) {
          if (res.data.result) {
            var businessData = this.back2plot(res.data.result);
            //需要新增
            me.$store.dispatch("updateBusinessRecord", businessData);
            this.$message({
              message: "保存展位成功",
              type: "success",
              center: true
            });
          }
        }.bind(this),
        function(error) {
          console.log(error);
        }
      );
    },

    //lxy 0225 结束

    getStage(uuid,event) {
      const me = this;
      if (event) {
        this.lastEvent = event;
        if (this.lastEl) {
          this.lastEl.style.background = "#0684E5";
          this.lastEl.disabled = false;
        }
        var el = event.currentTarget;
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
      //this.zguuid = uuid
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
        window.ploterStage = null
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
      //
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
    },
    //展会后台数据转绘图工具数据
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
      pd.lateralLength = parseInt(bd.zwcd);
      pd.verticalLength = parseInt(bd.zwkd);
      pd.area = bd.zwmj;
      pd.status = bd.zwzt;
      pd.stageUuid = bd.zgid;
      //绘图工具展位ID
      pd.shapeUuid = bd.reserve1;
      pd.tenantId = bd.qyid;

      if (!pd.name && pd.tenantName) {
        //pd.name=pd.tenantName
        if (bd.gsjc != null && parseInt(bd.zwmj) <= 12) {
          pd.name = bd.gsjc;
          pd.tenantName = bd.gsjc;
        } else {
          pd.name = pd.tenantName;
        }
      }
      return pd;
    },
    //绘图工具数据转展会后台数据
    plot2back(pd) {
      var bd = {};
      bd.uuid = pd.uuid;
      bd.zwh = pd.code;
      bd.bhzh = pd.codeFontSize;
      bd.bhzc = pd.codeFontStyle;
      bd.bhzt = pd.codeFontFamily;
      if (pd.name != pd.tenantName) {
        bd.zwmc = pd.name;
      }
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

      return bd;
    },
    //判断当前展位是否已保存
    isSaved() {
      if (this.currentBusinessData.uuid.indexOf("-") > 0) {
        this.$message({
          message: "当前展位未保存，请先右键保存展位！",
          type: "warning",
          center: true
        });
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@/assets/app.scss";
</style>
<style lang="scss" scoped>
.fx{
  margin-top:60px;
}

.plusmin{
margin-top:60px;
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
    .ploter-navigation-tools {
      padding: 4px;
      position: absolute;
      top: -8px;
      left: 1300px;
    }
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

.btn {
  // border: 5px solid #0684e5;
  border-radius: 100px;
  height: 10px;
  line-height: 0px;
  background: #e56606;
  color: #fff;
  margin: 5px 3px 5px 3px;
  // padding-left: 35px;
  &:hover {
    border: 0px;
    height: 10px;
    line-height: 0px;
    background: rgb(199, 89, 5);
    color: #fff;
    margin: 6px 3px 5px 5px;
    // padding-left: 35px;
  }
  &:focus {
    border: 0px;
    height: 30px;
    line-height: 0px;
    background: rgb(165, 74, 4);
    color: #fff;
    margin: 5px 3px 5px 3px;
    // padding-left: 35px;
  }
}

.app-ploter-tools-graphs-menu-item {
  height: 30px;
  line-height: 0px;
  background: #0684e5;
  color: #fff;
  margin: 5px 3px 5px 0px;
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
