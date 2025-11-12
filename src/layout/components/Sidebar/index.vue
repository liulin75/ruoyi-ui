<template>
  <div
    :class="{'has-logo':showLogo}"
    :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path  + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import Logo from "./Logo"
import SidebarItem from "./SidebarItem"
import variables from "@/assets/styles/variables.scss"

export default {
    components: { SidebarItem, Logo },
    data() {
        return {
        sidebarRouters: [
            {
            path: "exam",
            name: "去考试",
            title: "去考试",
              img: "",
            // 注意!!为满足 element-ui 菜单高亮效果，img图片命名必须参照  -未选中  及  -选中  才能切换active效果
                },
                // {
            //   path: "examManagement",
            //   name: "考试管理",
            //   title: "考试管理",
            //   img: "images/考试管理-未选中@2x.png",
            // },{
            //   path: "certificates",
            //   name: "证书管理",
            //   title: "证书管理",
            //   img: "images/证书管理-未选中@2x.png",
            // },{
            //   path: "paymentManagement",
            //   name: "支付管理",
            //   title: "支付管理",
            //   img: "images/支付管理-未选中@2x.png",
            // }
        ]
        }
    },
    computed: {
        ...mapState(["settings"]),
        // ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route
            const { meta, path } = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
             // 自动更新 sidebarRouters 图片
            const pathValue = path.replace(/^\//, '')
            this.updateSidebarImages(this.sidebarRouters, pathValue)

            return pathValue  // 去除了path路径前方的 斜线 / 否则会影响高亮效果
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar?.opened
        }
    },
    methods: {
        /**
         * 自动更新 sidebarRouters 中图片状态
         * @param {Array} sidebarRouters 菜单数组
         * @param {String} activePath 当前选中路由 path
         */
        updateSidebarImages(sidebarRouters, activePath) {
        sidebarRouters.forEach(item => {
            if (!item.img) return // 没有图片跳过

            // 判断当前是否选中
            const isActive = item.path === activePath

            // 替换图片路径中的 -未选中 或 -选中
            item.img = item.img.replace(/-(未选中|选中)/, isActive ? '-选中' : '-未选中')
        })
        }
    }
}
</script>
