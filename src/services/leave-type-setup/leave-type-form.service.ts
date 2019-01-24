import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { APIService } from '../api.service';
import { map, switchMap } from 'rxjs/operators';
import { LoadingController} from '@ionic/angular';
import { LeaveTypeEntitlementModel } from 'src/models/leavetype-entitlement.model';
import { XmlJson } from '../xml-json.service';
import { UUID } from 'angular2-uuid';

const convert = require('xmljson');

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeFormService {

  public form: FormGroup;
  public formArray: FormArray;
  public entitlementdata = new LeaveTypeEntitlementModel;

  private _formData: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly formData: Observable<any> = this._formData.asObservable();

  constructor(
    private _fb: FormBuilder,
    private _apiService: APIService,
    public loadingCtrl: LoadingController,
    private _jsonXml: XmlJson) {

    // form definition
    this.form = this._fb.group({
      leaveType: ['', Validators.required],
      name: [null, Validators.required],
      description: [null, Validators.required],
      properties: this._fb.group({
        apply_in_advance: ['false', Validators.required],
        apply_next_year: ['false', Validators.required],
        claim_entitlement: ['false', Validators.required],
        apply_halfday: ['false', Validators.required],
        attachment_required: ['false', Validators.required],
        apply_before: this._fb.group({
          day: [0, Validators.required],
          allow_shortnotice: this._fb.group({
            value: ['false', Validators.required],
            notice: ['']
          }),
          exclusion: this._fb.group({
            rest_day: ['false', Validators.required],
            holiday: ['false', Validators.required]
          })
        }),
        apply_more_than_balance: this._fb.group({
          value: ['false', Validators.required],
          convert_to: ['']
        }),
        allow_cancel_after_startdate: this._fb.group({
          value: ['false', Validators.required],
          notice: ['']
        }),
        levels: this._fb.array([this.createServiceYear(0, 0, 0)])
      })
    });

  }

  // to create dynamic field
  createServiceYear(levelid: number, entitled_days: number, carry_forward: number): FormGroup {
    return this._fb.group({
      levelid: [levelid, Validators.required],
      entitled_days: [entitled_days, Validators.required],
      carry_forward: [carry_forward, Validators.required]
    });
  }

  //#region EDIT MODE METHOD

  // load the data for edit mode
  public async loadDataForEdit(id: string) {

    const loading = await this.loadingCtrl.create({
      message : 'Fetching Data...'
    });

    await loading.present();

    this.getLeaveEntitlementData(id)
        .subscribe(data => {
            this._formData.next(data[0]);

            let xmltojson: any;

            // convert the xml into json
            convert.to_json(this._formData.value.PROPERTIES_XML, function (error, t) {
                xmltojson = t;
            });

            try {
              this.setFormValue(xmltojson);
            } catch (e) {}

            loading.dismiss();
        },
        () => {
          loading.dismiss();
        }
    );
  }

  private setFormValue(xmltojson) {
    // patch the form
    this.form.patchValue({
      leaveType: this._formData.value.LEAVE_TYPE_CODE,
      name: this._formData.value.LEAVE_ENTITLEMENT_CODE,
      description: this._formData.value.DESCRIPTION,
      properties: xmltojson.properties
    });

    if (xmltojson.properties.levels.length > 1) {

      const control = <FormArray>this.form.controls.properties['controls'].levels;

      control.removeAt(0);

      xmltojson.properties.levels.forEach(element => {

        // tslint:disable-next-line:max-line-length
        control.push(this.createServiceYear(element.levelid, element.entitled_days, element.carry_forward));
      });
    }
  }

  // load the entitlement detail
  private getLeaveEntitlementData(id: string) {
    return this._apiService.getApiModel('view_leave_type_setup', 'filter=ENTITLEMENT_GUID=' + id)
                .pipe(map(data => {
                    return data['resource'];
                })
            );
  }

  public updateLeaveEntitlementType() {

    return this.formData
        .pipe(
            map(data => {
                const currentTimeStamp = new Date().toISOString();

                // update the timestamp
                data.UPDATE_TS = currentTimeStamp;

                data.DESCRIPTION = this.form.value.description;
                data.CODE = this.form.value.name;

                // convert the json data to xml
                data.PROPERTIES_XML = this._jsonXml.JsonToXml(this.form.value);

                return JSON.stringify({ resource: [data] });

            })
        ).pipe(switchMap((data) => {

            return this._apiService.update(data, 'l_leavetype_entitlement_def');
        })
        );
  }

  //#endregion

  //#region ADD MODE METHOD

  public loadDataForAdd(leaveid: string) {

    this._apiService.getApiModel('l_main_leavetype', 'filter=ACTIVE_FLAG=1&&filter=LEAVE_TYPE_GUID=' + leaveid)
      .subscribe(data => {

        const res = data['resource'][0];

        this.entitlementdata.TENANT_GUID = res.TENANT_GUID;
        this.entitlementdata.TENANT_COMPANY_GUID = res.TENANT_COMPANY_GUID;
        this.entitlementdata.CREATION_USER_GUID = res.CREATION_USER_GUID;

        this.form.patchValue({
          leaveType : res.CODE
        });
      });
  }

  // save leave configuration
  public saveLeaveEntitlementType(leaveid: string) {

    this.entitlementdata.ENTITLEMENT_GUID = UUID.UUID();
    this.entitlementdata.ACTIVE_FLAG = 1;
    this.entitlementdata.LEAVE_TYPE_GUID = leaveid;
    this.entitlementdata.CODE = this.form.value.name;
    this.entitlementdata.DESCRIPTION = this.form.value.description;
    this.entitlementdata.CREATION_TS = new Date().toISOString();
    this.entitlementdata.PROPERTIES_XML = this._jsonXml.JsonToXml(this.form.value);

    const saveData = JSON.stringify({resource: [this.entitlementdata]});

    return this._apiService.save(saveData, 'l_leavetype_entitlement_def');
  }

  //#endregion

}
