import moment from "moment";
export default class Utilities {
    static targetLocalHr = 14;
    static targetUTCHour;
    static calcOffsetsFromDate(date){

        const  calcUTCHourOffsetReturnDate = (localDate) =>{
          let localDateResponse = new Date(localDate);
          localDateResponse.setHours(this.targetLocalHr, 0, 0, 0);
          return localDateResponse;
        }; 
        let datestring = new Date(date).toLocaleDateString();
        console.log("CALC OFFSETS FROM DATE ", datestring)
        let response = {offsets: {dayoffsetadjusted: null, utchouroffset: null}, startDate: null, endDate: null}
        let target = moment(new Date(datestring).valueOf()).startOf('day');
        let current = moment(new Date().valueOf()).startOf('day');
        let offset = Math.round(
          Math.abs(moment.duration(target.diff(current)).asDays())
        );
        let todayLocal = calcUTCHourOffsetReturnDate(new Date());
        this.targetUTCHour = todayLocal.getUTCHours(); //2pm hawaii will return 0
    
        let now = new Date();
        let dayUTC = now.getUTCDate();
    
        // console.log("calcOffsetsFromDate: ", 'original offset: ');
        // console.log("calcOffsetsFromDate: ", offset);
    
    
        let timeZoneHrOffset = now.getTimezoneOffset();
    
        // console.log("calcOffsetsFromDate: ", 'starting to adjust offset and starting at: ' + offset);
    
        if (Math.abs(todayLocal.getDate() - dayUTC) < 2) {
          if (todayLocal.getDate() < dayUTC) {
            //only happens when timezone is negative to UTC
            // console.log("calcOffsetsFromDate: ", 'UTC date is ahead so we want to look in the past');
            offset++;
          } else if (todayLocal.getDate() > dayUTC) {
            // console.log("calcOffsetsFromDate: ", 'UTC date is behind so we want to look in the future');
    
            //only happens when timezone is positive to UTC
            offset--;
          }
          // here is when we have two different months like the 28th and 1st
        } else if (Math.abs(todayLocal.getDate() - dayUTC) > 20) {
          if (todayLocal.getDate() > dayUTC) {
            //only happens when timezone is negative to UTC
            offset++;
          } else if (todayLocal.getDate() < dayUTC) {
            //only happens when timezone is positive to UTC
            offset--;
          }
        }
        // console.log("calcOffsetsFromDate: ", 'UTC date different and offset is now: ' + offset);
    
        if (this.targetLocalHr > this.targetUTCHour && timeZoneHrOffset > 0) {
          //although pacific timezone is -8, getTimezoneOffset() return positive
          offset--;
        }
    
        if (this.targetLocalHr < this.targetUTCHour && timeZoneHrOffset < 0) {
          //although pacific timezone is -8, getTimezoneOffset() return positive
          offset++;
        }
        response.offsets.dayoffsetadjusted = offset
        response.offsets.utchouroffset = this.targetUTCHour
        let targetEnd = calcUTCHourOffsetReturnDate(moment(new Date(datestring).valueOf()).startOf('day').toDate())
        let targetstart = new Date(targetEnd)
        response.startDate = new Date(targetstart.setDate(targetEnd.getDate()-1))
        response.endDate = targetEnd
        return response
      }
      static getPathGoServer(suffix){
        return 'https://sleepnet.appspot.com/api/' + suffix;
      }
      static oldGetRequestOptions(requestType, bearer) {
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + bearer);
        return {
          method: requestType,
          headers: headers,
          redirect: 'follow'
        };
      }

}