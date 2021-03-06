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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''

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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''
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
  //     timeOut: new Date(),
  //     call_status:''
  //   }
  // ];

  public listCall = [];
  public listHasCall = [];

  public isVisible = false;
  public isVisibleNote = false;

  public isOrderDetail = 0;
  public timeOut: any;
  public orderDetail = [];
  public listOrder = [];
  public currentCus = {};
  public call: any;
  public note = '';

  constructor(private switchboardSV: SwitchboardService, 
    private message: NzMessageService, 
    private mainSV: MainService) { }

  ngOnInit() {
    this.switchboardSV.signSocket();

    this.switchboardSV.connection().subscribe(r => {
      console.log('connection', r);
    })
    this.switchboardSV.onResponse().subscribe(r => {
      let index = this.listCall.findIndex(e => { return e.callid == r.callid });
      let indexHas = this.listHasCall.findIndex(e => { return e.callid == r.callid });
      r.timeOut = new Date();

      if(r.phone.length >= 8){
        if(r.type =='inbound' ){
          if ( index < 0 ) {
            r.time = moment().format('HH:mm');
            r.customer_id = 0;
            r.name = 'Uknown';
            r.group_name = '';
            r.money = 0;
            r.call_state = '';
            if(r.state == 'Hangup') r.timeOut = new Date();
            this.listCall.unshift(r);
            this.listHasCall.unshift(r);
            this.getCustomer(r.phone);
          } else {
            this.listCall[index].state = r.state;
            this.listHasCall[indexHas].state = r.state;
          }
        }else{
          
          if(r.state == 'Hangup' && index >=0){
            this.listHasCall[indexHas].call_state = (this.listHasCall[indexHas].state =='Ringing' || this.listHasCall[indexHas].state =='Ring') ? 'Missed' : 'Answered';
            this.listCall[index].timeOut = new Date();
            this.listHasCall[indexHas].timeOut = new Date();
            this.listCall[index].state = r.state;
            this.listHasCall[indexHas].state = r.state;
          }
        }
      }
    });

    this.setTimeClose();
  }

  onpenModalNote(call){
    this.isVisibleNote = true;
    this.call = call;
  }
  
  saveNote(){
    if(this.call.note && this.call.note != ''){
      this.switchboardSV.createNote(this.call.note).subscribe(r=>{
        if(r && r.status ==1){
          this.message.create('success', 'Tạo ghi chú thành công!');
        }else{
          this.message.create('error', r.message);
        }
      })
      this.isVisibleNote = false;
    }else{
      this.message.create('error', 'Bạn chưa nhập ghi chú!');
    }
  }

  getCustomer(phone) {
    this.switchboardSV.getCustomer(phone).subscribe(cus => {
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
      this.listCall.forEach(i => {
        this.timeOut = new Date();
        if ((i.state == 'Hangup' || i.state =='') && (this.timeOut - i.timeOut) >= 5000) {
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
    this.isVisibleNote = false;
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
