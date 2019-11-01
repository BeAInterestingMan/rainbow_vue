<template>
  <div >
     <div style="margin-top: 10px;display: flex;justify-content: center">
      <el-input
        placeholder="默认展示部分用户，可以通过用户昵称搜索用户..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
       <el-button type="primary" size="mini" icon="el-icon-plus" @click="showUserForm">添加用户 </el-button>
    </div>
<!-- 先得到用户  遍历用户 得到用户的角色展示  在得到全部角色选择 -->
 <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
      <el-card style="width:330px;margin-top: 10px;" v-for="(user,index) in users" :key="index"
               v-loading="cardloading[index]">
        <div slot="header" style="text-align: left">
          <span>{{user.nickname}}</span>
          <el-button style="float: right; padding: 3px 0;color: #green" type="text" icon="el-icon-edit"
                     @click="updatePassword(user.id)">修改密码
          </el-button>
          <el-button style="float: right; padding: 3px 0;color: #green" type="text" icon="el-icon-document"
                     @click="updateUser(user.id)">修改用户
          </el-button>
          <el-button style="float: right; padding: 3px 0;color: #ff0509" type="text" icon="el-icon-delete"
                     @click="deleteUser(user.id)">删除
          </el-button>
          
        </div>
        <div>
          <div><img :src="user.avatar"  style="width: 70px;height: 70px"></div>
          <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
            <span>用户名:</span><span>{{user.username}}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
            <span>电子邮箱:</span><span>{{user.email}}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
            <span>注册时间:</span><span>{{user.createTime}}</span>
          </div>
          <div
            style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px;display: flex;align-items: center">
            <span>用户状态:</span>
            <el-switch
              v-model="user.status"
               active-text="启用"
               active-color="#13ce66"
               active-value="0"
               inactive-value="1"
              @change="enabledChange(user.status,user.id,index)"
              inactive-text="禁用" style="font-size: 12px">
            </el-switch>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
            <span>用户角色:</span>
            <el-tag
              v-for="role in user.roles"
              :key="role.id"
              size="mini"
              style="margin-right: 8px"
              type="success">
              {{role.name}}
            </el-tag>
            <el-popover
              placement="right"
              title="角色列表"
              width="200"
              :key="index+''+user.id"
               @hide="saveRoles(user.id,index)"
              trigger="click" v-loading="eploading[index]">
              <el-select v-model="roles" :key="user.id" multiple placeholder="请选择" size="mini">
                <el-option
                  v-for="(item,index) in allRoles"
                  :key="user.id+'-'+item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" icon="el-icon-more" style="padding-top: 0px" slot="reference"
                         @click="showRole(user.roles,user.id,index)"></el-button>
            </el-popover>
          </div>
        </div>
      </el-card>

  </div>


<!--  新增修改用户表单 -->
<el-form :model="userForm" :rules="rules" ref="addUserForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="50%">
          <el-row>
            <el-col :span="12">
                <el-form-item label="昵称:" prop="nickname">
                  <el-input prefix-icon="el-icon-edit" v-model="userForm.nickname" size="mini" style="width: 150px"
                            placeholder="请输入用户昵称"></el-input>
                </el-form-item>
            </el-col>
           
           <el-col :span="12">
                <el-form-item label="用户名:" prop="username">
                  <el-input prefix-icon="el-icon-edit" v-model="userForm.username" size="mini" style="width: 150px"
                            placeholder="请输入用户名"></el-input>
                </el-form-item>
            </el-col>
          </el-row>

          <el-row>
  
            <el-col :span="12">
                <el-form-item label="性别:" prop="sex">
                  <el-radio-group v-model="userForm.sex">
                    <el-radio label="男">男</el-radio>
                    <el-radio style="margin-left: 15px" label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
            </el-col>
          </el-row>

        <el-row>
            <el-col :span="12">
                 <el-form-item label="邮箱:" prop="email">
                  <el-input prefix-icon="el-icon-message" v-model="userForm.email" size="mini" style="width: 150px"
                            placeholder="请输入电子邮箱地址"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="手机号码:" prop="mobile">
                  <el-input prefix-icon="el-icon-phone" v-model="userForm.mobile" size="mini" style="width: 200px"
                            placeholder="请输入手机号码"></el-input>
                </el-form-item>
            </el-col>
          </el-row>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetUser">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveUser('addUserForm',userForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</el-form>

