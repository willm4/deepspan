import { Injectable } from '@angular/core';


export class Action {

  id: number; //action id
  userid: number; //owner of action
  userref: any; // {Int32: num, Valid: bool } -> user referred to by action
  bubbleref: any // {Int32: num, Valid: bool } -> user referred to by action
  actiontype: number // type of action
  createdat: Date; // created date
  dateLabel: string;
  refname: string; // name of user referred
  refemail: string;
  username: string; // user referring action
  text: string // user text from template
  img: string = "https://ui-avatars.com/api/?name=?";

  constructor(data: any) {
    this.id = data.id;
    this.userid = data.userid;
    this.userref = data.userref;
    this.bubbleref = data.bubbleref;
    this.refemail = data.refemail;
    this.actiontype = data.actiontype;
    this.createdat = new Date(data.createdat);
    this.dateLabel = this.createdat.toDateString();
    this.text = data.text;
    this.refname = data.refname;
    this.username = data.username;
   }



   setImg(img: string){
     this.img = img
   }
}
