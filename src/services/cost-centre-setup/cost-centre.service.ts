import { map } from 'rxjs/operators';
import { APIService } from '../shared-service/api.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CostCentreModel } from 'src/models/main/cost-centre.model';
import { AlertService } from '../shared-service/alert.service';

@Injectable({
    providedIn: 'root'
})
export class CostCentreService {

    private _costCentreData: BehaviorSubject<CostCentreModel[]> = new BehaviorSubject([]);
    public readonly costCentreData: Observable<CostCentreModel[]> = this._costCentreData.asObservable();

    constructor(private _apiService: APIService, private _alertCtrl: AlertService) {}

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
                const updateData = this._apiService.update(JSON.stringify(data), 'main_cost_centre');
                this._alertCtrl.showRemoveAlert(updateData).then((res) => {
                    this.getCostCentreList().subscribe();
                },
                err => {});
            });

    }

}
