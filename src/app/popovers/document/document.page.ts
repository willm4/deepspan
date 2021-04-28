import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as showdown from 'showdown';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentsService } from 'src/app/services/documents.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage implements OnInit {

  title: string = "";
  content: any = "";
  type: any;
  loading: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private docCtrl: DocumentsService, public sanitizer: DomSanitizer, private inappBrowser: InAppBrowser, public userCtrl: UserService) { 
   this.type = this.route.snapshot.paramMap.get('type');
    this.setView()
  }

  setView(){
    this.setTitle();
    this.getContent();
  }

  getContent(){
    this.docCtrl.getDocument(this.type).then((response:string)=>{
      this.setContent(response);
    }, err=>{
      this.loading = false;
    })
  }

  setContent(markdown: string){
    let html = this.parseMD(markdown)
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    let links = doc.querySelectorAll('a');
    let index = 0;
    links.forEach(l=>{
      let linkSrc = l.innerHTML;
      let foo = this.createElement(linkSrc, index)
      l.replaceWith(foo);
      index++
    })
    this.content =  this.sanitizer.bypassSecurityTrustHtml(doc.body.innerHTML);
    this.loading = false
    setTimeout(()=>{
      index = 0;
      links.forEach(l=>{
        document.getElementById('link' + index).onclick = ()=>{
          this.viewDoc(l.innerHTML)
        }
        index++;
      });
    }, 100);
  }

  parseMD(doc){
    let converter = new showdown.Converter();
    return  converter.makeHtml(doc);
  }

  validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }


  viewDoc(src){
    if(this.validURL(src)){
      this.inappBrowser.create(src, '_system')
    }
    this.inappBrowser.create(src, '_system')
  }

  createElement(linkSrc, index){
    let foo = document.createElement('a');
    foo.innerHTML = linkSrc;
    foo.setAttribute('id', 'link' + index);
    return foo
  }



  setTitle(){
    switch(this.type){
      case 'terms':
        this.title = "TERMS AND CONDITIONS";
        break;
      case 'about':
        this.title = "ABOUT";
        break;
      case 'eula':
        this.title = "LICENSE AGREEMENT"
        break;
      case 'privacy':
        this.title = "PRIVACY POLICY";
        break;
    }
    setTimeout(()=>{
      this.loading = false
    }, 5000)
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigateByUrl('/tabs/profile')
  }
  goToSNRWebsite(){
    this.inappBrowser.create("www.silvernovus.com", '_system')
  }




}
