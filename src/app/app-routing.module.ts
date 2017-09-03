import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentComponent } from './document/document.component';

const routes: Routes = [
  { path: '', redirectTo: '/collections/my_collection/my_document', pathMatch: 'full' },
  { path: 'collections/:collectionName/:documentId', component: DocumentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
