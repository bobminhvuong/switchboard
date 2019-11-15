import { LoginService } from './../service/auth/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public user = {
    usershop: 'iostest',
    user: '',
    password: ''
  };
  constructor(private router: Router, private loginSV: LoginService, private message: NzMessageService) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/manager']);
    }
  }

  login() {
    this.loginSV.login(this.user).subscribe(r => {
      if (r && r.status == 1) {
        localStorage.setItem('user', r.data);
        this.router.navigate(['/manager']);
      } else {
        this.message.create('error', r.message);
      }
    });
  }
}
