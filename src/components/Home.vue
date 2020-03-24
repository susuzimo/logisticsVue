<template>
    <el-container>
        <el-header style="background-color:#409eff;display:flex;justify-content:space-between;align-items:center">
            <div style="font-family:华文行楷;font-size:30px">物流管理系统</div>   
            <div>
                <el-dropdown style="cursor:pointer">
                    <span class="el-dropdown-link">
                         {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div> 
        </el-header>
        <el-container>
            <el-aside width="200px">
                <!--unique-opened打开一个菜单  router会自动跳转 和@select功能一样 -->
                <el-menu unique-opened @select="toggleMenu">
                    <el-submenu :index="index+''" v-for="(item,index) in this.$router.options.routes" :key="index" v-if="!item.hidden && item.meta.role.indexOf(user.role.rolename)!=-1">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.name}}</span>
                        </template>
                        <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">{{child.name}}</el-menu-item>
                    </el-submenu>
                </el-menu>    
            </el-aside>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div style="font-size:40px;font-family:华文行楷;text-align:center;line-height:100px" v-if="this.$router.currentRoute.path=='/home'">
                    欢迎来到物流管理系统!
                </div>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name:'Home',
    data(){
        return{
            user:JSON.parse(window.sessionStorage.getItem("user"))
        }
    },
    methods: {
        toggleMenu(index,path){
            console.log(index)
            console.log(path)
            this.$router.push(index)
        }
    },
}
</script>