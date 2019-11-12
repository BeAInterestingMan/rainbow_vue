<template>
    <div>

    <div style="margin-top: 20px;display: flex;justify-content: center">
      <el-input
        placeholder="可以通过角色名称搜索角色..."
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" >搜索
      </el-button>
       <el-button type="primary" icon="el-icon-refresh" size="small" style="margin-left: 3px" >刷新
      </el-button>
       <el-button type="primary" size="mini" icon="el-icon-plus" >添加角色 </el-button>
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
                        border
                        stripe
                        v-loading="tableLoading"
                        style="width: 100%">
                        <el-table-column  type="selection"   align="center"  width="55"></el-table-column>
                        <el-table-column  type="index"  align="center" fixed label="序号" width="50"> </el-table-column>
                        <el-table-column prop = "name" align="left" fixed  label="菜单名称"   width="100"> </el-table-column>
                        <el-table-column prop = "path" align="left" fixed  label="菜单URL"   width="100"> </el-table-column>
                        <el-table-column prop = "component" align="left" fixed  label="前端组件"   width="100"> </el-table-column>
                         <el-table-column prop = "iconCls" align="left" fixed  label="图标"   width="100"> </el-table-column>
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
                         <el-table-column prop = "type" align="left" fixed  label="类型"   width="100"> </el-table-column>
                        <el-table-column prop="creatorName"  align="left" fixed  label="创建人"   width="80"> </el-table-column>
                        <el-table-column  prop="createTime" align="left" fixed  label="创建时间"   width="170"> </el-table-column> 
                        
                        <el-table-column  prop="remark" align="left" fixed  label="备注"   width="300"> </el-table-column>

                        <el-table-column label="操作" align="center">
                            <!-- <template slot-scope="scope">
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
                                </template> -->
                        </el-table-column>
                        </el-table>
                    </div>

                    <!-- 列表分页 -->
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

            </el-main>
        </el-container>
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
         pageSize: 10,
          menuProps:{
              children: 'children',
              label: 'name'
          },
          menuTreeData:[],
          menuTableData:[],
          // 树被点击菜单的ID
          clickNodeId:"",
          menuForm:{

          }   
      };
    },
    methods: {
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
       handleNodeClick(data) {
        // 得到被点击的菜单ID 
        this.clickNodeId = data.id;
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
            parentId: this.clickNodeId
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
    }, 
    mounted(){
        // loadMenus();
        this.loadTreeMenus();
        this.loadTableMenus();
    }
  };
</script>

<style scoped>

</style>

