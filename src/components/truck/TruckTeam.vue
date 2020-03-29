<template>
  <div>
    <div style="margin-top: 10px">
      <el-button icon="el-icon-plus" type="primary" @click="showAddTruckTeamView">添加车队</el-button>
      <el-input
        placeholder="请输入关键字进行搜索..."
        prefix-icon="el-icon-search"
        style="width: 300px"
        clearable
        @clear="initTeams"
        @keydown.enter.native="initTeams"
        v-model="keyword">
      </el-input>
    </div>
    <div style="margin-top: 10px">
      <el-table
        :data="teams"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="teamid"
          label="车队编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="teamname"
          label="车队名称"
          width="100">
        </el-table-column>
        <el-table-column
          prop="leader"
          label="车队负责人">
        </el-table-column>
        <el-table-column
          prop="checkintime"
          label="创队时间">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column label="操作" width="150">
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
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
          background
          :page-sizes="[5,10,15,20]"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="currentChange"
          @size-change="sizeChange"
          style="margin-right: 10px"
          layout="sizes, prev, pager, next, jumper, ->, total, slot"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <table>
          <tr>
            <td>车队名称</td>
            <td>
              <el-input v-model="truckTeam.teamname"></el-input>
            </td>
          </tr>
          <tr>
            <td>车队负责人</td>
            <td>
              <el-input v-model="truckTeam.leader"></el-input>
            </td>
          </tr>
          <tr>
            <td>创队时间</td>
            <td>
              <el-date-picker
                v-model="truckTeam.checkintime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td>
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="truckTeam.remark">
              </el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddTruckTeam">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "TruckTeam",
    data() {
      return {
        dialogVisible: false,
        dialogTitle: '',
        keyword: '',
        teams: [],
        total: 0,
        pageSize: 5,
        currentPage: 1,
        truckTeam: {
          teamid: '',
          teamname: '',
          leader: '',
          remark: '',
          checkintime: null,
          isdelete: -1,
          altertime: null
        }
      }
    },
    mounted() {
      this.initTeams();
    },
    methods: {
      currentChange(val) {
        this.currentPage = val;
        this.initTeams();
      },
      sizeChange(val) {
        this.pageSize = val;
        this.initTeams();
      },
      initTeams() {
        this.getRequest("/truck/team/?keyword="+this.keyword+"&page="+this.currentPage+"&size="+this.pageSize).then(resp => {
          if (resp) {
            this.teams = resp.data;
            this.total = resp.total;
          }
        })
      },
      handleEdit(index, row) {
        this.truckTeam = row;
        this.dialogTitle = '修改车队信息';
        this.dialogVisible = true;
      },
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除【' + row.teamname + '】车队, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/truck/team/" + row.teamid).then(resp => {
            if (resp) {
              this.initTeams();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      doAddTruckTeam() {
        if (this.truckTeam.teamid) {
          //更新
          this.putRequest("/truck/team/",this.truckTeam).then(resp=>{
            if (resp) {
              this.initTeams();
              this.dialogVisible = false;
            }
          })
        } else {
          this.postRequest("/truck/team/", this.truckTeam).then(resp => {
            if (resp) {
              this.initTeams();
              this.dialogVisible = false;
            }
          });
        }
      },
      showAddTruckTeamView() {
        this.truckTeam = {
          teamid: '',
          teamname: '',
          leader: '',
          remark: '',
          checkintime: null,
          isdelete: -1,
          altertime: null
        }
        this.dialogTitle = '添加车队信息';
        this.dialogVisible = true;
      }
    }
  }
</script>

<style scoped>

</style>
