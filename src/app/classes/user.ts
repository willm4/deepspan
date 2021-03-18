  // { 
  //   "id": <int32>, 
  //   "uuid": <string>, 
  //   "email": <string>, 
  //   "role": { "Int32": <int32>, "Valid": <bool> }, 
  //   "createdat": <time>, 
  //   "name": <string>, 
  //   "password": <always null string>, 
  //   "resetuuid": { "String": <string>, "Valid": <bool> }, 
  //   "resetexpiration": { "Time": <time>, "Valid": <bool> }, 
  //   "lasttouch": { "Time": <time>, "Valid": <bool> },
  //     “lat”:			{ "Float64": <float64>, "Valid": <bool> },
  //     “lon”			{ "Float64": <float64>, "Valid": <bool> },
  //     “admin2”: 		{ "String": <string>, "Valid": <bool> },
  //     “provincestate”:	{ "String": <string>, "Valid": <bool> ,
  //     “countryregion”:	{ "String": <string>, "Valid": <bool> },
  //   “user_status”:        	<int32>,
  //     	“creator_estimate”:   	{ "Int32": <int32>, "Valid": <bool>}
    
  //   }

export class User {

  userType: number;
  id: number;
  email: string;
  uuid: string;
  role: any;
  createdat: Date;
  name: string;
  password: string;
  resetpassword: string;
  resetuuid: any;
  resetexpiration: any;
  lasttouch: any;
  membercount: any;
  creatorid: any;
  lat: any;
  lon: any;
  admin2: any;
  locationName: string = '';
  provincestate:any;
  countryregion: any;
  userstatus: any;
  creatorestimate: any;
  userStatusName: any = {
    value: 0,
    name: "UNKNOWN"
  };
  ownerid: any;
  avatarTxt: string = "?";
  avatarLabel: string = "";
  img: string =  "https://ui-avatars.com/api/?name=?";
  avatarBackground: string = "97C2FC"

  constructor(data: any = null) { 
    if(data){
      this.id = data.id;
      this.ownerid = data.ownerid;
      this.creatorid = data.creatorid;
      this.email = data.email;
      this.uuid = data.uuid;
      this.role = data.role;
      this.createdat = new Date(data.createdat);
      this.name = data.name;
      this.password = data.password;
      this.resetuuid = data.resetuuid;
      this.resetexpiration = data.resetexpiration;
      this.lasttouch = data.lasttouch;
      this.membercount = data.membercount;
      this.lat = data.lat;
      this.lon = data.lon;
      this.admin2 = data.admin2;
      this.provincestate = data.provincestate;
      this.countryregion = data.countryregion;
      this.userstatus = data.userstatus;
      this.creatorestimate = data.creatorestimate;
      this.img = data.img;
      this.avatarLabel = this.name && this.name.length > 0
      ? this.name.replace(/ .*/,'')
      : '';
      this.avatarTxt = this.name && this.name.length > 0
      ? this.name.length >= 2
        ? this.name.split(' ').slice(0,2).join('+')
        : this.avatarLabel
      : '?'

      //current user
      if (this.id == this.ownerid) {
        this.userType = 2 
        this.avatarBackground = "00FF00";
      //unvalidated
      } else if (this.role.Int32 == -2) {
          this.userType = 0
          this.avatarBackground = "D9D9D9"
      }
      // validated
      else{
        this.userType == 1
        this.avatarBackground = "97C2FC"
      }
      this.img = "https://ui-avatars.com/api/?name=" + this.avatarTxt + "&background=" + this.avatarBackground;
    }
  }




}
