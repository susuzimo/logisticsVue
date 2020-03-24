<template>
  <div>
    <div style="display:flex;justify-content:center;margin-top:50px">
        <el-card style="width:400px">
            <div slot="header" class="clearfix">
                <span>登录</span>
            </div>
            <table>
                <tr>
                    <td>用户名</td>
                    <td><el-input v-model="user.account" placeholder="请输入用户名"></el-input></td>
                </tr>
                <tr>
                    <td>密码</td>
                    <td><el-input type="password" v-model="user.password" placeholder="请输入密码" @keydown.enter.native="doLogin"></el-input></td>
                </tr>
                <tr>
                    <td colspan="2"><el-button type="primary" style="width:300px"  @click="doLogin">登录</el-button></td>
                </tr>
            </table>
        </el-card>
   </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
      return{
          user:{
             account:'',
             password:''
          }
      }
  },
  methods:{
      doLogin(){
          this.postRequest("/doLogin",this.user).then(data=>{
              if(data){
                window.sessionStorage.setItem("user",JSON.stringify(data.obj));    
                this.$router.replace("/home")
              }
          })
      }
  }
}
</script>

<style>

</style>
