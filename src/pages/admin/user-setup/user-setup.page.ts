import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user-setup/user.service';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.page.html',
  styleUrls: ['./user-setup.page.scss'],
  providers: [UserService]
})
export class UserSetupPage implements OnInit {

  userList: any;
  displayedColumns: string[] = ['USER_NAME', 'Option'];

  constructor(private _userDataService: UserService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this._userDataService.getUserList()
    .subscribe(() => {
      this.userList = this._userDataService.userData;
    });
  }

  onDeleteUser(id: string) {
    this._userDataService.removeUser(id);
  }

}
