<template>
    <div>

    <div style="margin-top: 20px;display: flex;justify-content: center">
      <el-input
        placeholder="可以通过角色名称搜索角色..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="search">搜索
      </el-button>
       <el-button type="primary" icon="el-icon-refresh" size="small" style="margin-left: 3px" @click="refreshMenu">刷新
      </el-button>
       <el-button type="primary" size="mini" icon="el-icon-plus" @click="openMenus">添加菜单 </el-button>
    </div>
<!-- 左侧树 -->
        <el-container>
            <el-aside width="200px">
              <el-tree
                :data="menuTreeData"
                node-key="id"
                ref="tree"
                @node-click = "handleNodeClick"
                highlight-current
                :props="menuProps">
                </el-tree>
            </el-aside>
            <!-- 菜单详情 -->
            <el-main>
              <div style="margin-top: 10px">
                    <el-table
                        :data="menuTableData"
                        size="mini"
                        stripe
                        v-loading="tableLoading"
                        style="width: 100%">
                        <el-table-column  type="selection"   align="center"  width="55"></el-table-column>
                        <el-table-column  type="index"  align="center" fixed label="序号" width="50"> </el-table-column>
                        <el-table-column prop = "name" align="left" fixed  label="菜单名称"   width="80"> </el-table-column>
                        <el-table-column prop = "path" align="left" fixed  label="菜单URL"   width="100"> </el-table-column>
                        <el-table-column prop="component"  align="left" fixed  label="前端组件"   width="120"> </el-table-column>
                         <el-table-column prop = "icon" align="left" fixed  label="图标"   width="100"> </el-table-column>
                       <el-table-column align="center" fixed  label="状态"   width="50"> 
                          <template slot-scope="scope" >
                              <span style="color:green" v-if="scope.row.status == '0'">启用</span>
                            <span v-else style="color:red">禁用</span>
                          </template>
                      </el-table-column>
                         <el-table-column  align="center" fixed  label="类型"   width="50"> 
                            <template slot-scope="scope" >
                               <span style="color:green" v-if="scope.row.type == '0'">菜单</span>
                              <span v-else style="color:green">按钮</span>
                            </template>
                         </el-table-column>
                        <el-table-column  prop="createTime" align="left" fixed  label="创建时间"   width="100"> </el-table-column> 
                        
    
                        <el-table-column label="操作" align="center">
                             <template slot-scope="scope">
                                    <el-button
                                        size="mini"  class="el-icon-edit" type="primary"
                                       @click="editMenus(scope.row)">
                                    </el-button>

                                    <el-button
                                        size="mini"
                                        class="el-icon-delete" type="danger"
                                       @click="deleteMenus(scope.row)">
                                    </el-button>
                                </template> 
                        </el-table-column> 
                        </el-table>
                    </div>

                    <!-- 列表分页 -->
                     <div style="text-align: right;margin-top: 10px">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[5, 10, 15]"
                            :page-size= pageSize
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalCount">
                        </el-pagination>
                    </div> 

            </el-main>
        </el-container>



           <!-- 添加资源表单 -->
<el-form :model="menuForm" :rules="menuFormRules" ref="menuForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: center">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="menuDialogVisible"
          width="40%">

         <el-row>
           <el-col :span="11">
             <el-form-item label="父菜单:" prop="parentName">
             <el-input type="text" v-model="menuForm.parentName" autocomplete="off" disabled="disabled"  size="mini" style="width: 150px"></el-input>
            </el-form-item>
           </el-col>

           <el-col :span="12" style="padding-left: 20px">
             <el-form-item label="菜单名称:" prop="name">
             <el-input type="text" v-model="menuForm.name" autocomplete="off" placeholder="请输入菜单名称"  size="mini" style="width: 150px"></el-input>
            </el-form-item>
           </el-col>
          </el-row>

        <el-row>
           <el-col :span="12">
             <el-form-item label="url:" prop="path">
             <el-input type="text" v-model="menuForm.path" autocomplete="off"  placeholder="请输入菜单url" size="mini" style="width: 150px"></el-input>
            </el-form-item>
           </el-col>

           <el-col :span="11">
             <el-form-item label="组件路径:" prop="component">
             <el-input type="text" v-model="menuForm.component" autocomplete="off" placeholder="请输入组件路径"  size="mini" style="width: 150px"></el-input>
            </el-form-item>
           </el-col>
          </el-row>

           <el-row>
            <el-col :span="12">
              <el-form-item label="图标:" prop="icon">
              <el-input type="text" v-model="menuForm.icon" autocomplete="off"  placeholder="请输入图标" size="mini" style="width: 150px"></el-input>
              </el-form-item>
            </el-col>

              <el-col :span="11" style="padding-left: 20px">
              <el-form-item label="排序:" >
                <el-input-number v-model="menuForm.sort" @change="handleChange" :min="1" :max="100" size="mini" ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>

        <el-row>
           <el-col :span="12">
             <el-form-item label="类型:" prop="type">
                <el-select v-model="menuForm.type" placeholder="请选择" size="mini" style="width:150px">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
           </el-col>


          <el-col :span="11" style="padding-left: 20px">
                <el-form-item label="状态:" >
                  <el-switch
                              v-model="menuForm.status"
                              active-color="#13ce66"
                              inactive-color="#ff4949"
                              active-value="0"
                              inactive-value="1"
                              >
                  </el-switch>
              </el-form-item>
           </el-col>
          </el-row>
    
   
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelMenu">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveMenus('menuForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</el-form>

    </div>
