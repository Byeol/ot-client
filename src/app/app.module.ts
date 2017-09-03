import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MdCardModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { CodeMirrorDirective } from './code-mirror/code-mirror.directive';
import { ShareDBService } from './shared/share-db.service';
import { DocumentComponent } from './document/document.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    CodeMirrorDirective,
    DocumentComponent
  ],
  imports: [
    BrowserModule,
    MdCardModule,
    AppRoutingModule
  ],
  providers: [
    ShareDBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
