import Vue from 'vue';
import Vuex from 'vuex';
import router from '@/router';
Vue.use(Vuex);

const key = "user";
const isLogin = "isLogin";
const store = new Vuex.Store ({
    state: {
        user: null,
        isLogin: 'FALSE'
    },
    getters: {
        getStorage: function(state) {
            if(!state.user){
                state.user = JSON.parse(localStorage.getItem(key));
                state.isLogin = localStorage.getItem(isLogin);
            }
            return state.user;
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
        $_removeStorage(state) {
            state.user = null;
            state.isLogin = "FALSE";
            localStorage.removeItem(key);
            localStorage.removeItem(isLogin);
        }
    }
});
export default store