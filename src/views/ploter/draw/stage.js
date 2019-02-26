import drawLib from './index'
import store from '@/store'
import uuidV1 from 'uuid/v1'
import image from './Image'

export function prepareStageData (data) {
    let dataObj = data
    if (typeof dataObj === 'string') {
        dataObj = JSON.parse(data)
    }
    prepareStageElements(dataObj)
    let layers = dataObj.children
    let shapesLayer = layers.find(item => {
        return item.attrs.name === 'shapesLayer'
    })
    let elements = shapesLayer.children
    elements.forEach(element => {
        const attrs = element.attrs
        if (attrs && attrs.name === 'shapeWrap' && !attrs.shapeUuid) {
            attrs.shapeUuid = uuidV1()
        }
    })
    return dataObj
}

export function prepareStageElements (stageData) {
    let layers = stageData.children
    let shapesLayer = layers.find(item => {
        return item.attrs.name === 'shapesLayer'
    })
    let list = []
    let elements = shapesLayer.children
    elements.forEach(element => {
        list.push(element)
    })
    store.commit('updateStageElements', list)
}

export function getShapeOnStage (shapeUuid) {
    const stage = window.ploterStage
    const shapesLayer = stage.findOne('.shapesLayer')
    let shape = null
    if (shapesLayer.children) {
        for (let index = 0; index < shapesLayer.children.length; index++) {
            const shapeItem = shapesLayer.children[index]
            let itemUuid = shapeItem.getAttr('shapeUuid')
            if (itemUuid === shapeUuid) {
                shape = shapeItem
            }
        }
    }
    return shape
}

export function updateStageBackgroundImg (file) {
    const stage = window.ploterStage
    const backgroundLayer = stage.findOne('.backgroundLayer')
    let backgroundImageShape = backgroundLayer.children[1]

    if (typeof FileReader === 'function') {
        const reader = new FileReader()
        reader.onload = (e) => {
            backgroundImageShape.attrs._shapeCfg.style.mainShape.src = e.target.result
            window.plotReload.imgCount = 1
            image.reloadShape(backgroundImageShape)
            function imgShapesReloaded () {
                if (window.plotReload.imgCount === window.plotReload.imgLoaded) {
                    backgroundLayer.draw()
                    let stageJson = window.ploterStage.toJSON()
                    let stageObj = JSON.parse(stageJson)
                    stageObj.children[1].children = []
                    window.wrapHandshake.emit('evtSaveStageData', JSON.stringify(stageObj))
                } else {
                    setTimeout(() => {
                        imgShapesReloaded()
                    }, 100)
                }
            }
            imgShapesReloaded()
        }
        reader.readAsDataURL(file)
    } else {
        alert('您的浏览器版本太低，请升级。')
    }
}

export function clearShapeStyle () {
    const stage = window.ploterStage
    const shapesLayer = stage.findOne('.shapesLayer')
    if (shapesLayer.children && shapesLayer.children.length > 0) {
        let features = []
        shapesLayer.children.forEach((shapeWrap) => {
            const shapeCfg = shapeWrap.getAttr('_shapeCfg')
            if (shapeCfg.name === '展位') {
                let shapeFeature = {
                    textShape: {
                        fill: '#333',
                        fields: [{
                            alias: 'code',
                            value: '',
                            fontSize: 10,
                            fontStyle: 'normal',
                            fontFamily: 'simsun'
                        }, {
                            alias: 'name',
                            value: '',
                            fontSize: 14,
                            fontStyle: 'bold',
                            fontFamily: 'simsun'
                        }]
                    },
                    mainShape: {
                        stroke: '#333',
                        fill: '#eaeaea'
                    }
                }
                let featureItem = {
                    shape: shapeWrap.getAttr('shapeUuid'),
                    feature: shapeFeature
                }
                features.push(featureItem)
            }
        })
        drawLib.shapesFeatureChange(features)
    }
}

// export default {
//     prepareStageData,
//     prepareStageElements,
//     getShapeOnStage
// }
