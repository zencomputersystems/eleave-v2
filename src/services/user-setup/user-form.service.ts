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
            personal_information: this.loadPersonalInformationForm(),
            education_information: this._fb.array([this.createEducation('', '', '', '')]),
            spouse_information: this._fb.array([this.createSpouse('', '')]),
            child_information: this._fb.array([this.createChild('', '', 1)])
        });

    }

    private loadPersonalInformationForm() {
        return this._fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            dob: ['', Validators.required],
            contactNumber: ['', Validators.required],
            companyNumber: ['', Validators.required],
            gender: ['', Validators.required],
            maritalStatus: ['', Validators.required],
            address1: ['', Validators.required],
            address2: ['', Validators.required],
            city: ['', Validators.required],
            postcode: ['', Validators.required],
            state: ['', Validators.required],
            country: ['', Validators.required]
        });
    }

    // to create dynamic field
    createEducation(qualification: string, major: string, university: string, year: string): FormGroup {
        return this._fb.group({
            qualification: [qualification, Validators.required],
            major: [major, Validators.required],
            univerity: [university, Validators.required],
            year: [year, Validators.required]
        });
    }

    createSpouse(name: string, identification: string) {
        return this._fb.group({
            spouseName: [name, Validators.required],
            spouseIdentificationNumber: [identification, Validators.required]
        });
    }

    createChild(name: string, identification: string, gender: number) {
        return this._fb.group({
            childName: [name, Validators.required],
            childIdentificationNumber: [identification, Validators.required],
            childGender: [gender, Validators.required]

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
