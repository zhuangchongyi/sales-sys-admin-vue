import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import dialogDrag from './dialogDrag'
const install = function (Vue) {
    Vue.directive('hasRole', hasRole) //v-hasRole
    Vue.directive('hasPermi', hasPermi) //v-hasPermi
    Vue.directive('dialogDrag', dialogDrag) //v-dialogDrag
}

if (window.Vue) {
    window['hasRole'] = hasRole
    window['hasPermi'] = hasPermi
    window['dialogDrag'] = dialogDrag
    Vue.use(install); // eslint-disable-line
}

export default install