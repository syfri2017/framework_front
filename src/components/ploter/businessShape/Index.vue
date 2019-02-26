<template>
        <AttributeModule
            :show="attributeModule.show"
            :data="attributeModule.data"
            @close="handlerModelCancel"
        ></AttributeModule>
</template>
<script>
    import { mapGetters } from 'vuex'
    import uuidV1 from 'uuid/v1'
    import stringFormat from 'string-format'
    import { deepClone, isEmpty } from '@/common/ploter/utils'
    import {
        exitPlotTool
    } from '@/views/ploter/draw/utils'
    import drawLib from '@/views/ploter/draw'
    import attribute from './attribute'
    import emptyData from './emptyData.json'
    import { tpl } from './tipTpl.js'
   
    export default {
        name: 'ComponentsBusinessShape',
        components: {
            'AttributeModule': attribute
        },
        data () {
            return {
                attributeModule: {
                    show: false,
                    data: null
                }
            }
        },
        computed: {
            ...mapGetters({
                wrapStageData: 'wrapStageData',
                ploterConfig: 'ploterConfig',
                stageElements: 'stageElements',
                componentsBusinessShapeData: 'componentsBusinessShapeData'
            })
        },
        watch: {
            ploterConfig (cfg) {
                if (cfg.businessShape && cfg.businessShape.enable) {
                    window.wrapHandshake.model['updateBusinessData'] = this.updateBusinessData
                    window.wrapHandshake.model['updateBusinessRecord'] = this.updateBusinessRecord
                    this.onStageReady()
                    setTimeout(() => {
                        this.getBusinessData(this.wrapStageData.uuid)
                    }, 1000)
                }
            },
            componentsBusinessShapeData: {
                handler (data) {
                    this.updateStageFromBusinessData(data)
                },
                deep: true
            }
        },
        mounted () {
            // 
            // window.wrapHandshake.model['updateBusinessData'] = this.updateBusinessData
            // window.wrapHandshake.model['updateBusinessRecord'] = this.updateBusinessRecord

            this.onStageReady()

            setTimeout(() => {
                this.getBusinessData(this.wrapStageData.uuid)
            }, 1000)
        },
        methods: {
            onStageReady () {
                // 
                if (window.ploterStage) {
                    window.ploterStage.on('evt_stage_element_dblclick', this.onStageElementDblclick)
                    window.ploterStage.on('evt_stage_element_changed', this.onStageElementChanged)
                    window.ploterStage.on('evt_stage_element_contextmenu', this.onStageElementContextmenu)
                    window.ploterStage.on('evt_stage_element_mouseenter', this.onStageElementMouseenter)
                    window.ploterStage.on('evt_stage_element_mouseleave', this.onStageElementMouseleave)
                } else {
                    setTimeout(() => {
                        this.onStageReady()
                    }, 100)
                }
            },
            onStageElementDblclick (element) {
                const shapeUuid = element.getAttr('shapeUuid')
                const businessRecord = this.componentsBusinessShapeData.find(item => {
                    return item.shapeUuid === shapeUuid
                })
                if (businessRecord) {
                    if (this.ploterConfig.readOnly) {
                        window.wrapHandshake.$emit('evtBusinessShapeSelected', businessRecord)
                    } else {
                        this.attributeModule.data = deepClone(businessRecord)
                        this.attributeModule.show = true
                    }
                }
            },
            onStageElementChanged (event) {
                const shapeUuid = event.element.getAttr('shapeUuid')
                const shapeCfg = event.element.getAttr('_shapeCfg')
                if (!shapeCfg.businessShape) return
                if (event.changeType === 'add') {
                    let record = {
                        ...emptyData,
                        uuid: uuidV1(),
                        shapeUuid: shapeUuid,
                        stageUuid: this.wrapStageData.uuid
                    }
                    this.$store.dispatch('addBusinessRecord', record)
                } else if (event.changeType === 'delete') {
                    const businessRecord = this.$store.getters.componentsBusinessRecordGet(shapeUuid)
                    if (businessRecord) {
                        this.$store.dispatch('removeBusinessRecord', businessRecord)
                    } else {
                        console.warn('删除图元时没找到业务数据,图元ID', shapeUuid)
                    }
                }
            },
            getBusinessData () {
                //window.wrapHandshake.emit('evtNeedBusinessData')
                let loopTime = this.ploterConfig.businessShape.requestLoop
                if (loopTime > 0) {
                    setTimeout(() => {
                        me.getBusinessData()
                    }, loopTime)
                }
            },
            updateBusinessData (data) {
                const me = this
                me.$store.commit('updateBusinessShapeData', data)
            },
            updateBusinessRecord (data) {
                const me = this
                me.$store.dispatch('updateBusinessRecord', data)
            },
            updateStageFromBusinessData (data) {
                let features = []
                data.forEach(record => {
                    let nameText = ''
                    if (!isEmpty(record.tenantName) && record.status !== 'normal') {
                        nameText = record.tenantName
                    } else {
                        nameText = record.name
                    }
                    let shapeFeature = {
                        textShape: {
                            fields: [{
                                alias: 'code',
                                value: record.code,
                                fontSize: record.codeFontSize,
                                fontStyle: record.codeFontStyle,
                                fontFamily: record.codeFontFamily
                            }, {
                                alias: 'name',
                                value: nameText,
                                fontSize: record.nameFontSize,
                                fontStyle: record.nameFontStyle,
                                fontFamily: record.namefontFamily
                            }]
                        },
                        mainShape: {}
                    }
                    if (record.status === 'normal') {
                        shapeFeature.mainShape.stroke = '#333'
                        shapeFeature.mainShape.fill = '#eaeaea'
                        shapeFeature.textShape.fill = '#333'
                    } else if (record.status === 'allotted') {
                        shapeFeature.mainShape.stroke = '#333'
                        shapeFeature.mainShape.fill = '#c1232b'
                        shapeFeature.textShape.fill = '#333'
                    } else if (record.status === 'bespoke') {
                        shapeFeature.mainShape.stroke = '#333'
                        shapeFeature.mainShape.fill = '#fcce10'
                        shapeFeature.textShape.fill = '#333'
                    } else if (record.status === 'completed') {
                        shapeFeature.mainShape.stroke = '#333'
                        shapeFeature.mainShape.fill = '#b5c334'
                        shapeFeature.textShape.fill = '#333'
                    }

                    let featureItem = {
                        shape: record.shapeUuid,
                        feature: shapeFeature
                    }
                    features.push(featureItem)
                })
                drawLib.shapesFeatureChange(features)
            },
            handlerModelCancel () {
                this.attributeModule.data = emptyData
                this.attributeModule.show = false
            },
            onStageElementContextmenu (context) {
                const me = this
                if (!this.ploterConfig.readOnly) {
                    let contextmenu = me.getBusinessShapeContextmenu()
                    contextmenu.onclick = function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                        let target = e.target
                        let action = target.dataset.action
                        switch (action) {
                        case 'detail':
                            me.onStageElementDblclick(context.element)
                            break
                        case 'allot':
                            me.doAllotBusinessData(context.element)
                            break
                        case 'unallot':
                            me.doUnAllotBusinessData(context.element)
                            break
                        case 'save':
                            me.doSaveShapeData(context.element)
                            break
                        case 'delete':
                            let mainShape = context.element.findOne('.mainShape')
                            const shapeUuid = context.element.getAttr('shapeUuid')
                            const businessRecord = me.componentsBusinessShapeData.find(item => {
                                return item.shapeUuid === shapeUuid
                            })
                            const businessUuid = businessRecord.uuid
                            window.wrapHandshake.$emit('evtStageElementRemove', {
                                shapeUuid: shapeUuid,
                                businessUuid: businessUuid
                            })
                            me.$emit('evt_stage_element_remove', mainShape)
                            break
                        }
                        contextmenu.hide()
                    }
                    contextmenu.style.top = context.event.offsetY + 'px'
                    contextmenu.style.left = context.event.offsetX + 'px'
                    contextmenu.show()
                }
            },
            onStageElementMouseenter (context) {
                // 
                const shapeUuid = context.element.getAttr('shapeUuid')
                if (this.componentsBusinessShapeData && this.componentsBusinessShapeData.length > 0) {
                    const businessRecord = this.componentsBusinessShapeData.find(item => {
                        return item.shapeUuid === shapeUuid
                    })
                    if (businessRecord) {
                        let tipEl = this.getBusinessShapeTip(true)
                        let contentData = {
                            code: businessRecord.code || '',
                            name: businessRecord.name || '',
                            area: '',
                            boothType: businessRecord.boothType || '',
                            entryType: businessRecord.entryType || '',
                            lateralLength: '',
                            verticalLength: ''
                        }
                        if (businessRecord.area) {
                            contentData.area = businessRecord.area + '㎡'
                        }
                        if (businessRecord.lateralLength) {
                            contentData.lateralLength = businessRecord.lateralLength + 'm'
                        }
                        if (businessRecord.verticalLength) {
                            contentData.verticalLength = businessRecord.verticalLength + 'm'
                        }
                        let content = stringFormat(tpl, contentData)

                        let tipPosition = {
                            top: context.event.offsetY,
                            left: context.event.offsetX
                        }
                        if (tipPosition.top > window.innerHeight - 220) {
                            tipPosition.top = tipPosition.top - 220
                        }
                        if (tipPosition.left > window.innerWidth - 320) {
                            tipPosition.left = tipPosition.left - 320
                        }
                        tipEl.innerHTML = content
                        tipEl.style.top = tipPosition.top + 'px'
                        tipEl.style.left = tipPosition.left + 'px'
                        tipEl.show()
                    }
                }
            },
            onStageElementMouseleave (event) {
                let tipEl = this.getBusinessShapeTip(false)
                if (tipEl) {
                    tipEl.hide()
                }
            },
            doAllotBusinessData (shapeWrap) {
                const shapeUuid = shapeWrap.getAttr('shapeUuid')
                const businessRecord = this.componentsBusinessShapeData.find(item => {
                    return item.shapeUuid === shapeUuid
                })
                if (businessRecord) {
                    if (!this.ploterConfig.readOnly) {
                        window.wrapHandshake.$emit('evtBusinessDataAllot', businessRecord)
                    }
                }
            },
            doUnAllotBusinessData (shapeWrap) {
                const shapeUuid = shapeWrap.getAttr('shapeUuid')
                const businessRecord = this.componentsBusinessShapeData.find(item => {
                    return item.shapeUuid === shapeUuid
                })
                if (businessRecord) {
                    if (!this.ploterConfig.readOnly) {
                        window.wrapHandshake.$emit('evtBusinessDataUnAllot', businessRecord)
                    }
                }
            },
            doSaveShapeData (shapeWrap) {
                window.ploterStage.fire('evt-stop')
                exitPlotTool(window.ploterStage)
                const shapeUuid = shapeWrap.getAttr('shapeUuid')
                const businessRecord = this.componentsBusinessShapeData.find(item => {
                    return item.shapeUuid === shapeUuid
                })
                if (businessRecord) {
                    if (!this.ploterConfig.readOnly) {
                        const shapeWrapObj = {
                            shapeUuid: shapeWrap.getAttr('shapeUuid'),
                            jsonData: JSON.stringify(shapeWrap.toObject())
                        }
                        
                        window.wrapHandshake.$emit('evtStageElementSave', {
                            shape: shapeWrapObj,
                            business: businessRecord
                        })
                       
                    }
                }
            },
            getBusinessShapeContextmenu (callback) {
                const canvasWrap = document.querySelector('.app-ploter-main-canvas')
                const konvajsContent = canvasWrap.querySelector('.konvajs-content')
                if (konvajsContent) {
                    let contextmenu = konvajsContent.querySelector('.business-shape-contextmenu')
                    if (!contextmenu) {
                        contextmenu = document.createElement('ul')
                        let menuItems = '<li data-action="detail">查看详情</li><li data-action="allot">指定展位</li><li data-action="unallot">取消指定</li><li data-action="save">保存</li><li data-action="delete">删除</li>'
                        contextmenu.className = 'business-shape-contextmenu'
                        contextmenu.innerHTML = menuItems
                        konvajsContent.appendChild(contextmenu)
                    }
                    contextmenu.show = function () {
                        contextmenu.style.display = 'block'
                        document.body.addEventListener('click', this.hide)
                    }
                    contextmenu.hide = function () {
                        contextmenu.style.top = 0
                        contextmenu.style.left = 0
                        contextmenu.style.display = 'none'
                        document.body.removeEventListener('click', this.hide)
                    }
                    return contextmenu
                }
            },
            getBusinessShapeTip (autoCreate) {
                const canvasWrap = document.querySelector('.app-ploter-main-canvas')
                const konvajsContent = canvasWrap.querySelector('.konvajs-content')
                if (konvajsContent) {
                    let tipEl = konvajsContent.querySelector('.business-shape-tip')
                    if (!tipEl && autoCreate) {
                        tipEl = document.createElement('div')
                        tipEl.className = 'business-shape-tip'
                        tipEl.style.height = '220px'
                        tipEl.style.width = '320px'
                        konvajsContent.appendChild(tipEl)
                    }
                    if (tipEl) {
                        tipEl.show = function () {
                            tipEl.style.display = 'block'
                        }
                        tipEl.hide = function () {
                            tipEl.style.top = 0
                            tipEl.style.left = 0
                            tipEl.style.display = 'none'
                        }
                    }
                    return tipEl
                }
            }
        }
    }
</script>
