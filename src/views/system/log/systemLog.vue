<template>
  <div>


<div style="margin-top: 20px;display: flex;justify-content: left">
      <el-input
        placeholder="可以通过操作人搜索..."
        prefix-icon="el-icon-search"
        v-model="searchParams.username" style="width: 200px" size="small">
      </el-input>

      <el-date-picker size="small"
      v-model="time"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>

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
       <el-table-column prop="nickname" align="center" fixed  label="操作人昵称"   width="100"> </el-table-column>
       <el-table-column prop="username" align="center" fixed  label="操作人用户名"   width="100"> </el-table-column>
       <el-table-column prop="actionDescription" align="left" fixed  label="业务描述"   width="100"> </el-table-column>
       <el-table-column prop="className" align="center" fixed :show-overflow-tooltip="true" label="请求类名"   width="100"> </el-table-column>
       <el-table-column prop="methodName" align="center" fixed :show-overflow-tooltip="true" label="请求方法"   width="100"> </el-table-column>
        <el-table-column prop="params" align="center" :show-overflow-tooltip="true" fixed  label="请求参数"   width="100"> </el-table-column>
        <el-table-column prop="ip" align="center" fixed  label="ip地址"   width="100"> </el-table-column>
        <el-table-column prop="operateType" align="center" fixed  label="操作类型"   width="100"> </el-table-column>
       <el-table-column  prop="createTime" align="center" fixed  label="操作时间"   width="140"> </el-table-column> 

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
                    startTime:"",
                    endTime:"",
                    type:""
            }, 
            time:"",
            logList:[],
            tableLoading: false,
            totalCount: 0,
            currentPage: 1,
            pageSize: 5,
    }
   },methods:{
       // 搜索
        search(){
          this.loadLogTable();
        }
        // 刷新
        ,refresh(){
          this.searchParams = {
            username:"",
          };
          this.loadLogTable();
        }
        // 删除日志
        ,deleteLog(){

        },
            // 切换页面总条数
        handleSizeChange(val){
            this.pageSize = val;
            this.loadLogTable();
        },
        // 切换当前页
        handleCurrentChange(val){
            this.currentPage = val;
            this.loadLogTable();
        },
        // 加载日志列表
        loadLogTable(){
           this.tableLoading = true;
              this.searchParams.startTime = this.getTime(new Date(this.time[0]));
              this.searchParams.endTime = this.getTime(new Date(this.time[1]));
          
           this.$getRequest('/log/selectLogWithPage', { 
      
            pageSize: this.pageSize,
            currentPage: this.currentPage
        }).then(result=> {
            this.tableLoading = false;
            if (result && result.status == 200) {
                this.logList = result.data.data;
                this.totalCount = result.data.total;
            }else {
                this.$message({type: 'error', message: '日志数据列表加载失败!'});
            }
        });
        } ,
        //时间格式化
        getTime(dt){
           if(dt){
          var year = dt.getFullYear(); //年
            var month = dt.getMonth() +1; //月
            var date = dt.getDate(); //日
            month = month < 10 ? "0" + month : month;
            date  = date <10 ? "0" + date : date;
            var str = year + "-" + month + "-" + date;
            return str;
           }else{
             return "";
           }
        }

   },mounted(){
      this.loadLogTable();
   }    
}
</script>
<style scoped>

</style>