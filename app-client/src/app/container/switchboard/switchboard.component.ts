import { Component, OnInit } from '@angular/core';
import { SwitchboardService } from 'src/app/service/switchboard/switchboard.service';

@Component({
  selector: 'app-switchboard',
  templateUrl: './switchboard.component.html',
  styleUrls: ['./switchboard.component.scss']
})
export class SwitchboardComponent implements OnInit {

  private listCall = [];
  private listHasCall = [];
  constructor(private switchboardSV: SwitchboardService) { }

  ngOnInit() {
    this.switchboardSV.signSocket();

    this.switchboardSV.connection().subscribe(r => {
      console.log('connection', r);

    })
    this.switchboardSV.onResponse().subscribe(r => {
      console.log('response', r);

      let index = this.listCall.findIndex(e => { return e.id == r.id });
      let indexHas = this.listCall.findIndex(e => { return e.id == r.id });

      if (r.state == 'Ring' || index < 0) {
        this.switchboardSV.getCustomer(r.phone).subscribe(cus => {
          if (cus.status == 1) {
            r.customer_id = cus.id;
            r.name = cus.name;
            r.group_name = cus.group_name;
            r.money = cus.money;
            this.listCall.unshift(r);
            this.listHasCall.unshift(r);
          }else{
            r.customer_id = 0;
            r.name = '';
            r.group_name = '';
            r.money = 0;
            this.listCall.unshift(r);
            this.listHasCall.unshift(r);
          }
        })
      }else{
        this.listHasCall[indexHas].state =r.state;
        this.listHasCall[indexHas].type =r.type;
        this.listCall[index].state =r.state;
        this.listCall[indexHas].type =r.type;
      }
    })
  }
}
