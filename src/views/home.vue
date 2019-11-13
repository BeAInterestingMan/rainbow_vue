<template>
  <el-container>

<!-- 头部导航 -->
 <el-header class="home-header">
        <span class="home_title">rainbow</span> <span class="home_title">太阳说雨后会有一道彩虹</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-badge style="margin-right: 30px">
            <i class="fa fa-bell-o"  style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center; color:#20a0ff ">
          {{user.nickname}}
          <i><img v-if="user.avatar != ''" :src="user.avatar"  style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/>
              <img v-if="user.avatar == ''" src="@/assets/back.jpg"  style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/>
          </i>
        
        </span>    
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>


  <el-container>

<!-- 侧边菜单 -->
      <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <el-menu style="background: #fff;width: 180px;" unique-opened router>
              <template v-for="(item,index) in this.routes">

                <!-- 如果一级菜单没有子菜单  直接就是遍历 -->
               <el-menu-item  v-if="item.children == null" :key="index" :index="item.path+''">
                  <template slot="title">
                    <i :class="item.icon" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                </el-menu-item>

                <el-submenu  v-else :key="index" :index="index+''" >
                  <template slot="title">
                    <i :class="item.icon" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                  <el-menu-item width="180px"
                                style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path">  <i :class="child.icon" style="color: #20a0ff;width: 14px;"></i>{{child.name}}
                                
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
<!-- 内容区域 -->
    <el-main>
      <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <router-view ></router-view>
    </el-main>

  </el-container>

</el-container>
</template>

<script>


export default {
  name: 'home',

data(){
return {
        isDot: false
      }
    },
   computed: {
      user(){
        return this.$store.state.user;
      },
      routes(){
        return this.$store.state.routes
      }
    },
    methods:{
       handleCommand(command){
        var _this = this;
        if (command == 'logout') {
          this.$confirm('注销登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
            _this.$router.replace({path: '/'});
              // 清空本地保存数据
            localStorage.clear();
          }, function () {
            //取消
          })
        }
      }
    }

}
</script>
<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #fff;
    color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #fff;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #20a0ff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>