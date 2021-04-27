import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from  '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClientModule } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { EditbubblePageModule } from './components/popovers/editbubble/editbubble.module';
import { HiddenPageModule } from './popovers/hidden/hidden.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, EditbubblePageModule, HiddenPageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  , HTTP
  , HttpClient
  , NativeStorage
  , InAppBrowser
  , Geolocation
  , NativeGeocoder],
  bootstrap: [AppComponent],
})
export class AppModule {}
