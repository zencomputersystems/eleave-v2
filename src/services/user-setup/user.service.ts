import { Injector, Injectable } from '@angular/core';
import { CRUD } from '../base/crud.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfoModel } from 'src/models/main/userinfo.model';

@Injectable({
    providedIn: 'root'
})
export class UserService extends CRUD {

    private _userData: BehaviorSubject<UserInfoModel[]> = new BehaviorSubject([]);
    public readonly userData: Observable<UserInfoModel[]> = this._userData.asObservable();

    constructor(
        injector: Injector) {
            super(injector);
        }

    public getUserList() {
        return this.read('main_user_info_xml', 'filter=ACTIVE_FLAG=0')
                .pipe(map(data => {
                    let userData = new Array<UserInfoModel>();
                    userData = data['resource'];

                    this._userData.next(userData);
                    return this._userData;
                }));

    }

    public removeUser(userId: string) {

        // get the leave data
        this.read('main_user_info_xml', 'filter=USER_GUID=' + userId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = false;

                return data;
            }))
            .subscribe(data => {
                this.delete(data['resource'], 'main_user_info_xml', this.getUserList());
            });

    }

}
