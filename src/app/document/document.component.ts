import { Observable } from 'rxjs/Observable';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/map';

export interface DocumentInfo {
  collectionName: string;
  documentId: string;
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html'
})
export class DocumentComponent implements OnInit {
  documentInfo: Observable<DocumentInfo>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.documentInfo = this.route.paramMap.map((params: ParamMap) => ({
      collectionName: params.get('collectionName'),
      documentId: params.get('documentId')
    }));
  }
}
