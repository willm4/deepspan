import { User } from './user';


export class Bubble {


  // id             integer generated always as identity primary key,
  // user1_id       integer not null references users(id),
  // user2_id       integer not null references users(id),
  // edge_status    integer not null
  public  statuses = {
    MEMBER_INVITED: 0,
    MEMBER_DECLINED: 1,
    MEMBER_ACCEPTED: 2
  }

  public id: number;
  public user1id: number; // user that created it? 
  public user2id: number; // users it owns? 
  public edgestatus: number; // see statuses above
  public email: string;
  public name: string;
  public depth: number;
  public user: User;
  public img: string = "https://www.gravatar.com/avatar/f7256b954e2c23a1f9c5104f1f54fb17?d=mp&r=pg";

  constructor(data: any = null) {
    if(data){
      this.id             = data.id;
      this.email         = data.email;
      this.user1id      = data.user1id;
      this.user2id      = data.user2id;
      this.edgestatus   = data.edgestatus;
      this.depth         = data.depth;
      this.name          = data.name ?? data.id;
    }
   }

   canSave(userId: number){
     console.log(this.id)
     return this.name &&  this.name.length > 0 && this.user1id == userId && this.edgestatus == this.statuses.MEMBER_INVITED
   }

   setUser(userData: any){
     this.user = new User(userData);
     this.name = this.user.name;
     this.email = this.user.email;
   }


}
