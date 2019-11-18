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
    usershop: '',
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
        let user = {
          api: r.data.api,
          name: r.data.TenNhanVien,
          avatar: r.data.ImageUrl,
          department: r.data.IDBoPhan,
          id: r.data.ID,
          expTime: r.data.expTime
        };

        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/manager']);
      } else {
        this.message.create('error', r.message);
      }
    });
  }
}
