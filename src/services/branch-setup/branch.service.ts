import { map } from 'rxjs/operators';
import { APIService } from '../api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { BranchModel } from 'src/models/main/branch.model';

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    private _branchData: BehaviorSubject<BranchModel[]> = new BehaviorSubject([]);
    public readonly branchData: Observable<BranchModel[]> = this._branchData.asObservable();

    constructor(private _apiService: APIService, private _alertCtrl: AlertController) {}

    public getBranchList() {
        return this._apiService.getApiModel('main_branch', 'filter=ACTIVE_FLAG=1')
                .pipe(map(data => {
                    let branchData = new Array<BranchModel>();
                    branchData = data['resource'];

                    this._branchData.next(branchData);
                    return this.branchData;
                }));

    }

    public removeBranch(branchId: string) {

        // get the leave data
        this._apiService.getApiModel('main_branch', 'filter=BRANCH_GUID=' + branchId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                this.showAlert(data, branchId);
            });

    }

    private async showAlert(data: any, id: string) {
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

                    return this._apiService.update(JSON.stringify(data), 'main_branch')
                    .subscribe((response) => {

                        if (response.status === 200) {
                           // reload the data from db
                           this.getBranchList().subscribe();
                        }
                    });
                }
              }
            ]
          });

          alert.present();
    }
}
