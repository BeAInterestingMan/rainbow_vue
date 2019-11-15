<template>
  <el-form :rules="rules" class="login-container" label-position="left" :model="loginForm"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
     <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%" @click="submitClick">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default{
    data(){
      return {
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        loginForm: {
          username: 'admin',
          password: 'admin'
        },
        loading: false
        
      }
    },
    methods: {
      submitClick: function () {
        this.loading = true;
        this.$postRequest('/login', {
          username: this.loginForm.username,
          password: this.loginForm.password
        }).then(result=> {
          this.loading = false;
          if (result && result.data.status == 200) {
            var data = result.data.data;
            // 调用 mutations
            this.$store.commit('user', data.user);
            this.$store.commit('setToken', data.token);
            this.$router.push('/layout');   
          }else{
            this.$message({type: 'error', message: result.data.message});
          }
        });
      }
    }
    ,created(){
      this.$db.clear()
    }
  }
</script>
<style scoped>

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    /* background: #fff; */
    /* background: url('@/assets/back'); */
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
 
</style>
