import { LoginService } from './../service/auth/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message'
import { FormBuilder, FormGroup,Validators  } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  
  constructor(private fb: FormBuilder,private router: Router, private loginSV: LoginService, private message: NzMessageService) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/manager']);
    }

    this.validateForm = this.fb.group({
      usershop: [null, [Validators.required]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

  }

  login(data) {
    this.loginSV.login(data).subscribe(r => {
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

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(this.validateForm.valid){
      this.login(this.validateForm.value);
    }
  }
}
