import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { APIService } from '../shared-service/api.service';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';
import { SectionModel } from 'src/models/main/section.model';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class SectionFormService {
    public form: FormGroup;
    sectionData: SectionModel;

    constructor(
        private _fb: FormBuilder,
        private _apiService: APIService) {

        this.form = this._fb.group({
            sectionName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveSection() {
        const sectionData = new SectionModel();

        sectionData.SECTION_GUID = UUID.UUID();
        sectionData.CREATION_TS = new Date().toISOString();
        sectionData.NAME = this.form.value.sectionName;
        sectionData.TENANT_GUID = '';
        sectionData.CREATION_USER_GUID = '';
        sectionData.ACTIVE_FLAG = 1;

        const saveData = JSON.stringify({resource: [sectionData]});

        return this._apiService.save(saveData, 'main_section');
    }

    //#endregion

    //#region EDIT METHOD
    public loadDataForEdit(id: string) {
        this.getSectionData(id)
            .subscribe(data => {
                this.form.patchValue({
                    sectionName: data.NAME
                });
            });
    }

    public getSectionData(id: string) {
        return this._apiService.getApiModel('main_section', 'filter=SECTION_GUID=' + id)
            .pipe(
                map(data => {
                    this.sectionData = data['resource'][0];

                    return this.sectionData;
                })
            );
    }

    public updateSection() {

        this.sectionData.NAME = this.form.value.sectionName;
        this.sectionData.UPDATE_TS = new Date().toISOString();

        return this._apiService.update(JSON.stringify({ resource: [this.sectionData] }), 'main_section');
    }
    //#endregion
}
