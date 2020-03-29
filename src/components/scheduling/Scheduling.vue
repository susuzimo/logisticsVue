<template>
  <div>
    <div></div>
    <div style="margin-top: 10px">
      <el-tag type="primary">待调度承运单</el-tag>
      <el-table
        :data="carriers"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="carriersid"
          label="承运单编号"
          fixed
          width="100">
        </el-table-column>
        <el-table-column
          prop="sendlinkman"
          fixed
          label="发货人">
        </el-table-column>
        <el-table-column
          prop="sendcompany"
          label="发货单位"
          width="100">
        </el-table-column>
        <el-table-column
          prop="sendaddress"
          width="150"
          label="发货单位地址">
        </el-table-column>
        <el-table-column
          prop="sendphone"
          width="150"
          label="发货人电话">
        </el-table-column>
        <el-table-column
          prop="receivecompany"
          width="150"
          label="收货单位">
        </el-table-column>
        <el-table-column
          prop="fkReceiveaddress"
          width="150"
          label="收货单位地址">
        </el-table-column>
        <el-table-column
          prop="receivelinkman"
          label="收货人">
        </el-table-column>
        <el-table-column
          prop="receivephone"
          width="150"
          label="收货人电话">
        </el-table-column>
        <el-table-column
          prop="leaverdate"
          width="150"
          label="承运日期">
        </el-table-column>
        <el-table-column
          prop="receivedate"
          width="150"
          label="收货时间">
        </el-table-column>
        <el-table-column
          label="完成情况">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.finishedstate==0" type="danger">待调度</el-tag>
            <el-tag v-else-if="scope.row.finishedstate==1" type="info">已调度</el-tag>
            <el-tag v-else-if="scope.row.finishedstate==2" type="warning">已签收</el-tag>
            <el-tag v-else type="success">已结算</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="insurancecost"
          label="保险费">
        </el-table-column>
        <el-table-column
          prop="transportcost"
          label="运费">
        </el-table-column>
        <el-table-column
          prop="othercost"
          label="其他费用">
        </el-table-column>
        <el-table-column
          prop="totalcost"
          label="合计费用">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="checkintime"
          width="150"
          label="录入时间">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-popover
              placement="left"
              title="承运单调度"
              width="230"
              trigger="manual"
              v-model="visible">
              <div>
                <el-select v-model="truckid" placeholder="请选择车辆">
                  <el-option
                    v-for="item in trucks"
                    :key="item.truckid"
                    :label="item.number"
                    :value="item.truckid">
                  </el-option>
                </el-select>
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="选择出发时间">
                </el-date-picker>
                <div style="display: flex;justify-content: flex-end;margin-top: 8px">
                  <el-button type="primary" @click="sche(scope.row)">确定</el-button>
                </div>
              </div>
              <el-button
                size="mini"
                type="success" slot="reference"
                @click="visible=!visible">调度
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 30px;border-top: 1px solid #409eff"></div>
    <div style="margin-top: 10px">
      <el-tag type="success">已调度承运单</el-tag>
      <el-table
        :data="sches"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="schedulingid"
          label="调度编号"
          fixed
          width="100">
        </el-table-column>
        <el-table-column
          prop="starttime"
          width="150"
          label="出发时间">
        </el-table-column>
        <el-table-column
          prop="fkCarriersid"
          label="承运单编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="fkTruckid"
          label="车辆编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="oilcost"
          width="150"
          label="邮费">
        </el-table-column>
        <el-table-column
          prop="toll"
          width="150"
          label="过桥费">
        </el-table-column>
        <el-table-column
          prop="fine"
          width="150"
          label="罚款">
        </el-table-column>
        <el-table-column
          prop="othercost"
          width="150"
          label="其他费用">
        </el-table-column>
        <el-table-column
          prop="totalcost"
          label="合计成本">
        </el-table-column>
        <el-table-column
          prop="remark"
          width="150"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="receivedate"
          width="150"
          label="调度时间">
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Scheduling",
    data() {
      return {
        carriers: [],
        trucks: [],
        sches: [],
        truckid: '',
        startTime: null,
        visible: false
      }
    },
    mounted() {
      this.initCarriers();
      this.initTrucks();
      this.initSches();
    },
    methods: {
      initSches() {
        this.getRequest("/sche/").then(resp=>{
          if (resp) {
            this.sches = resp.data;
          }
        })
      },
      sche(row) {
        this.postKeyValueRequest("/sche/", {
          carriersid: row.carriersid,
          truckid: this.truckid,
          startTime: this.startTime
        }).then(resp => {
          if (resp) {
            this.initCarriers();
            this.initSches();
            this.visible = false;
          }
        })
      },
      initTrucks() {
        this.getRequest("/sche/truck").then(resp => {
          if (resp) {
            this.trucks = resp;
          }
        })
      },
      initCarriers() {
        this.getRequest("/sche/carriers").then(resp => {
          if (resp) {
            this.carriers = resp.data;
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
