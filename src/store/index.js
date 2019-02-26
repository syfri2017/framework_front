import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';

export const UPDATE_PLOTER_CONFIG = 'updatePloterCongig'
export const UPDATE_STAGE_DATA = 'updateStageData'
export const UPDATE_STAGE_SIZE = 'updateStageSize'
export const UPDATE_STAGE_ELEMENTS = 'updateStageElements'

Vue.use(Vuex);

const key = "user";
const isLogin = "isLogin";
const store = new Vuex.Store ({
    state: {
        user: null,
        isLogin: 'FALSE',
        //-----plot 开始 ---------- 
        ploterCfg: {
                        readOnly: false,
                        businessShape: {
                            enable: true,
                            requestLoop: 0 // 0为不轮询
                        }},
        stageData: null,
        stageSize: {
            width: 800,
            height: 600
        },
        stageElements: null
        //-----plot 结束 ---------- 
    },
    getters: {
        getStorage: function(state) {
            if(!state.user){
                state.user = JSON.parse(localStorage.getItem(key));
                state.isLogin = localStorage.getItem(isLogin);
            }
            return state.user
        },
        //-----plot 开始 ---------- 
        ploterConfig: state => state.ploterCfg,
        wrapStageData: state => state.stageData,
        stageSize: state => state.stageSize,
        stageElements: state => state.stageElements
        //-----plot 结束 ---------- 
    },
    mutations: {
        $_setLogin(state, value) {
            state.isLogin = value;
            localStorage.setItem(isLogin, value);
        },
        $_setStorage(state, value) {
            state.user = value;
            localStorage.setItem(key, JSON.stringify(value));
        },        
        $_removeStorage(state) {
            state.user = null;
            state.isLogin = "FALSE";
            localStorage.removeItem(key);
            localStorage.removeItem(isLogin);
        },
        //-----plot 开始 ---------- 
        [UPDATE_PLOTER_CONFIG]: (state, payload) => {
            state.ploterCfg = payload
        },
        [UPDATE_STAGE_DATA]: (state, payload) => {
            state.stageData = payload
        },
        [UPDATE_STAGE_SIZE]: (state, payload) => {
            state.stageSize = payload
        },
        [UPDATE_STAGE_ELEMENTS]: (state, payload) => {
            state.stageElements = payload
        }
        //-----plot 结束 ---------- 
    },
    //-----plot 开始 ---------- 
    modules: {
        ...Components
    }
    //-----plot 结束 ---------- 
});
export default store