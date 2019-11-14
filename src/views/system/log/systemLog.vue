<template>
  <div>


<div style="margin-top: 20px;display: flex;justify-content: left">
      <el-input
        placeholder="可以通过操作人搜索..."
        prefix-icon="el-icon-search"
        v-model="searchParams.username" style="width: 200px" size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="search">搜索
      </el-button>
       <el-button type="primary" icon="el-icon-refresh" size="small" style="margin-left: 3px" @click="refresh">刷新
      </el-button>
    
    </div>

    <div style="margin-top: 10px">
 <el-table
      :data="logList"
      size="mini"
      border
      stripe
      v-loading="tableLoading"
      style="width: 100%">
       <el-table-column  type="selection"   align="center"  width="55"></el-table-column>
       <el-table-column  type="index"  align="center" fixed label="序号" width="50"> </el-table-column>
       <el-table-column prop="nickname" align="left" fixed  label="操作人昵称"   width="100"> </el-table-column>
       <el-table-column align="username" fixed  label="操作人用户名"   width="100"> </el-table-column>
       <el-table-column prop="actionDescription" align="center" fixed  label="业务描述"   width="100"> </el-table-column>
       <el-table-column prop="methodName" align="center" fixed  label="请求方法"   width="100"> </el-table-column>
        <el-table-column prop="params" align="center" fixed  label="请求参数"   width="100"> </el-table-column>
        <el-table-column prop="ip" align="center" fixed  label="ip地址"   width="100"> </el-table-column>
        <el-table-column prop="operateType" align="center" fixed  label="操作类型"   width="100"> </el-table-column>
        <el-table-column prop="creatorName" align="center" fixed  label="业务描述"   width="100"> </el-table-column>
       <el-table-column  prop="createTime" align="center" fixed  label="操作时间"   width="160"> </el-table-column> 

    <el-table-column label="操作" align="center">
        <template slot-scope="scope">
                  <el-button
                    size="mini"
                    class="el-icon-delete" type="danger"
                    @click="deleteLog(scope.$index, scope.row)">
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
        :page-sizes="[5, 10, 15]"
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
            searchParams:{
                    username:"",
            }, 
            logList:[],
            tableLoading: false,
            totalCount: 0,
            currentPage: 1,
            pageSize: 5,
    }
   },methods:{
       // 搜索
        search(){

        }
        // 刷新
        ,refresh(){

        }
        // 删除日志
        ,deleteLog(){

        },
            // 切换页面总条数
        handleSizeChange(val){
            this.pageSize = val;
          
        },
        // 切换当前页
        handleCurrentChange(val){
            this.currentPage = val;
         
        },
        // 加载日志列表
        loadLogTable(){
           this.$getRequest('/log/selectLogWithPage', { 
            username: this.searchParams.username,
            pageSize: this.pageSize,
            currentPage: this.currentPage
        }).then(result=> {
            this.tableLoading = false;
            if (result && result.status == 200) {
                this.roleList = result.data.data;
                this.totalCount = result.data.total;
            }else {
                this.$message({type: 'error', message: '日志数据列表加载失败!'});
            }
        });
        }  
   },mounted(){
      this.loadLogTable();
   }    
}
</script>
<style scoped>

</style>