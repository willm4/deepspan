import * as $ from 'jquery'
export default class DatePickers{
    static init(callback){
        setTimeout(()=>{
            $('.input-group.date').datepicker({
              todayHighlight: true,
              autoclose: true,
              defaultViewDate: {year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate()}
            });
            $('.input-group.date').on('changeDate', (event)=>{
              callback(event.date);
            })
          }, 500);
    }
}