import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Injectable, Injector } from '@angular/core';
import { CostCentreModel } from 'src/models/main/cost-centre.model';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';
import { CRUD } from '../base/crud.service';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class CostCentreFormService  extends CRUD {

    public form: FormGroup;
    costCentreDetail: CostCentreModel;

    constructor(
        private _fb: FormBuilder,
        injector: Injector) {

        super(injector);

        this.form = this._fb.group({
            costName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveCostCentre() {
        const costCentreData = new CostCentreModel();

        costCentreData.COST_CENTRE_GUID = UUID.UUID();
        costCentreData.DEL_FLAG = 0;
        costCentreData.NAME = this.form.value.costName;

        return this.create('main_cost_centre', costCentreData);
    }

    //#endregion

    //#region EDIT METHOD
    public loadDataForEdit(id: string) {
        this.editMode.subscribe(editMode => {
            if (editMode) {
                this.getCostCentreData(id)
                    .subscribe(data => {
                        this.form.patchValue({
                            costName: data.NAME
                        });
                    });
            }
        });
    }

    public getCostCentreData(id: string) {
        return this.read('main_cost_centre', 'filter=COST_CENTRE_GUID=' + id)
            .pipe(
                map(data => {
                    this.costCentreDetail = data['resource'][0];

                    return this.costCentreDetail;
                })
            );
    }

    public updateCostCentre() {

        this.costCentreDetail.NAME = this.form.value.costName;

        return this.update('main_cost_centre', this.costCentreDetail);
    }
    //#endregion

}
