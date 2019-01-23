import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { map} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeService {

    private _formData: BehaviorSubject<any> = new BehaviorSubject([]);
    public readonly formData: Observable<any> = this._formData.asObservable();

    constructor(private _apiService: APIService) {}

    // load the master leave type list from db
    public getLeaveTypeData() {
        return this._apiService.getApiModel('view_leave_type_setup', 'filter=ACTIVE_FLAG=1')
            .pipe(
                map(data => {

                    const leaveid_tracker = [];
                    const res: Array<any> = data['resource'];

                    // construct the leave array
                    for (let i = 0; i < res.length; i++) {
                        if (!leaveid_tracker.some(x => x.leave_id === res[i].LEAVE_TYPE_GUID)) {
                            leaveid_tracker.push({
                                'leave_id': res[i].LEAVE_TYPE_GUID,
                                'leave_type': res[i].LEAVE_TYPE_CODE,
                                'leave_entitlement': res.filter(x => x.LEAVE_TYPE_GUID === res[i].LEAVE_TYPE_GUID)
                            });
                        }
                    }

                    return leaveid_tracker;
                })
            );
    }
}
