import { Component, Input, AfterViewInit, OnInit, OnChanges, ViewChild } from '@angular/core';

import * as ShareDB from 'sharedb/lib/client';

import { CodeMirrorDirective } from '../code-mirror/code-mirror.directive';
import { SubtypeOperation } from '../shared/subtype-operation';
import { ShareDBService } from '../shared/share-db.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit {
  @Input() collectionName: string;
  @Input() documentId: string;
  @ViewChild(CodeMirrorDirective) codeMirror: CodeMirrorDirective;
  private _document: ShareDB.Doc;
  private isDocReady: boolean;

  constructor(private shareDB: ShareDBService) { }

  ngOnInit(): void {
    if (!this.collectionName || !this.documentId) {
      return;
    }

    this.document = this.shareDB.getDocument(this.collectionName, this.documentId);
    console.log('document:', this.document);
  }

  ngAfterViewInit(): void {
    this.editor.on('changes', this.handleChanges.bind(this));
  }

  get editor(): CodeMirror.EditorFromTextArea {
    return this.codeMirror.editor;
  }

  get document(): ShareDB.Doc {
    return this._document;
  }

  set document(val: ShareDB.Doc) {
    if (this._document) {
      this._document.destroy();
    }

    this._document = val;
    this._document.subscribe(this.documentHandler.bind(this));
  }

  private documentHandler(err) {
    if (err) {
      console.error(err);
      return;
    }

    this.handleDocument();
  }

  private handleDocument(): void {
    console.log('handleDocument() called!');

    if (!this.document.data) {
      this.document.create(this.editor.getValue());
    } else {
      this.editor.setValue(this.document.data);
    }

    this.document.on('op', this.handleOperation.bind(this));
    this.isDocReady = true;
  }

  private handleOperation(op: any[], source: boolean): void {
    console.log('handleOperation() called!', op, source);

    if (source) {
      return;
    }

    op.forEach(operation => operation.o.forEach(o => {
      if (!o.hasOwnProperty('p')) {
        throw new Error('Unknown type!');
      }

      const from = this.editor.getDoc().posFromIndex(o.p);
      let to, replacement;

      if (o.hasOwnProperty('d')) {
        replacement = '';
        to = this.editor.getDoc().posFromIndex(o.p + o.d.length);
      } else if (o.hasOwnProperty('i')) {
        replacement = o.i;
        to = this.editor.getDoc().posFromIndex(o.p);
      } else {
        throw new Error('Unknown type!');
      }

      this.editor.getDoc().replaceRange(replacement, from, to, 'remote');
    }));
  }

  private handleChanges(instance: CodeMirror.Editor, changes: CodeMirror.EditorChangeLinkedList[]): void {
    console.log('handleChanges() called!', changes);

    if (!this.isDocReady) {
      return;
    }

    const op: SubtypeOperation = {
      p: [],
      t: 'text0',
      o: []
    };

    changes.filter(change => change.origin !== 'remote').reverse().forEach(change => {
      const startPos = Array.from(Array(change.from.line).keys())
        .map(i => this.editor.lineInfo(i).text.length + 1)
        .reduce((prev, cur) => prev + cur, change.from.ch);

      if (change.to.line !== change.from.line || change.to.ch !== change.from.ch) {
        op.o.push({
          p: startPos,
          d: change.removed.reduce((prev, cur) => `${prev}\n${cur}`)
        });
      }

      if (change.text) {
        op.o.push({
          p: startPos,
          i: change.text.join('\n')
        });
      }
    });

    if (op.o.length > 0) {
      this.document.submitOp(op);
    }
  }
}
