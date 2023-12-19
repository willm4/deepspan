export class SummaryTable {
    constructor(_title, _rows){
        this.title = _title;
        if(_rows && _rows.length > 0){
            this.rows = _rows.map(x=>{
                return {
                    key: x,
                    value: null
                }
            });
        }
        else{
            this.rows = [];
        }
    }
}

