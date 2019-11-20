import { MainService } from './../../service/main.service';
import { Component, OnInit } from '@angular/core';
import { SwitchboardService } from 'src/app/service/switchboard/switchboard.service';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-switchboard',
  templateUrl: './switchboard.component.html',
  styleUrls: ['./switchboard.component.scss']
})
export class SwitchboardComponent implements OnInit {

  // private listCall = [
  //   {
  //     extend: 304,
  //     state: 'Up',
  //     phone: '03999294511',
  //     callid: '12312312',
  //     type: 'outbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 0,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Ring',
  //     phone: '03999394511',
  //     callid: '12312312',
  //     type: 'inbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 43,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Hangup',
  //     phone: '03999944511',
  //     callid: '12312312',
  //     type: 'outbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 0,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Ringing',
  //     phone: '03999942511',
  //     callid: '12312312',
  //     type: 'inbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 123,
  //     money: 0,
  //     timeOut: new Date()

  //   }
  // ];
  // private listHasCall = [
  //   {
  //     extend: 304,
  //     state: 'Ringing',
  //     phone: '03999934511',
  //     callid: '12312312',
  //     type: 'outbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 232,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Ring',
  //     phone: '03999944511',
  //     callid: '12312312',
  //     type: 'inbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 0,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Ring',
  //     phone: '03999942511',
  //     callid: '12312312',
  //     type: 'outbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 12,
  //     money: 0,
  //     timeOut: new Date()
  //   },
  //   {
  //     extend: 304,
  //     state: 'Ring',
  //     phone: '03999294511',
  //     callid: '12312312',
  //     type: 'inbound',
  //     name: 'Vuownhg minh nguyễn',
  //     address: '610 hà huy giáp',
  //     customer_id: 0,
  //     money: 0,
  //     timeOut: new Date()
  //   }
  // ];

  public listCall = [];
  public listHasCall = [];

  public isVisible = false;

  public isOrderDetail = 0;
  public timeOut: any;
  public orderDetail = [];
  public listOrder = [];
  public currentCus = {};

  constructor(private switchboardSV: SwitchboardService, private message: NzMessageService, private mainSV: MainService) { }

  ngOnInit() {
    this.switchboardSV.signSocket();

    this.switchboardSV.connection().subscribe(r => {
      console.log('connection', r);
    })
    this.switchboardSV.onResponse().subscribe(r => {
      let index = this.listCall.findIndex(e => { return e.phone == r.phone });
      let indexHas = this.listHasCall.findIndex(e => { return e.phone == r.phone });
      if(r.state == 'Hangup') r.timeOut = new Date();

      if ( index < 0 ) {
        r.time = moment().format('HH:mm');
        r.customer_id = 0;
        r.name = 'Uknow';
        r.group_name = '';
        r.money = 0;
        this.listCall.unshift(r);
        this.listHasCall.unshift(r);
        this.getCustomer(r.phone);
      } else {
        this.listHasCall[indexHas].state = r.state;
        this.listCall[index].state = r.state;
      }
    });

    this.setTimeClose();
  }

  getCustomer(phone) {
    this.switchboardSV.getCustomer(phone).subscribe(cus => {
      console.log('cus',cus);
      if (cus.status == 1 && cus.data.id != 0) {        
        let index = this.listCall.findIndex(e => { return  e.phone == cus.data.phone });
        let indexHas = this.listCall.findIndex(e => { return e.phone == cus.data.phone });
        
        this.listCall[index].customer_id = cus.data.id;
        this.listCall[index].name = cus.data.name;
        this.listCall[index].group_name = cus.data.group_name;
        this.listCall[index].money = cus.data.money;

        this.listHasCall[indexHas].customer_id = cus.data.id;
        this.listHasCall[indexHas].name = cus.data.name;
        this.listHasCall[indexHas].group_name = cus.data.group_name;
        this.listHasCall[indexHas].money = cus.data.money;
       
      } 
    });
  }

  formatNumber(num) {
    if (!num) return 0;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  setTimeClose = function () {
    setTimeout(() => {
      var tmp = [];
      this.listCall.forEach(i => {
        this.timeOut = new Date();
        if (i.state == 'Hangup' && (this.timeOut - i.timeOut) >= 7000) {
          let index = this.listCall.findIndex(e => { return e.phone == i.phone; });
          this.listCall.splice(index, 1);
        }
      });
      this.setTimeClose();
    }, 2500);
  };

  getHistoryCart(cus) {
    this.currentCus = cus;
    this.switchboardSV.getHistoryOrderCustomer(cus.customer_id).subscribe(r => {
      if (r.status == 1) {
        this.listOrder = r.data;
        this.isVisible = true;
      } else {
        this.message.create('error', 'Đã có lổi xẩy ra. Vui lòng thử lại');
      }
    })
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  formatDate(date, type) {
    return moment(date).format(type);
  }

  getOrderDetail(id) {
    if (id == this.isOrderDetail) {
      this.isOrderDetail = 0;
    } else {
      this.switchboardSV.getDetailOrderCustomer(id).subscribe(r => {
        if (r.status == 1) {
          this.orderDetail = r.data;
          this.isOrderDetail = id;
        } else {
          this.message.create('error', 'Đã có lổi xẩy ra. Vui lòng thử lại');
        }
      })
    }
  }
}
