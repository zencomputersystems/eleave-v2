import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Injectable, Injector } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';
import { BranchModel } from 'src/models/main/branch.model';
import { CRUD } from '../base/crud.service';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class BranchFormService extends CRUD {
    public form: FormGroup;
    branchData: BranchModel;

    constructor(
        private _fb: FormBuilder,
        injector: Injector) {

        super(injector);

        this.form = this._fb.group({
            branchName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveBranch() {
        const branchData = new BranchModel();

        branchData.BRANCH_GUID = UUID.UUID();
        branchData.ACTIVE_FLAG = 1;
        branchData.NAME = this.form.value.branchName;

        return this.create('main_branch', branchData);
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
        return this.read('main_branch', 'filter=BRANCH_GUID=' + id)
            .pipe(
                map(data => {
                    this.branchData = data['resource'][0];

                    return this.branchData;
                })
            );
    }

    public updateBranch() {

        this.branchData.NAME = this.form.value.branchName;

        return this.update('main_branch', this.branchData);
    }
    //#endregion
}
