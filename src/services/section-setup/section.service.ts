import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { map} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from '../alert.service';
import { SectionModel } from 'src/models/main/section.model';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

    private _sectionData: BehaviorSubject<SectionModel[]> = new BehaviorSubject([]);
    public readonly sectionData: Observable<SectionModel[]> = this._sectionData.asObservable();

    constructor(
        private _apiService: APIService,
        private _alertCtrl: AlertService) {}

    // load the master leave type list from db
    public getSectionList() {

        return this._apiService.getApiModel('main_section', 'filter=ACTIVE_FLAG=1')
            .pipe(map(data => {
                let sectionData = new Array<SectionModel>();
                sectionData = data['resource'];

                this._sectionData.next(sectionData);
                return this.sectionData;
            }));
    }

    public removeSection(id: string) {
        // get the leave data
        this._apiService.getApiModel('main_section', 'filter=SECTION_GUID=' + id)
            .pipe(map(data => {

                // set the ACTIVE_FLAG to 0
                data['resource'][0].ACTIVE_FLAG = 0;

                return data;
            }))
            .subscribe(data => {
                this._alertCtrl.showAlert().then((res) => {
                    this._apiService.update(JSON.stringify(data), 'main_section')
                    .subscribe((response) => {

                        if (response.status === 200) {
                           // reload the data from db
                           this.getSectionList().subscribe();
                        }
                    });
                },
                err => {});

            });
    }
}
