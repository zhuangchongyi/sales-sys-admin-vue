<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#00ffe7" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <!-- <svg-icon :icon-class="item.icon" /> -->
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">
                                    <i :class="subItem.icon" v-if="subItem.icon"></i>
                                    <span slot="title">{{ subItem.title }}</span>
                                </template>
                                <!-- 第三层 -->
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    <i :class="threeItem.icon" v-if="threeItem.icon"></i>
                                    <span slot="title">{{ threeItem.title }}</span>
                                </el-menu-item>
                            </el-submenu>
                            <!-- 第二层 -->
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                <i :class="subItem.icon" v-if="subItem.icon"></i>
                                <span slot="title">{{ subItem.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from './bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-s-home',
                    index: '/page/index',
                    title: '系统首页'
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path;
        }
    },
    created() {
        let menus = this.$store.getters.menus;
        // console.log("menus", menus)
        this.items = this.items.concat(menus);
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
