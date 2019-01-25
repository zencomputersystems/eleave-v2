import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Injectable, Injector } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';
import { SectionModel } from 'src/models/main/section.model';
import { CRUD } from '../base/crud.service';

// this class responsible to manage form action
@Injectable({
    providedIn: 'root'
})
export class SectionFormService extends CRUD {
    public form: FormGroup;
    sectionData: SectionModel;

    constructor(
        private _fb: FormBuilder,
        injector: Injector) {

        super(injector);

        this.form = this._fb.group({
            sectionName: ['', Validators.required]
        });
    }

    //#region ADD METHOD
    public saveSection() {
        const sectionData = new SectionModel();

        sectionData.SECTION_GUID = UUID.UUID();
        sectionData.NAME = this.form.value.sectionName;
        sectionData.ACTIVE_FLAG = 1;

        return this.create('main_section', sectionData);
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
        return this.read('main_section', 'filter=SECTION_GUID=' + id)
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

        return this.update('main_section', this.sectionData);
    }
    //#endregion
}
