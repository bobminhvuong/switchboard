import { Component, OnInit } from '@angular/core';
import { SwitchboardService } from 'src/app/service/switchboard/switchboard.service';

@Component({
  selector: 'app-switchboard',
  templateUrl: './switchboard.component.html',
  styleUrls: ['./switchboard.component.scss']
})
export class SwitchboardComponent implements OnInit {

  constructor(private switchboardSV: SwitchboardService) { }

  ngOnInit() {
    this.switchboardSV.signSocket();

    this.switchboardSV.connection().subscribe(r=>{
      console.log('connection',r);
      
    })
      this.switchboardSV.onResponse().subscribe(r=>{
        console.log('response',r);
      })
  }
}
