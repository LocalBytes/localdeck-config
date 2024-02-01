import {UidPlugin} from '@shimyshack/uid'

export default defineNuxtPlugin(({vueApp}) => {
    vueApp.use(UidPlugin)
})
