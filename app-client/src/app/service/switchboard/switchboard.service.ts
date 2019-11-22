import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MainService } from './../main.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SwitchboardService {
  private url = '222.255.115.84:8000';
  private key = '90a0ba95ec0c5d33fbdd342aec08bdce979ab724';
  private socket;

  constructor(private http: HttpClient, private mainSV: MainService) {
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

  getCustomer(phone): Observable<any> {
    let curUser = this.mainSV.getCurrentUser();
    let data = {
      phone: phone,
      api: curUser.api
    }
    return this.http.post(environment.APIHOST + '/api/voip/getcustomer', data, this.mainSV.getHttpOptionsNotToken())
      .pipe(
        catchError(this.mainSV.handleError)
      );
  }

  getHistoryOrderCustomer(customer_id): Observable<any> {
    let curUser = this.mainSV.getCurrentUser();
    let data = {
      customer_id: customer_id,
      api: curUser.api
    }
    return this.http.post(environment.APIHOST + '/api/voip/gethistory', data, this.mainSV.getHttpOptionsNotToken())
      .pipe(
        catchError(this.mainSV.handleError)
      );
  }

  getDetailOrderCustomer(order_id): Observable<any> {
    let curUser = this.mainSV.getCurrentUser();
    let data = {
      order_id: order_id,
      api: curUser.api
    }
    return this.http.post(environment.APIHOST + '/api/voip/getOrderDetail', data, this.mainSV.getHttpOptionsNotToken())
      .pipe(
        catchError(this.mainSV.handleError)
      );
  }

  
  createNote(data): Observable<any>{
    let curUser = this.mainSV.getCurrentUser();
    let req = data;
    req.api = curUser.api;
    return this.http.post(environment.APIHOST + '/api/voip/creatednote', data, this.mainSV.getHttpOptionsNotToken())
      .pipe(
        catchError(this.mainSV.handleError)
      );
  }
}
