
import moment from "moment";
import Chart from 'chart.js'
window.Chart = Chart;

export default class DSChart{
    constructor(_canvasId, _name, _views, _selectedView, _activityType){
        this.ctx = null;
        this.data = [];
        this.chart = null;
        this.canvasId = _canvasId;
        this.name = _name;
        this.views = _views;
        this.selectedView = _selectedView;
        this.activityType = _activityType;
    }
}


DSChart.prototype.SetCtx = function(){
    const self = this;
    self.ctx = document.getElementById(self.canvasId).getContext('2d')
};

DSChart.prototype.Plot = function(statsObj, options){
    const self = this;
    // PLOT CHART 
    self.data = [];
    const len = statsObj.length;
    for (let i = 0; i < len; i++) {
        self.data[len - 1 - i] = statsObj[i].value;
    }
    const labels = [];
    const numDays = statsObj.length;
    const startDate = moment().subtract(numDays - 1, 'days').format('MM/DD/YYYY');
    for (let i = 0; i < numDays; i++) {
      const date = moment(startDate).add(i, 'days').format('MM/DD/YYYY');
      labels.push(date.toString());
    }
    //CREATE CHART 
    if(self.chart){
        self.chart.destroy();
      }
      self.chart = new Chart(self.ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: self.activityType,
            data: self.data,
            borderWidth: 3, 
            borderColor: 'rgb(0, 0, 204)',
          }]
        },
        options: options,
      });
};


