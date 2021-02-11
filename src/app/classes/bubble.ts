
export class Bubble {

  public name: string = '';
  public bubbles: Array<Bubble>  = new Array<Bubble>();
  public value: number = null;
  public delete: boolean = false;
  public added: boolean = false;

  constructor(name: string, value: number = null) {
    this.name     = name;
    this.value    = value;
   }

   public remove(name:string){
     this.bubbles = this.bubbles.filter(b=>{b.name !== name });
   }

   public add(name:string){
     this.bubbles.push(new Bubble(name));
   }

   addFromData(bubblesData: any){
     if(bubblesData.children){
       bubblesData.children.forEach(bubbleData => {
        let val = bubbleData.value ? bubbleData.value: null;
        this.bubbles.push(new Bubble(bubbleData.name, val));
         this.bubbles[this.bubbles.length -1].addFromData(bubbleData);
       });
     }
   }

   public getChartData(){
     let result = {
       name: this.name,
       children:[]
     };
     if(this.value && this.bubbles.length == 0){
       result['value'] = this.value;
     }

     this.bubbles.forEach(b=>{
       result.children.push(b.getChartData());
     });

     return result;
   }

   updateBubbles(){
     for(var i = 0; i < this.bubbles.length; i++){
       if(this.bubbles[i].delete){
         this.bubbles.splice(i,1);
       }
       else{
         this.bubbles[i].updateBubbles();
       }
     }
   }

   removeAdded(){
    for(var i = 0; i < this.bubbles.length; i++){
      if(this.bubbles[i].added){
        this.bubbles.splice(i,1);
      }
      else{
        this.bubbles[i].removeAdded();
      }
    }
   }

   resetDeleted(){
     this.delete = false;
     this.bubbles.forEach(b=>{
       b.resetDeleted();
     })
   }


}