<!-- 修改密码表单 -->
<el-form :model="passWordForm" :rules="passwordRules" ref="passWordForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: center">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="paswordDialogVisible"
          width="40%">

         <el-row>
           <el-col :span="12">
             <el-form-item label="旧密码:" prop="oldPassword">
             <el-input type="text" v-model="passWordForm.oldPassword" autocomplete="off"  placeholder="请输入旧密码" size="mini" style="width: 150px"></el-input>
            </el-form-item>
           </el-col>
          </el-row>

           <el-row>
           <el-col :span="12">
            <el-form-item label="新密码:" prop="newPassWord">
            <el-input type="password" v-model="passWordForm.newPassWord" autocomplete="off" placeholder="请输入新密码"  size="mini" style="width: 150px"></el-input>
           </el-form-item>
           </el-col>
           </el-row>

            <el-row>
            <el-col :span="12">
             <el-form-item label="确认密码:" prop="checkPassPassword">
             <el-input type="password" v-model="passWordForm.checkPassPassword" autocomplete="off"  placeholder="请输入确认密码"   size="mini" style="width: 150px"></el-input>
             </el-form-item>
           </el-col>
          </el-row>


      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancerPasswordForm">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitPasswordForm('passWordForm',passWordForm.id)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</el-form>
  </div>
</template>


<script>