</template>

<script>
  export default {
  data() {
      return {
          menuList:[],
          tableLoading:"",
          keywords:"",
          menuData:[],
          totalCount: 0,
          currentPage: 1,
          pageSize: 5,
          menuProps:{
              children: 'children',
              label: 'name'
          },
          menuTreeData:[],
          menuTableData:[],
          // 树被点击菜单的ID
          menuForm:{
             parentId:　"",
             parentName: "",
             type: "",
             status: "0",
             component:"",
             icon:"",
             path:"",
             name:"",
             sort:"1"
          },
          menuFormRules:{
            parentName: [{ required: true, message: '请填写上级菜单', trigger: 'blur' }],
            name: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
            component: [{ required: true, message: '请填写组件路径', trigger: 'blur' }],
            path: [{ required: true, message: '请填写菜单url', trigger: 'blur' }], 
            type: [{ required: true, message: '请选择类型', trigger: 'change' }],        
          },
          menusRules:[],
          menuDialogVisible: false,
          dialogTitle: "",
          typeOptions: [
            {
            value: '0',
            label: '菜单'
          }, {
            value: '1',
            label: '按钮'
          }
          ],
      };
    },
    methods: {
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
       handleNodeClick(data) {
        // 得到被点击的菜单ID 
        this.menuForm.parentId = data.id;
        this.menuForm.parentName  = data.name;
        this.loadTableMenus();
      },
      // 加载树菜单
        loadTreeMenus(){
            this.$getRequest('/menu/getAllMenus', {
            }).then(result=> {
                if (result && result.status == 200) {
                    this.menuTreeData = result.data.data;
                }else {
                    this.$message({type: 'error', message: '数据加载失败!'});
                }
                });
        }
        // 加载菜单列表
        ,loadTableMenus(){
            this.$getRequest('/menu/getAllMenusTable', {
            name: this.keywords,
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            parentId: this.menuForm.parentId
            }).then(result=> {
                if (result && result.status == 200) {
                    this.menuTableData = result.data.data;
                    this.totalCount = result.data.total;
                }else {
                    this.$message({type: 'error', message: '数据加载失败!'});
                }
                });
        }
        // 分页改变条数的大小
        ,handleSizeChange(val){
           this.pageSize = val;
           this.loadTableMenus();
        }
        // 分页点击当前页
        ,handleCurrentChange(val){
           this.currentPage = val;
           this.loadTableMenus();
        }
        // 保存菜单资源
        ,openMenus(){
            this.dialogTitle = '新增菜单';
            if(this.menuForm.parentId == '' && this.menuForm.parentName == ''){
                this.menuForm.parentId = '0';
                this.menuForm.parentName = '根菜单';
            }
           this.menuDialogVisible = true;
        }
        // 监听计数器改变
        ,handleChange(value) {
         this.menuForm.sort = value;
      },
      // 取消点击
      cancelMenu(){
        this.menuDialogVisible = false;
        this.emptyMenuData();
      },
      // 保存菜单
      saveMenus(formName){
          this.$refs[formName].validate((valid) => {
             if (valid) {
                 this.loading = true;
                 this.$postRequest('/menu/saveMenu',this.menuForm) 
                 .then(result =>{
                  this.loading = false;
                 if(result.data.status == 200){
                      this.menuDialogVisible = false;
                      this.$message({type: 'success', message: result.data.message})    
                      this.emptyMenuData();
                      this.loadTreeMenus();
                      this.loadTableMenus();    
                  }else{
                      this.$message({type: 'error', message: result.data.message})
                  }
               
                 })
               }
           })
      },


      // 清空数据
      emptyMenuData(){
        this.menuForm = {
             parentId:　"",
             parentName: "",
             type: "",
             status: "0",
             component:"",
             iconCls:"",
             path:"",
             name:"",
             sort:"1"
        };
        // 刷新
      },refreshMenu(){
         this.keywords = "";
        
         this.loadTreeMenus();
         this.loadTableMenus();
      },
      // 搜索
      search(){
      this.loadTableMenus();
      }
      // 删除菜单
      ,deleteMenus(row){
            this.$confirm('删除该菜单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
               this.loading = true;
               this.$deleteRequest('/menu/deleteMenus',{id:row.id})
                .then(result =>{
                    this.loading = false;
                      if(result.data.status == 200){
                            this.$message({type: 'success', message: result.data.message})    
                            this.emptyMenuData();
                            this.loadTreeMenus();
                            this.loadTableMenus();    
                        }else{
                            this.$message({type: 'error', message: result.data.message})
                        }
                    
                    })
               }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
              });
            });
           }
           // 编辑菜单
           ,editMenus(row){
               this.dialogTitle = '编辑菜单';
               this.loading = true;
               this.$getRequest('/menu/getMenuById',{id:row.id})
               .then(result =>{
                     this.loading = false;
                     this.menuDialogVisible = true;
                      if(result.data.status == 200){
                            this.menuForm = result.data.data; 
                        }else{
                            this.$message({type: 'error', message: result.data.message})
                        }
                    
                    })
           }
       },
    mounted(){
        // loadMenus();
        this.loadTreeMenus();
        this.loadTableMenus();
    }
  };
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

