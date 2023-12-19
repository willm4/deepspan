
<template>
  <div id="app">
      <nav class="navbar navbar-dark bg-dark justify-content-between fixed-top">
        <div style="display: flex; flex-direction: column; width: 100%;" class="container container-fluid">
          <div style="width: 100%; display: flex; flex-direction: row;">
            <a class="navbar-brand" href="#" style="display: flex; flex-direction: row; align-items: center; flex:1;"><img src="@/assets/dsstatslogo.png" style="width:22px;height:25px;"> <h4 style="display: inline; padding-left: 10px; margin:0px !important;">DeepSleep Site Stats</h4></a>
            <form class="form-inline">
              <button class="btn btn-danger btn-sm my-2 my-sm-0"  type="submit" v-on:click="logout()">Logout</button>
            </form>
          </div>
          <div style="width: 100%; display: flex; align-items: flex-start;">
            <ul class="nav">
              <li class="nav-item" v-for="(view, viewIndex) in views" :key="viewIndex">
                <div class="nav-link site-nav"   v-bind:class="{'active': currentView == view}" v-on:click="changeView(view)">{{view}}</div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      

      <div style="margin-top: 110px;">
        <!-- LOGGED IN -->
        <div class="container" v-if="isAuthorized">
          <!-- STATS -->
          <div style="width: 100%;" v-show="currentView == 'Stats'">
            <!-- https://uxsolutions.github.io/bootstrap-datepicker/?markup=range&format=&weekStart=&startDate=&endDate=&startView=0&minViewMode=0&maxViewMode=4&todayBtn=false&clearBtn=false&language=en&orientation=auto&multidate=&multidateSeparator=&keyboardNavigation=on&forceParse=on#sandbox -->
            <div class="input-group date" style="display: flex; flex-direction: row; align-items: center; padding-bottom: 20px;">
              <label style="font-weight: bold; margin:0px !important; padding-right: 5px;">
                Select Date: 
              </label>
              <input v-model="selectedDate" v-on:change="changeDate()" type="text" class="form-control"><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
            </div>

            <button class="btn btn-default" v-on:click="executeGCloud()">Execute GCloud call</button>
      
            <div class="row">
            
              <div class="col-md-6 col-sm-12" v-for="(table,tableIndex) in statTables" :key="tableIndex">
                <table class="table table-striped table-bordered">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">{{table.title}}</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,rowIndex) in table.rows" :key="rowIndex">
                      <th scope="row">{{row.key}}</th>
                      <td>{{row.value || '-'}}</td>
                      <td>
                        <button type="button" class="btn btn-link" style="padding: 0px !important;">
                          <i class="fa fa-refresh" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          <!-- CHARTS -->
          <div style="width: 100%;" v-show="currentView == 'Charts' ">
            <div v-for="(chart, index) in charts" :key="index">
              <h4>{{chart.name}}</h4>
              <div class="btn-group btn-group-sm" role="group" aria-label="Basic example" v-for="(view, viewIndex) in chart.views" :key="viewIndex">
                <button type="button" class="btn-outline-primary" :class="{'active': chart.selectedView == view}" v-on:click="changeChartView(index, view)">{{view.name}}</button>
              </div>
              <canvas class="area" :id='chart.canvasId' width='200' height='100'>
    
              </canvas>
                <br>
            </div>
          </div>
        </div>
        <!-- NOT LOGGED IN -->
        <div v-if="!isAuthorized">
          <div class="container">
            <div class="row d-flex justify-content-center align-items-center m-0" style="height: 100vh;">
              <div class="login_oueter">
                <div class="col-md-12 logo_outer"></div>
                <div class="bg-light border p-3">
                  <div class="form-row">
                    <h4 class="title my-3">Login For Access</h4>
                    <div class="col-12">
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" id="basic-addon1"><i class="fas fa-user"></i></span>
                        </div>
                        <input name="username" type="text" v-model="login_params.data.email" class="input form-control"  placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" id="basic-addon1"><i class="fas fa-lock"></i></span>
                        </div>
                        <input name="password" v-bind:type="login_params.show_password ? 'text ' : 'password' " v-model="login_params.data.password"  class="input form-control" placeholder="password" required="true" aria-label="password" aria-describedby="basic-addon1" />
                        <div class="input-group-append">
                          <span class="input-group-text" v-on:click="login_params.show_password = !login_params.show_password">
                            <i class="fas fa-eye" v-if="!login_params.show_password"></i>
                            <i class="fas fa-eye-slash" id="hide_eye" v-if="login_params.show_password"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="form-group form-check text-left">
                        <input type="checkbox" name="remember" class="form-check-input" v-model="login_params.remember_me" />
                        <label class="form-check-label" for="remember_me">Remember me</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary" v-on:click="login()" name="signin" >Login</button>
                    </div>
                  </div>
                </div>
                <div v-if="login_error_msg" class="alert alert-danger alert-dismissible"  style="margin-top: 10px;">
                  <a href="#" class="close" data-dismiss="alert" v-on:click="login_error_msg = null" aria-label="close">&times;</a>
                  <strong>{{login_error_msg}}</strong> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
  
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Stats from '@/Services/Stats';
import Utilities from '@/Services/Utilities';
import DSCharts from '@/Services/DSCharts';
//import DatePickers from '@/Services/DatePickers';
import Cookies from '@/Services/Cookies';
import GCloudService from '@/Services/GCloudService'
export default {
  name: 'App',
  components: {
    // HelloWorld
  },
    mounted(){
 GCloudService.getGcloudDate();
        // if(Cookies.get('ds_auth')){
        //   setTimeout(()=>{
        //     this.initStats();
        //   }, 500);
        // }
        console.log(process.env.VUE_APP_GCLOUD_KEY)
        this.setup();


       // GCloudService.getGcloudDate();
    },
    data(){
        return {
            selectedDate: new Date().toLocaleDateString(),
            currentView: 'Stats',
            views: ['Charts', 'Stats'],
            statTables: [Stats.getSummaryTable(), Stats.getPerformanceTable()],
            charts:DSCharts.getCharts(),
            ds_auth: {
              session: '9784e61d-1650-4985-4c58-e00fd499b209'
            },
            // Login stuff
            login_error_msg: null,
            login_params: {
              data: {
                email: null,
                password: null
              },
              remember_me: false,
              show_password: false
            }
        }
    },
    methods:{
      async setup(){
        ////DatePickers.init(this.changeDate);
        setTimeout(this.initCharts, 500)
      },
      async login(){
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        var requestOptions = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(this.login_params.data),
          redirect: 'follow'
        };
        let response = await this.makeApiCall("https://sleepnet.appspot.com/api/login", requestOptions);
        if (response) {
          if (response.result != 'success') {
            this.login_error_msg = 'Login Failed: ' + response.message;
          } else {
            if (this.login_params.remember_me) {
              Cookies.set("ds_auth", JSON.stringify(response));
            } else {
              Cookies.erase("ds_auth");
            }
            this.ds_auth = response;
            this.setup();
          }
        } else {
          this.login_error_msg = 'Login Failed: Internal Server Error'
        }
      },
      async logout() {
        const callback = () => {
          this.ds_auth = null;
          Cookies.erase("_SleepNetSession");
          Cookies.erase("ds_auth");
          location.reload();
        };
        let result = await this.makeApiCall("https://sleepnet.appspot.com/api/logout", this.oldGetRequestOptions('DELETE'));
        callback(result);
      },
      initCharts(){
        this.charts.forEach(chart=>{
          chart.SetCtx();
          this.getDeepSleepCharts(chart);
        });
      },
      changeDate(date){
        console.log("CHANGE DATE ", date)
        console.log('NEW DATE ', date)
        this.getLeadersByStat(date);
      },
      changeView(view){
        this.currentView = view;
        switch(this.currentView){
          case 'Charts':
            break;
          case 'Stats':
            // this.statTables.forEach(st=>{
            //   Stats.addCustomerActivity(st, this.charts);
            // });
            this.getLeadersByStat();
            break;
        }
      },
      executeGCloud(){
        GCloudService.execute();
      },
       changeChartView(statIndex, view){
          let chart = this.charts[statIndex];
          chart.selectedView = view;
          this.getDeepSleepCharts(chart);
       },
       getDeepSleepCharts(chart) {
        let dayOffset = 0;
        fetch(`https://sleepnet.appspot.com/api/admin/pacific/${chart.activityType}/${dayOffset}/1/${chart.selectedView.days}`)
          .then(response => response.text())
          .then(responseData => {
            //this.plotChart(stat, JSON.parse(responseData));
            chart.Plot(JSON.parse(responseData), DSCharts.getChartOptions())
          });
      },
      async getLeadersByStat(){
        let offsets = Utilities.calcOffsetsFromDate(this.selectedDate).offsets;
        let staststring = 'tst';
        let offsetAdjusted = offsets.dayoffsetadjusted;
        let hourUTC = offsets.utchouroffset;
        let window_start = 0;
        let window_end = 10000;
        let path = Utilities.getPathGoServer('leaders/v2/stat/window/Trued/' +staststring+'/' + offsetAdjusted+ '/' + hourUTC + '/1/'+window_start+'/'+window_end);
        let options = Utilities.oldGetRequestOptions('GET', this.ds_auth.session);
        let result = await this.makeApiCall(path,options);
        if(result){
          console.log("GOT LEADERS BYS STAT", result);
        }
      },
      async makeApiCall(path, options) {
        let response;
        await fetch(path, options)
          .then(res => res.json())
          .then(dataBack => {
            if (dataBack) {
              response = dataBack;
            }
          });
        return (response);
      }
    },
    computed:{
      isAuthorized() {
        //return this.ds_auth;
        return true;
      }
    }
}

</script>


<style>

.site-nav{
    color: #cacaca;
  }
  .site-nav.active{
    color:white;
    text-decoration: underline;
  }
  .site-nav:hover{
    text-decoration: underline;
    cursor:pointer;
  }
  tr > td{
    text-align: center;
  }
  .table .thead-dark th{
    border: none !important;
  }
</style>
