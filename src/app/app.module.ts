import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { RendererComponentComponent } from './rendererComponent/renderer-component/renderer-component.component';


@NgModule({
  declarations: [
    AppComponent,
    RendererComponentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
