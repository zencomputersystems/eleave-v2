import { Injectable, Injector } from '@angular/core';
import { map} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from '../shared-service/alert.service';
import { SectionModel } from 'src/models/main/section.model';
import { CRUD } from '../base/crud.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends CRUD {

    private _sectionData: BehaviorSubject<SectionModel[]> = new BehaviorSubject([]);
    public readonly sectionData: Observable<SectionModel[]> = this._sectionData.asObservable();

    constructor(
        private _alertCtrl: AlertService,
        injector: Injector) {
            super(injector);
        }

    // load the master leave type list from db
    public getSectionList() {

        return this.read('main_section', 'filter=ACTIVE_FLAG=1')
            .pipe(map(data => {
                let sectionData = new Array<SectionModel>();
                sectionData = data['resource'];

                this._sectionData.next(sectionData);
                return this.sectionData;
            }));
    }

    public removeSection(id: string) {
        // get the leave data
        this.read('main_section', 'filter=SECTION_GUID=' + id)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                const updateCall = this.update('main_section', data['resource']);
                this._alertCtrl.showRemoveAlert(updateCall)
                    .then((res) => {
                        this.getSectionList().subscribe();
                    },
                    err => {});

            });
    }
}
