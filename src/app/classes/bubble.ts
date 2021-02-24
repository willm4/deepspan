

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

   emailValid() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase());
  }


}
