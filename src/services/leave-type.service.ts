import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { map} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LeaveTypeModel } from 'src/models/leavetype.model';
import { ViewLeaveTypeSetupModel } from 'src/models/view-leavetype-setup.model';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

    private _leaveData: BehaviorSubject<LeaveTypeModel[]> = new BehaviorSubject([]);
    public readonly leaveData: Observable<LeaveTypeModel[]> = this._leaveData.asObservable();

    constructor(
        private _apiService: APIService,
        private _alertCtrl: AlertController) {}

    // load the master leave type list from db
    public getLeaveTypeData() {

        return this._apiService.getApiModel('view_leave_type_setup', 'filter=ACTIVE_FLAG=1')
            .pipe(
                map(data => {
                    const res: Array<ViewLeaveTypeSetupModel> = data['resource'];

                    const leaveid_tracker = new Array<LeaveTypeModel>();

                    // construct the leave array
                    // group into leave type
                    for (let i = 0; i < res.length; i++) {
                        if (!leaveid_tracker.some(x => x.leave_id === res[i].LEAVE_TYPE_GUID)) {
                            leaveid_tracker.push({
                                'leave_id': res[i].LEAVE_TYPE_GUID,
                                'leave_type': res[i].LEAVE_TYPE_CODE,
                                'leave_entitlement': res.filter(x => x.LEAVE_TYPE_GUID === res[i].LEAVE_TYPE_GUID)
                            });
                        }
                    }
                    this._leaveData.next(leaveid_tracker);
                    return this.leaveData;
                })
            );
    }

    public removeLeaveType(leaveid: string, entitlementid: string) {

        // get the leave data
        this._apiService.getApiModel('l_leavetype_entitlement_def', 'filter=ENTITLEMENT_GUID=' + entitlementid)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                this.showAlert(data, leaveid, entitlementid);
            });

    }

    private async showAlert(data: any, leaveid: string, entitlementid: string) {

        const alert = await this._alertCtrl.create({
            header: 'Remove Confirmation!',
            message: 'Are you sure to remove?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                }
              }, {
                text: 'OK',
                handler: () => {
                    this._apiService.update(data, 'l_leavetype_entitlement_def')
                    .subscribe((response) => {

                        if (response.status === 200) {
                           // reload the data from db
                           this.getLeaveTypeData().subscribe();
                        }
                    });
                }
              }
            ]
          });

          alert.present();
    }

}
