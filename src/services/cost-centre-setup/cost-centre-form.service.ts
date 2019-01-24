import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APIService } from '../shared-service/api.service';
import { Injectable } from '@angular/core';
import { CostCentreModel } from 'src/models/main/cost-centre.model';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class CostCentreFormService {

    public form: FormGroup;
    costCentreDetail: CostCentreModel;

    constructor(
        private _fb: FormBuilder,
        private _apiService: APIService) {

        this.form = this._fb.group({
            costName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveCostCentre() {
        const costCentreData = new CostCentreModel();

        costCentreData.COST_CENTRE_GUID = UUID.UUID();
        costCentreData.CREATION_USER_GUID = '';
        costCentreData.DEL_FLAG = 0;
        costCentreData.TENANT_GUID = '';
        costCentreData.NAME = this.form.value.costName;
        costCentreData.CREATION_TS = new Date().toISOString();

        const saveData = JSON.stringify({resource: [costCentreData]});

        return this._apiService.save(saveData, 'main_cost_centre');
    }

    //#endregion

    //#region EDIT METHOD
    public loadDataForEdit(id: string) {
        this.getCostCentreData(id)
            .subscribe(data => {
                this.form.patchValue({
                    costName: data.NAME
                });
            });
    }

    public getCostCentreData(id: string) {
        return this._apiService.getApiModel('main_cost_centre', 'filter=COST_CENTRE_GUID=' + id)
            .pipe(
                map(data => {
                    this.costCentreDetail = data['resource'][0];

                    return this.costCentreDetail;
                })
            );
    }

    public updateCostCentre() {

        this.costCentreDetail.NAME = this.form.value.costName;
        this.costCentreDetail.UPDATE_TS = new Date().toISOString();

        return this._apiService.update(JSON.stringify({ resource: [this.costCentreDetail] }), 'main_cost_centre');
    }
    //#endregion

}
