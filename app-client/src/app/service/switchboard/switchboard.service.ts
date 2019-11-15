import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SwitchboardService {
  // private url = 'http://222.255.115.84:8000';
  private url = '222.255.115.84:8000';
  private key = '90a0ba95ec0c5d33fbdd342aec08bdce979ab724';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  public signSocket() {
    this.socket.emit('sign', this.key);
  }

  public connection() {
    return Observable.create(observer => {
      this.socket.on('connect-response', data => {
        observer.next(data);
      });
    });
  }

  public onResponse() {
    return Observable.create(observer => {
      this.socket.on('response', data => {
        observer.next(data);
      });
    });
  }
}