import Qs from 'qs'
export default {
   // 页面html元素加载完毕执行该方法
  mounted: function () {
      this.loading = true;
      this.loadUserList();
      this.cardloading = Array.apply(null, Array(20)).map(function (item, i) {
        return false;
      });
      this.eploading = Array.apply(null, Array(20)).map(function (item, i) {
        return false;
      });
    },

  data(){

    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passWordForm.newPassWord !== '') {
            this.$refs.passWordForm.validateField('checkPassPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passWordForm.newPassWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };


    return{
      // 延迟动画控制
        loading: false,
        eploading: [],
        cardloading: [],
        // 搜索参数
        keywords: '',
        users: [],
        allRoles: [],
        roles: [],
        cpRoles: [],
        userForm:{
           username:"",
           nickname:"",
           sex:"",
           mobile:"",
           email:"",
           id:""
        }
        ,
        dialogTitle:"",
        // 用户表单弹窗控制参数
        dialogVisible: false,
        // 修改弹窗控制参数
        paswordDialogVisible : false,
        passWordForm:{
        oldPassword: "password",
        newPassWord:"",
        checkPassPassword :"",
        id:""
        },
        rules: {
          nickname:   [{required: true, message: '必填:用户昵称', trigger: 'blur'}],
          username:   [{required: true, message: '必填:用户名', trigger: 'blur'}],
          sex: [{required: true, message: '必填:性别', trigger: 'blur'}],
          email:  [{required: true, message: '必填:电子邮箱', trigger: 'blur'}, {
            type: 'email',
            message: '邮箱格式不正确',
            trigger: 'blur'
          }],
          mobile:  [{required: true, message: '必填:电话号码', trigger: 'blur'}],
         

        },passwordRules: {
           newPassWord: [{ validator: validatePass, trigger: 'blur' }],
           checkPassPassword: [{ validator: validatePass2, trigger: 'blur' }],
        }

    }
  },
  methods:{
    // 加载用户列表
    loadUserList(){
      this.$getRequest('/user/list', { nickname: this.keywords}
         ).then(result=> {
          this.loading = false;
          if (result && result.status == 200) {
            this.users = result.data.data;
          }else {
            this.$message({type: 'error', message: '数据加载失败!'});
          }
        });
    },
    // 展示当前用户角色角色
     showRole(aRoles, id, index){
        this.cpRoles = aRoles;
        this.roles = [];
        this.loadRoles(index);
        for (var i = 0; i < aRoles.length; i++) {
          this.roles.push(aRoles[i].id);
        }
      },
       //加载所有角色
       loadRoles(index){
          this.eploading.splice(index, 1, true)
          this.$getRequest('/role/list' ).then(result=> {
          this.eploading.splice(index, 1, false)
          if (result && result.status == 200) {
            this.allRoles = result.data.data;
          }else {
            this.$message({type: 'error', message: '数据加载失败!'});
          }
        });
      },
   // 保存角色
    saveRoles(id, index){
       var selRoles = this.roles;
        if (this.cpRoles.length == selRoles.length) {
          for (var i = 0; i < this.cpRoles.length; i++) {
            for (var j = 0; j < selRoles.length; j++) {
              if (this.cpRoles[i].id == selRoles[j]) {
                selRoles.splice(j, 1);
                break;
              }
            }
          }
          if (selRoles.length == 0) {
            return;
          }
        }
          this.cardloading.splice(index, 1, true)
          this.$postRequest("/user/saveUserRoles", {roleIds: this.roles, userId: id}).then(resp=> {
          if (resp.data.status == 200) {
             this.$message({type: "success", message: resp.data.message});
              // this.loadUserList();
              this.loadOneUserById(id,index)
          } else {
            this.cardloading.splice(index, 1, false)
            this.$message({type: 'error', message: '更新失败!'});
          }
        }, resp=> {
          this.cardloading.splice(index, 1, false)
            this.$message({type: 'error', message: "系统异常"});
        })
    },
    // 重新加载这个用户
     loadOneUserById(id, index){
        this.$getRequest("/user/getUserById",{id:id}).then(resp=> {
            this.cardloading.splice(index, 1, false)
          if (resp.data.status == 200) {
            this.users.splice(index, 1, resp.data.data);
          } else {
            this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp=> {
          this.cardloading.splice(index, 1, false)
          this.$message({type: 'error', message: "系统异常"});
        });
      },
      // 搜索
       searchClick(){
        this.loading = true;
        this.loadUserList();
      }
      // 删除用户
      ,deleteUser(id){
         var _this = this;
        this.$confirm('删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading = true;
          _this.$deleteRequest("/user/delete" , {id:id}).then(resp=> {
            if (resp.data.status ==  200) {
              _this.$message({type: 'success', message: resp.data.message})
              _this.loadUserList();
              return;
            }else{
               _this.loading = false;
               _this.$message({type: 'error', message: resp.data.message})
            }
        
          }, resp=> {
            _this.loading = false;
            _this.$message({type: 'error', message: '删除失败!'})
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
     // 禁用启用
    enabledChange(status, id, index){
        var _this = this;
        _this.cardloading.splice(index, 1, true)
        _this.$putRequest("/user/updateStatus", {status: status, id: id}).then(resp=> {
          if (resp.data.status != 200) {
            _this.$message({type: 'error', message: resp.data.message})
            _this.loadOneUserById(id, index);
            return;
          }
          _this.cardloading.splice(index, 1, false)
          _this.$message({type: 'success', message: resp.data.message})
        }, resp=> {
          _this.$message({type: 'error', message: '更新失败!'})
          _this.loadOneUserById(id, index);
        });
      },
      // 新增表单
        showUserForm(){
              this.dialogTitle = "添加用户";
                this.dialogVisible = true;
                var _this = this;
        }
        // 取消操作
        , resetUser() {
        this.dialogVisible = false;
        this.emptyUserFormData();
        this.loadUserList();
      },
      // 清空数据
      emptyUserFormData(){
          this.userForm={
                    username:"",
                    sex:"",
                    mobile:"",
                    email:"",
                    nickname:''
                }
       }
       // 保存用户
       ,saveUser(formName,id){
           this.$refs[formName].validate((valid) => {
               if (valid) {
                 this.loading = true;
                 this.$postRequest('/user/saveUser',this.userForm) 
                 .then(result =>{
                  this.loading = false;
                 if(result.data.status == 200){
                      this.dialogVisible = false;
                      this.$message({type: 'success', message: result.data.message})    
                      this.emptyUserFormData();
                      this.loadUserList();              
                  }else{
                      this.$message({type: 'error', message: result.data.message})
                  }
               
                 })
               }
         })
       }
       // 修改用户弹窗
       ,updateUser(id){
            this.dialogTitle = "修改用户";
            this.dialogVisible = true;
            this.$getRequest('/user/getOneUser',{id:id})
            .then(result =>{
                 if(result.data.status == 200){
                    this.userForm = result.data.data
                  }else{
                      this.$message({type: 'error', message: "拉取用户信息失败"})
                  }
               
                 })
          }
          // 修改密码弹窗
          ,updatePassword(id){
               this.dialogTitle = "修改密码";
               this.paswordDialogVisible =true;
               this.passWordForm.id = id;
          }
          // 修改密码保存
          ,submitPasswordForm(formName,id){
               this.$refs[formName].validate((valid) => {
                  if (valid) {
                      this.$putRequest('/user/updateUserPassword',this.passWordForm)
                        .then(result =>{
                         if(result.data.status == 200){
                             this.$message({type: 'success', message: result.data.message})
                             const currentUserId = this.$db.get('user').id;
                            if(currentUserId == id){
                                setTimeout(function(){ 
                                     this.$router.replace({path: '/'});
                                    }, 3000);
                                // 清空本地保存数据
                                    this.$db.clear();
                                  
                              }
                        }else{
                            this.$message({type: 'error', message: result.data.message})
                        }
                     })
                  }
               })
          }
          ,cancerPasswordForm(){
                this.paswordDialogVisible = false;
                this. passWordForm = {
                    oldPassword: "password",
                    newPassWord:"",
                    checkPassPassword :""
                }
          }
    }
}
</script>