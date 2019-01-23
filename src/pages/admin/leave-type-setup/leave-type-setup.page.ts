import { Component, OnInit } from '@angular/core';
import { LeaveTypeService } from 'src/services/leave-type.service';

@Component({
  selector: 'app-leave-type-setup',
  templateUrl: './leave-type-setup.page.html',
  styleUrls: ['./leave-type-setup.page.scss'],
  providers: [LeaveTypeService]
})
export class LeaveTypeSetupPage implements OnInit {

  leaves: any;

  displayedColumns: string[] = ['LEAVE_ENTITLEMENT_CODE', 'Edit'];

  constructor(
    private _data: LeaveTypeService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this._data.getLeaveTypeData()
          .subscribe(() => {
            this.leaves = this._data.leaveData;
        });
  }


  onDeleteLeave(leaveid: string, entitlementid: string) {
    this._data.removeLeaveType(leaveid, entitlementid);
  }

}
