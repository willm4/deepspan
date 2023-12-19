import { SummaryTable } from "../Models/SummaryTable";

export default class Stats {
    static getSummaryTable(){
        return new SummaryTable('Customer Activity',['Customers Syncing Sleep', 'New Customer Signups', '# Likes', '# Comments', 'Trials - Starts', 'Trials - Running Today', 'Solutions Recommended', 'Solution Views']);
    }
    static getPerformanceTable(){
        return new SummaryTable('System Performance',['Number of Syncs', 'Average Sync Time', '# of Global Errors Thrown', '# of Emails Generated', 'Server Ping Time']);
    }

    // static addCustomerActivity(summaryTable,charts ){
    //     let appOpened = summaryTable;
    //     let numSyncs = charts;
    //     charts.forEach(chart=>{
    //         console.log(chart);
    //         let key: any;
    //         switch(chart.activityType){
    //             case 'newsignups':
    //                 key = 'New Customer Signups';
    //                 break;
    //             case 'usersynced':
    //                 key = 'Customers Syncing Sleep'
    //                 break;
    //             case 'countAppOpened':
    //                 key = 'Customers Syncing Sleep'
    //                 break;

    //         }
    //     })

    // }
}