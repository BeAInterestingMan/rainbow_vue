<template>
<div>


<div style="margin-top: 20px;display: flex;justify-content: center">
      <el-input
        placeholder="可以通过角色名称搜索角色..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
       <el-button type="primary" icon="el-icon-refresh" size="small" style="margin-left: 3px" @click="refreshRole">刷新
      </el-button>
       <el-button type="primary" size="mini" icon="el-icon-plus" @click="addRole">添加角色 </el-button>
    </div>

    <div style="margin-top: 10px">
 <el-table
      :data="roleList"
      size="mini"
      border
      stripe
      v-loading="tableLoading"
      style="width: 100%">
      <el-table-column  type="selection"   align="center"  width="55"></el-table-column>
       <el-table-column  type="index"  align="center" fixed label="序号" width="50"> </el-table-column>
      <el-table-column prop="name" align="left" fixed  label="角色名"   width="100"> </el-table-column>
      <el-table-column align="center" fixed  label="状态"   width="80"> 
        <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="0"
                        inactive-value="1"
                        >
                      </el-switch>

      </template>
      </el-table-column>
      <el-table-column prop="creatorName" align="left" fixed  label="创建人"   width="80"> </el-table-column>
      <el-table-column  prop="createTime" align="left" fixed  label="创建时间"   width="170"> </el-table-column> 
     
     <el-table-column prop="remark" align="left" fixed  label="备注"   width="300"> </el-table-column>

    <el-table-column label="操作" align="center">
        <template slot-scope="scope">
                  <el-button
                    size="mini"  class="el-icon-edit" type="primary"
                    @click="handleEdit(scope.$index, scope.row)">
                  </el-button>

                <el-button
                    size="mini"  class="el-icon-user-solid" type="primary"
                    @click="handleRole(scope.$index, scope.row)">
                  </el-button>

                  <el-button
                    size="mini"
                    class="el-icon-delete" type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                  </el-button>
               </template>
     </el-table-column>
    </el-table>
</div>

   <div style="text-align: right;margin-top: 10px">
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size= pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
    </el-pagination>
    </div> 


  <!-- 绑定资源表单 -->

      <div style="text-align: center">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="menusDialogVisible"
          width="40%">
 
       <el-tree        :props="props"
                       :key="id"
                       :data="treeData"
                       :default-checked-keys="checkedKeys"
                       node-key="id"
                       ref="tree"
                       show-checkbox
                       highlight-current
                       @check-change="handleCheckChange">
              </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelChooseMenu" >取 消</el-button>
        <el-button size="mini" type="primary" @click="updateRoleMenu()">确 定</el-button>
      </span>
    </el-dialog>
  </div>


