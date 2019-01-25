import { map } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CostCentreModel } from 'src/models/main/cost-centre.model';
import { AlertService } from '../shared-service/alert.service';
import { CRUD } from '../base/crud.service';

@Injectable({
    providedIn: 'root'
})
export class CostCentreService extends CRUD {

    private _costCentreData: BehaviorSubject<CostCentreModel[]> = new BehaviorSubject([]);
    public readonly costCentreData: Observable<CostCentreModel[]> = this._costCentreData.asObservable();

    constructor(
        private _alertCtrl: AlertService,
        injector: Injector) {
            super(injector);
        }

    public getCostCentreList() {
        return this.read('main_cost_centre', 'filter=DEL_FLAG=0')
                .pipe(map(data => {
                    let costCentreData = new Array<CostCentreModel>();
                    costCentreData = data['resource'];

                    this._costCentreData.next(costCentreData);
                    return this.costCentreData;
                }));

    }

    public removeCostCentre(costcentreId: string) {

        // get the leave data
        this.read('main_cost_centre', 'filter=COST_CENTRE_GUID=' + costcentreId)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].DEL_FLAG = 1;

                return data;
            }))
            .subscribe(data => {
                const updateData = this.update('main_cost_centre', data['resource']);
                this._alertCtrl.showRemoveAlert(updateData).then((res) => {
                    this.getCostCentreList().subscribe();
                },
                err => {});
            });

    }

}
