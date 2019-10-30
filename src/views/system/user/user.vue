<template>
  <div >
     <div style="margin-top: 10px;display: flex;justify-content: center">
      <el-input
        placeholder="默认展示部分用户，可以通过用户名搜索用户..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
    </div>
<!-- 先得到用户  遍历用户 得到用户的角色展示  在得到全部角色选择 -->
 <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
      <el-card style="width:330px;margin-top: 10px;" v-for="(user,index) in users" :key="index"
               v-loading="cardloading[index]">
        <div slot="header" style="text-align: left">
          <span>{{user.nickname}}</span>
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
  </div>

  
</template>


<script>
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

    return{
        loading: false,
        eploading: [],
        cardloading: [],
        keywords: '',
        users: [],
        allRoles: [],
        roles: [],
        cpRoles: []
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

  }
}
</script>