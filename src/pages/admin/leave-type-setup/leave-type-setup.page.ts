import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from 'src/services/leave-type.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leave-type-setup',
  templateUrl: './leave-type-setup.page.html',
  styleUrls: ['./leave-type-setup.page.scss'],
  providers: [LeaveTypeService]
})
export class LeaveTypeSetupPage implements OnInit {

  leaves: any;
  subscription: Subscription;

  displayedColumns: string[] = ['LEAVE_ENTITLEMENT_CODE', 'Edit'];

  constructor(private _data: LeaveTypeService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.subscription = this._data.getLeaveTypeData()
                          .subscribe(data => {
                            this.leaves = data;
                        });
  }

  ionViewDidLeave() {
    this.subscription.unsubscribe();
  }

}
