import { Injectable, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoadingController} from '@ionic/angular';
import { XmlJson } from '../shared-service/xml-json.service';
import { UUID } from 'angular2-uuid';
import { CRUD } from '../base/crud.service';
import { UserInfoModel } from 'src/models/main/userinfo.model';

const convert = require('xmljson');

@Injectable({
  providedIn: 'root'
})
export class UserFormService extends CRUD {

  public form: FormGroup;
  public formArray: FormArray;
  private _userdata = new Array<UserInfoModel>();

  private _formData: BehaviorSubject<any> = new BehaviorSubject([]);
  public readonly formData: Observable<any> = this._formData.asObservable();

  constructor(
    private _fb: FormBuilder,
    public loadingCtrl: LoadingController,
    private _jsonXml: XmlJson,
    injector: Injector) {

        super(injector);

        // initialize form
        this.form = this._fb.group({
            personal_information: this._fb.group({
                name: ['', Validators.required],
                email: ['', Validators.required]
            })
        });

    }


    //#region EDIT MODE METHOD

    // load the data for edit mode
    public async loadDataForEdit(id: string) {

        const loading = await this.loadingCtrl.create({
        message : 'Fetching Data...'
        });

        await loading.present();

        this.getLeaveData(id)
            .subscribe((data: Array<UserInfoModel>) => {

                this._userdata = data;
                console.log(this._userdata[0].INFO_XML);
                loading.dismiss();
            },
            () => {
            loading.dismiss();
            }
        );
    }

    private setFormValue(xmltojson) {

    }

    // load the entitlement detail
    private getLeaveData(id: string) {
        return this.read('main_user_info_xml', 'filter=USER_GUID=' + id)
                    .pipe(map(data => {
                        return data['resource'];
                    })
                );
    }

    public updateUserData() {

        return this.formData
            .pipe(
                map(data => {

                    data.DESCRIPTION = this.form.value.description;
                    data.CODE = this.form.value.name;

                    // convert the json data to xml
                    data.PROPERTIES_XML = this._jsonXml.JsonToXml(this.form.value);

                    return data;

                })
            ).pipe(switchMap((data) => {

                return this.update('l_leavetype_entitlement_def', data);
            })
            );
    }

    //#endregion

  //#region ADD MODE METHOD

  public loadDataForAdd(leaveid: string) {

    this.read('main_user_info_xml', 'filter=ACTIVE_FLAG=1&&filter=USER_GUID=' + leaveid)
      .subscribe(data => {


      });
  }

  // save leave configuration
  public saveLeaveEntitlementType(leaveid: string) {

  }

  //#endregion

}
