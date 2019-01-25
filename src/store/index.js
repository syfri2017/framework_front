import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
Vue.use(Vuex);

const key = "user";
const isLogin = "isLogin";
const menus = "menus";
const store = new Vuex.Store ({
    state: {
        user: null,
        isLogin: 'N',
        menus: []
    },
    getters: {
        getStorage: function(state) {
            if(!state.user){
                state.user = JSON.parse(localStorage.getItem(key));
                state.isLogin = localStorage.getItem(isLogin);
            }
            return state.user;
        },
        getMenus: function(state) {
            if(state.menus.length == 0){
                state.menus = localStorage.getItem(menus);
            }
            return state.menus;
        }
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
        $_setMenus(state, value) {
            state.menus = value;
            localStorage.setItem(menus, value);
        },
        $_removeStorage(state) {
            state.user = null;
            state.isLogin = false;
            state.menus = [];
            localStorage.removeItem(key);
            localStorage.removeItem(isLogin);
            localStorage.removeItem(menus);
        }
    }
});
export default store