import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APIService } from '../shared-service/api.service';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';
import { BranchModel } from 'src/models/main/branch.model';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class BranchFormService {
    public form: FormGroup;
    branchData: BranchModel;

    constructor(
        private _fb: FormBuilder,
        private _apiService: APIService) {

        this.form = this._fb.group({
            branchName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveBranch() {
        const branchData = new BranchModel();

        branchData.BRANCH_GUID = UUID.UUID();
        branchData.ACTIVE_FLAG = 1;
        branchData.CREATION_TS = new Date().toISOString();
        branchData.CREATION_USER_GUID = '';
        branchData.TENANT_GUID = '';
        branchData.NAME = this.form.value.branchName;

        const saveData = JSON.stringify({resource: [branchData]});

        return this._apiService.save(saveData, 'main_branch');
    }

    //#endregion

    //#region EDIT METHOD
    public loadDataForEdit(id: string) {
        this.getBranchData(id)
            .subscribe(data => {
                this.form.patchValue({
                    branchName: data.NAME
                });
            });
    }

    public getBranchData(id: string) {
        return this._apiService.getApiModel('main_branch', 'filter=BRANCH_GUID=' + id)
            .pipe(
                map(data => {
                    this.branchData = data['resource'][0];

                    return this.branchData;
                })
            );
    }

    public updateBranch() {

        this.branchData.NAME = this.form.value.branchName;
        this.branchData.UPDATE_TS = new Date().toISOString();

        return this._apiService.update(JSON.stringify({ resource: [this.branchData] }), 'main_branch');
    }
    //#endregion
}
