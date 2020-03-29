<template>
    <div>
        <div style="margin-top:10px;display: flex;align-items: center">
            <el-button icon="el-icon-plus" @click="showAddTruckView" type="primary">添加车辆信息</el-button>
            <el-date-picker
            v-model="daterange"
            type="daterange"
            style="margin: 0px 10px"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="success" icon="el-icon-search" @click="initTrucks">搜索</el-button>
            <el-select v-model="trucktype" placeholder="请选择" @change="initTrucks">
                <el-option
                v-for="item in types"
                :key="item"
                :label="item"
                :value="item">
                </el-option>
            </el-select>
        </div>
        <div style="margin-top: 10px">
            <el-table
                :data="trucks"
                stripe
                border
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width: 100%">
                <el-table-column
                prop="truckid"
                label="车辆编号"
                width="80">
                </el-table-column>
                <el-table-column
                prop="number"
                label="车牌号"
                width="100">
                </el-table-column>
                <el-table-column
                prop="buydate"
                label="购买日期">
                </el-table-column>
                <el-table-column
                prop="type"
                label="车辆类型">
                </el-table-column>
                <el-table-column
                prop="length"
                label="入队时常">
                </el-table-column>
                <el-table-column
                prop="tonnage"
                label="吨位">
                </el-table-column>
                <el-table-column
                prop="truckTeam.teamname"
                label="所属车队">
                </el-table-column>
                <el-table-column
                label="车辆状态">
                <template slot-scope="scope">
                    {{scope.row.state==1?'承运中':'空闲'}}
                </template>
                </el-table-column>
                <el-table-column
                prop="checkintime"
                label="加入时间">
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
            <div style="display:flex;justify-content:flex-end">
                <el-pagination
                background
                :page-sizes="[1,2,15,20]"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="sizeChage"
                @current-change="currentChange"
                style="margin-right:10px"
                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="60%">
        <div>
            <table>
            <tr>
                <td>
                <el-tag>车牌号</el-tag>
                </td>
                <td>
                <el-input v-model="truck.number"></el-input>
                </td>
                <td>
                <el-tag>购买日期</el-tag>
                </td>
                <td>
                <el-date-picker
                    v-model="truck.buydate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
                </td>
            </tr>
            <tr>
                <td>
                <el-tag>车辆类型</el-tag>
                </td>
                <td>
                <el-input v-model="truck.type"></el-input>
                </td>
                <td>
                <el-tag>入队时常</el-tag>
                </td>
                <td>
                <el-input v-model="truck.length"></el-input>
                </td>
            </tr>
            <tr>
                <td>
                <el-tag>吨位</el-tag>
                </td>
                <td>
                <el-input v-model="truck.tonnage"></el-input>
                </td>
                <td>
                <el-tag>所属车队</el-tag>
                </td>
                <td>
                <el-select v-model="truck.fkTeamid" placeholder="请选择车队">
                    <el-option
                    v-for="item in teams"
                    :key="item.teamid"
                    :label="item.teamname"
                    :value="item.teamid">
                    </el-option>
                </el-select>
                </td>
            </tr>
            <tr>
                <td>
                <el-tag>当前状态</el-tag>
                </td>
                <td>
                <el-radio-group v-model="truck.state">
                    <el-radio :label="1">承运中</el-radio>
                    <el-radio :label="2">空闲</el-radio>
                </el-radio-group>
                </td>
                <td>
                <el-tag>加入时间</el-tag>
                </td>
                <td>
                <el-date-picker
                    v-model="truck.checkintime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
                </td>
            </tr>
            <tr>
                <td>
                <el-tag>备注</el-tag>
                </td>
                <td colspan="3">
                <el-input
                    type="textarea"
                    :rows="5"
                    placeholder="请输入内容"
                    v-model="truck.remark">
                </el-input>
                </td>
            </tr>
            </table>
        </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAddTruck">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    
</template>
<script>
export default {
    name:'TruckMana',
    data() {
      return {
        // 列表数据  
        trucks: [],
        //车的种类
        types: [],
        //车队
        teams: [],
        //总条数
        total: 0,
        //每页数量
        pageSize: 1,
        //当前页
        currentPage: 1,
        //展示新增框的属性
        dialogVisible: false,
        //加载属性
        loading: false,
        //新增框的动态显示文字
        dialogTitle: '',
        //车类型
        trucktype: '全部',
        //时间范围
        daterange:null,
        //新增
        truck: {
          truckid: '',
          number: '',
          buydate: null,
          type: '',
          length: '',
          tonnage: 0,
          fkTeamid: 0,
          state: -1,
          remark: '',
          checkintime: null,
          isdelete: -1,
          altertime: null
        }
      }
    },
    mounted() {
     this.initTrucks();
     this.initTypes();
     this.initTeams();
    },
    methods:{
        initTeams() {
            this.getRequest("/truck/team/").then(resp=>{
                if (resp) {
                    this.teams = resp.data;
                }
            })
        },
        sizeChage(val){
            this.pageSize=val;
            this.initTrucks();
        },
        currentChange(val){
            this.currentPage=val;
            this.initTrucks();
        },
        showAddTruckView() {
                this.truck = {
                truckid: '',
                number: '',
                buydate: null,
                type: '',
                length: '',
                tonnage: 0,
                fkTeamid: null,
                state: -1,
                remark: '',
                checkintime: null,
                isdelete: -1,
                altertime: null
                }
                this.dialogTitle = '添加车辆信息';
                this.dialogVisible = true;
            },
        handleEdit(index, row) {
            this.truck = row;
            this.dialogTitle = '修改车辆信息';
            this.dialogVisible = true;
        },
        handleDelete(index, row) {
            //index表示当前行数，row表示当前记录{}
            // alert();
            this.$confirm('此操作将永久删除编号为【' + row.truckid + '】的车辆信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.deleteRequest("/truck/" + row.truckid).then(resp => {
                if (resp) {
                this.initTrucks();
                this.initTypes();
                }
            })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
            });
        },
        initTrucks(){
            let url='/truck/?type='+this.trucktype+'&size='+this.pageSize+'&page='+this.currentPage;
            if(this.daterange){
                url+='&daterange='+this.daterange[0]+'&daterange='+this.daterange[1]
            }
            this.loading=true;
            this.getRequest(url).then(resp=>{
                this.loading=false;
                if(resp){
                    this.trucks=resp.data;
                    this.total=resp.total;
                }
            })
        },
        initTypes(){
            this.getRequest("/truck/types").then(resp=>{
                if(resp){
                    this.types=resp;
                }
            })
        },
        doAddTruck(){
            if (this.truck.truckid) {
                //表示更新
                this.putRequest("/truck/", this.truck).then(resp => {
                    if (resp) {
                    this.dialogVisible = false;
                    this.initTrucks();
                    this.initTypes();
                    }
                })
            } else {
                this.postRequest("/truck/", this.truck).then(resp => {
                    if (resp) {
                    this.initTrucks();
                    this.initTypes();
                    this.dialogVisible = false;
                    }
                });
            }
        }
    }
}
</script>