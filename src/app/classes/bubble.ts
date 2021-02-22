
export class Bubble {


  // id             integer generated always as identity primary key,
  // user1_id       integer not null references users(id),
  // user2_id       integer not null references users(id),
  // edge_status    integer not null


  public id: number;
  public user1_id: number;
  public user2_id: number;
  public edge_status: number;
  public email: string;
  public name: string;
  public depth: number;

  constructor(data: any = null) {
    if(data){
      this.id             = data.id;
      this.email         = data.email;
      this.user1_id      = data.user1_id;
      this.user2_id      = data.user2_id;
      this.edge_status   = data.edge_status;
      this.depth         = data.depth;
      this.name          = data.name ?? data.id;
    }
   }

   emailValid() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.email).toLowerCase());
  }


}
