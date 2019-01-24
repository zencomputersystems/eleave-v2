import { map } from 'rxjs/operators';
import { APIService } from '../api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CostCentreModel } from 'src/models/main/cost-centre.model';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class CostCentreService {

    private _costCentreData: BehaviorSubject<CostCentreModel[]> = new BehaviorSubject([]);
    public readonly costCentreData: Observable<CostCentreModel[]> = this._costCentreData.asObservable();

    constructor(private _apiService: APIService, private _alertCtrl: AlertController) {}

    public getCostCentreList() {
        return this._apiService.getApiModel('main_cost_centre', 'filter=DEL_FLAG=0')
                .pipe(map(data => {
                    let costCentreData = new Array<CostCentreModel>();
                    costCentreData = data['resource'];

                    this._costCentreData.next(costCentreData);
                    return this.costCentreData;
                }));

    }

    public removeCostCentre(costcentreId: string) {

        // get the leave data
        this._apiService.getApiModel('main_cost_centre', 'filter=COST_CENTRE_GUID=' + costcentreId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].DEL_FLAG = 1;

                return data;
            }))
            .subscribe(data => {
                this.showAlert(data, costcentreId);
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

                    return this._apiService.update(JSON.stringify(data), 'main_cost_centre')
                    .subscribe((response) => {

                        if (response.status === 200) {
                           // reload the data from db
                           this.getCostCentreList().subscribe();
                        }
                    });
                }
              }
            ]
          });

          alert.present();
    }

}
