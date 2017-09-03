import { Injectable } from '@angular/core';

import * as ShareDB from 'sharedb/lib/client';

import { environment } from '../../environments/environment';

@Injectable()
export class ShareDBService {
  private socket: WebSocket;
  private connection: ShareDB.Connection;

  constructor() {
    this.socket = new WebSocket(environment.serverUrl);
    this.connection = new ShareDB.Connection(this.socket);
  }

  getDocument(collectionName: string, documentId: string): ShareDB.Doc {
    return this.connection.get(collectionName, documentId);
  }
}
