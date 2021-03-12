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
  img: string =  "https://www.gravatar.com/avatar/f7256b954e2c23a1f9c5104f1f54fb17?d=mp&r=pg";

  constructor(data: any = null) { 
    if(data){
      this.id = data.id;
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
    }
  }


}
