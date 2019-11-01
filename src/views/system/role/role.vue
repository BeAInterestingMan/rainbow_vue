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
      
    </div>

    <div style="margin-top: 10px">
 <el-table
      :data="roleList"
      size="mini"
      border
      stripe
      v-loading="tableLoading"
      style="width: 100%">
      <el-table-column  type="selection"   align="left"  width="55"></el-table-column>
       <el-table-column  type="index"  align="left" fixed label="序号" width="50"> </el-table-column>
      <el-table-column prop="name" align="left" fixed  label="角色名"   width="100"> </el-table-column>
      <el-table-column prop="status" align="left" fixed  label="状态"   width="80"> </el-table-column>
      <el-table-column prop="creator" align="left" fixed  label="创建人"   width="80"> </el-table-column>
      <el-table-column  prop="createTime" align="left" fixed  label="创建时间"   width="170"> </el-table-column> 
     
     <el-table-column prop="remark" align="left" fixed  label="备注"   width="300"> </el-table-column>

    <el-table-column label="操作" align="center">
        <template slot-scope="scope">
                  <el-button
                    size="mini"  icon="el-icon-edit" type="primary"
                    @click="handleEdit(scope.$index, scope.row)">编辑角色
                  </el-button>

                <el-button
                    size="mini"  icon="el-icon-edit" type="primary"
                    @click="handleEdit(scope.$index, scope.row)">分配资源
                  </el-button>

                  <el-button
                    size="mini"
                    icon="el-icon-delete" type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除角色
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
</div>
 
</template>

<script>
export default {
    data(){

     return{
         roleList:[],
         tableLoading: false,
         keywords: "",
         totalCount: 0,
         currentPage: 1,
         pageSize: 10
     }
     

    }
    ,methods:{

//  加载角色列表
    loadRoles(){
      this.$getRequest('/role/selectRoleWithPage', { 
          name: this.keywords,
          pageSize: this.pageSize,
          currentPage: this.currentPage
       }
         ).then(result=> {
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
    // 编辑角色
    handleEdit(val1,val2){
      console.log(val1);
        console.log(val2);
    },
    // 删除角色
    handleDelete(){

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
    }

    }
    // 页面元素加载完成后执行
    ,mounted(){
      this.loadRoles();
    }
   
}
</script>