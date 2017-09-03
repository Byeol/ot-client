import { Directive, Input, ElementRef, AfterViewInit, ViewChild, Output } from '@angular/core';

import { fromTextArea } from 'codemirror';

@Directive({
  selector: '[appCodeMirror]'
})
export class CodeMirrorDirective implements AfterViewInit {
  @Input() options: CodeMirror.EditorConfiguration;
  private _editor: CodeMirror.EditorFromTextArea;

  constructor(private _el: ElementRef) {}

  get host(): HTMLTextAreaElement {
    return this._el.nativeElement;
  }

  get editor(): CodeMirror.EditorFromTextArea {
    return this._editor;
  }

  ngAfterViewInit() {
    this._editor = fromTextArea(this.host, this.options);
  }
}
