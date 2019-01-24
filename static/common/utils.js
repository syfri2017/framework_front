export default {
    install(Vue, options) {
        Vue.prototype.testAAA = function (msg) {
            return msg;
        }
    }
}