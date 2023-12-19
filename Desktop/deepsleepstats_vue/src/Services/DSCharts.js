import DSChart from '@/Models/DSChart'
export default class DSCharts{
    static getChartOptions(){
        return {
            scales: {
              x: {
                type: 'timeseries',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'M/DD'
                  },
                  tooltipFormat: 'MM/DD/YYYY'
                }
              },
              y: {
                min: 0
              }
            }
          };
    }
    static getViewOptions(){
        return [{name: 'Week', days: 7}, {name: 'Month', days: 31}, {name: 'Year', days: 365}];
    }
    static getCharts(){
        let result = [];
        const views = this.getViewOptions();
        const selected = views[0];
        result.push(new DSChart('timeSeriesChart1','New Signup Summary', views, selected, "newsignups" ));
        result.push(new DSChart('timeSeriesChart2','Active Users per Day', views, selected, "usersynced" ));
        result.push(new DSChart('timeSeriesChart3','Total Activity per Day', views, selected, "countAppOpened" ));
        return result;
    }

}