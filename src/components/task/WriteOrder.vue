<template>
  <div>
    <div style="margin-top: 10px">
      <el-button type="primary" icon="el-icon-plus" @click="showAddTaskView">添加承运单</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="carriers"
        stripe
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
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
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div>
        <table class="addTaskTable">
          <tr>
            <td>发货单位</td>
            <td>
              <el-input v-model="carries.sendcompany"></el-input>
            </td>
            <td>发货单位地址</td>
            <td>
              <el-input v-model="carries.sendaddress"></el-input>
            </td>
          </tr>
          <tr>
            <td>发货人</td>
            <td>
              <el-input v-model="carries.sendlinkman"></el-input>
            </td>
            <td>发货人电话</td>
            <td>
              <el-input v-model="carries.sendphone"></el-input>
            </td>
          </tr>
          <tr>
            <td>收货单位</td>
            <td>
              <el-input v-model="carries.receivecompany"></el-input>
            </td>
            <td>收货单位地址</td>
            <td>
              <el-input v-model="carries.fkReceiveaddress"></el-input>
            </td>
          </tr>
          <tr>
            <td>收货人</td>
            <td>
              <el-input v-model="carries.receivelinkman"></el-input>
            </td>
            <td>收货人电话</td>
            <td>
              <el-input v-model="carries.receivephone"></el-input>
            </td>
          </tr>
          <tr>
            <td>承运日期</td>
            <td>
              <el-date-picker
                v-model="carries.leaverdate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </td>
            <td>收货时间</td>
            <td>
              <el-date-picker
                v-model="carries.receivedate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td>完成状态</td>
            <td>
              <el-select v-model="carries.finishedstate" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td>保险费</td>
            <td>
              <el-input v-model="carries.insurancecost"></el-input>
            </td>
          </tr>
          <tr>
            <td>运费</td>
            <td>
              <el-input v-model="carries.transportcost"></el-input>
            </td>
            <td>其他费用</td>
            <td>
              <el-input v-model="carries.othercost"></el-input>
            </td>
          </tr>
          <tr>
            <td>合计费用</td>
            <td>
              <el-input v-model="carries.totalcost"></el-input>
            </td>
            <td>备注</td>
            <td>
              <el-input v-model="carries.remark"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddTask">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "WriteOrder",
    data() {
      return {
        dialogVisible: false,
        loading: false,
        dialogTitle: '',
        carriers: [],
        options: [{
          value: 0,
          label: '待调度'
        }, {
          value: 1,
          label: '已调度'
        }, {
          value: 2,
          label: '已签收'
        }, {
          value: 3,
          label: '已结算'
        }],
        carries: {
          carriersid: '',
          sendcompany: '',
          sendaddress: '',
          sendlinkman: '',
          sendphone: '',
          receivecompany: '',
          fkReceiveaddress: '',
          receivelinkman: '',
          receivephone: '',
          leaverdate: '',
          receivedate: '',
          finishedstate: 0,
          insurancecost: '',
          transportcost: '',
          othercost: '',
          totalcost: '',
          remark: ''
        }
      }
    },
    mounted() {
      this.initCarriers();
    },
    methods: {
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该承运单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/task/"+row.carriersid).then(resp=>{
            if (resp) {
              this.initCarriers();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleEdit(index, row) {
        this.carries = row;
        this.dialogTitle = '修改承运单';
        this.dialogVisible = true;
      },
      initCarriers() {
        this.getRequest("/task/").then(resp => {
          if (resp) {
            this.carriers = resp.data;
          }
        })
      },
      showAddTaskView() {
        this.carries = {
          carriersid: '',
          sendcompany: '',
          sendaddress: '',
          sendlinkman: '',
          sendphone: '',
          receivecompany: '',
          fkReceiveaddress: '',
          receivelinkman: '',
          receivephone: '',
          leaverdate: '',
          receivedate: '',
          finishedstate: 0,
          insurancecost: '',
          transportcost: '',
          othercost: '',
          totalcost: '',
          remark: ''
        }
        this.dialogTitle = '添加承运单';
        this.dialogVisible = true;
      },
      doAddTask() {
        if (this.carries.carriersid) {
          //更新
          this.putRequest("/task/",this.carries).then(resp=>{
            if (resp) {
              this.initCarriers();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest("/task/", this.carries).then(resp => {
            if (resp) {
              //添加成功
              this.initCarriers();
              this.dialogVisible = false;
            }
          });
        }
      }
    }
  }
</script>

<style>
  .el-input {
    width: 250px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 250px;
  }

  .addTaskTable td:nth-child(even) {
    width: 250px;
  }

</style>
