<template>
      <div style="padding-top:10px">
     
            <el-container>
            <el-aside width="500px">
                    <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
                        <el-card style="width:330px;margin-top: 10px;" >
                            <div>
                            <div><img :src="user.avatar"  style="width: 70px;height: 70px"></div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>用户名:</span><span>{{user.username}}</span>
                            </div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>昵称:</span><span>{{user.nickname}}</span>
                            </div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>电子邮箱:</span><span>{{user.email}}</span>
                            </div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>注册时间:</span><span>{{user.createTime}}</span>
                            </div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>性别:</span><span v-if="user.sex ==0">男</span><span v-if="user.sex ==1">女</span>
                            </div>

                            <div style="text-align: left;color:#20a0ff;font-size: 12px;margin-top: 13px">
                                <span>用户状态:</span><span v-if="user.status ==0">启用</span><span v-if="user.status ==1">锁定</span>
                            </div>
                            </div>
                        </el-card>

                    </div>
            </el-aside>
            <el-main>

                    <div id="myChart" :style="{width: '300px', height: '300px'}"></div>

            </el-main>
            </el-container>
       </div>
</template>

<script>
export default {
    // 计算属性  可直接应用于页面
   
    computed:{
        user(){
        return this.$store.state.user;
      }
    }
    ,data () {
    return {
    }
    }
     ,mounted(){
         // 加载后台数据
     this.$getRequest('/loginLog/getVisitLogCount').then(result =>{
        if(result && result.data.status == 200){
            var data = result.data.data;
            var countData =[];
             for(var i =0;i<data.length;i++){
                countData.push(data[i]);
             }
               this.drawLine(countData);
        }
   })
  },methods: {
    drawLine(countData){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '系统访问记录' },
            tooltip: {},
            xAxis: {
                data: ["本日","本周","本月","本年","全部"]
            },
            yAxis: {},
            series: [{
                name: '人数',
                type: 'bar',
                data: countData
            }]
        });
    }
 
  }
}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>