<!--  新增修改角色表单 -->
<el-form :model="roleForm" :rules="rules" ref="addRoleForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="roleDialogVisible"
          width="40%">
       
                <el-form-item label="角色名称:" prop="name">
                  <el-input prefix-icon="el-icon-edit" v-model="roleForm.name" size="mini" style="width: 150px"
                            placeholder="请输入角色名称"></el-input>
                </el-form-item>
           
           
                <el-form-item label="状态:" >
               
                      <el-switch
                        v-model="roleForm.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="0"
                        inactive-value="1"
                        >
                      </el-switch>
                  
                </el-form-item>
        
                <el-form-item label="备注：">
                <el-input type="textarea" v-model="roleForm.remark" style="width: 150px:padding-left:20px"></el-input>
                </el-form-item>
           
        
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="resetRole">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveRole('addRoleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</el-form>

</div>
 
</template>

<script>
import { stringify } from 'querystring';
export default {
    data(){

     return{
         roleList:[],
         tableLoading: false,
         keywords: "",
         totalCount: 0,
         currentPage: 1,
         pageSize: 10,
         menusDialogVisible: false,
         dialogTitle: '',
          props: {
          label: 'name',
          children: 'children'
        },
        count: 1,
        id: "",
        // 菜单tree 
        treeData:[],
        checkedKeys:[],
        // 角色新增表单
        roleDialogVisible: false,
        roleForm:{
           id:'',
           name:'',
           status:'0',
           remark: '',
           creatorName: ''
        }
         ,rules: {
          remark: [
                { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                 ],
          name: [
                      { required: true, message: '请输入角色名称', trigger: 'change' }
                    ],
         }
     }
       
    }
    ,methods:{

//  加载角色列表
    loadRoles(){
      this.$getRequest('/role/selectRoleWithPage', { 
          name: this.keywords,
          pageSize: this.pageSize,
          currentPage: this.currentPage
       }).then(result=> {
          if (result && result.status == 200) {
            this.roleList = result.data.data;
            this.totalCount = result.data.total;
          }else {
            this.$message({type: 'error', message: '数据加载失败!'});
          }
        });
         
    },

//  搜索角色
    searchClick(){
         this.loadRoles();
    },
    // 新增角色
    addRole(){
       this.roleDialogVisible = true;
    },
     // 编辑角色
    handleEdit(index,row){
         this.roleDialogVisible = true;
             this.loading = true;
         this.$getRequest('/role/getRoleById',{id:row.id})
          .then(resp=>{
              this.loading = false;
         if(resp.data.status == 200){
            this.roleForm = resp.data.data;
         }else{
              this.$message({type: 'error', message: '获取角色失败!'});   
         }
        
       })
     },
    // 删除角色
    handleDelete(index,row){
        this.$confirm('删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
       this.loading = true;
         this.$deleteRequest('/role/deleteRole',{id:row.id})
         .then(resp=>{
              this.loading = false;
         if(resp.data.status == 200){
           this.$message({type: "success", message: resp.data.message});
           this.loadRoles();
         }else{
              this.$message({type: 'error', message: resp.data.message});   
         }
       })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    emptyRoleFormData(){
       this.roleForm ={
       } 
    },
    //刷新
    refreshRole(){
      this.keywords = "";
     this.loadRoles();
    },
    // 切换页面总条数
    handleSizeChange(val){
        this.pageSize = val;
        this.loadRoles();
    },
    // 切换当前页
    handleCurrentChange(val){
          this.currentPage = val;
          this.loadRoles();
    }  // 分配菜单资源
    ,handleRole(index,row){
       this.dialogTitle = '分配资源';
       this.menusDialogVisible = true;
       this.id = row.id;
       this.$getRequest('/menu/menuTreeForRole',{roleId:this.id})
       .then(resp=>{
         if(resp.data.status == 200){
            this.treeData = resp.data.treeData;
            this.checkedKeys = resp.data.menuIds;
         }else{
              this.$message({type: 'error', message: '加载角色菜单资源失败!'});   
         }
        
       })
    }
    // 更新角色菜单
      ,updateRoleMenu(){
        // 得到选择的资源菜单
         var checkedKeys = this.$refs.tree.getCheckedKeys(true);
         this.$postRequest('/menu/updateRoleMenu',{
           menuIds: checkedKeys,
           roleId: this.id
         }).then(resp=>{
           if(resp.data.status == 200){
                this.$message({type: "success", message: resp.data.message});
                this.cancelChooseMenu();
           }else{
               this.$message({type: "error", message: resp.data.message});
           }
         })
      }
      ,handleCheckChange(data, checked, indeterminate) {
     
      },
      // 取消选择资源菜单
      cancelChooseMenu(){
         this.menusDialogVisible = false;
         this.checkedKeys =[];
         this.treeData = [];
      }
      // 角色表单取消
     ,resetRole(){
         this.roleDialogVisible = false;
         this.emptyRoleFormData();    
     }
     // 保存角色
     ,saveRole(formName){
           this.$refs[formName].validate((valid) => {
             if (valid) {
                 this.loading = true;
                 this.$postRequest('/role/saveRole',this.roleForm) 
                 .then(result =>{
                  this.loading = false;
                 if(result.data.status == 200){
                      this.roleDialogVisible = false;
                      this.$message({type: 'success', message: result.data.message})    
                      this.emptyRoleFormData();
                      this.loadRoles();              
                  }else{
                      this.$message({type: 'error', message: result.data.message})
                  }
               
                 })
               }
     })
    }
    }
    // 页面元素加载完成后执行
    ,mounted(){
      this.loadRoles();
    }

  
    }
   

</script>