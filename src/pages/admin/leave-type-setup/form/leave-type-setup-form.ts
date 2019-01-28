import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { LeaveTypeFormService } from 'src/services/leave-type-setup/leave-type-form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leave-type-setup-form',
  templateUrl: './leave-type-setup-form.html',
  styleUrls: ['./leave-type-setup-form.scss'],
  providers: [LeaveTypeFormService]
})

export class LeaveTypeSetupForm implements OnInit {

    // store the json data coming from xml
    jsonData: any;
    subscription: Subscription;
    checkModeSubscription: Subscription;
    leaveid: string;

    get form(): FormGroup {
        return this._leaveTypeFormService.form;
    }

    constructor(
        private _leaveTypeFormService: LeaveTypeFormService,
        private _activatedRouter: ActivatedRoute,
        private _router: Router) { }

    ngOnInit() {

    }

    ionViewWillEnter() {

        const id = this._activatedRouter.snapshot.paramMap.get('id');
        this.leaveid = this._activatedRouter.snapshot.paramMap.get('lid');

        // set the form mode
        this.checkModeSubscription = this._leaveTypeFormService.checkEditMode(id).subscribe((isEditMode) => {
            if (isEditMode) {
                this._leaveTypeFormService.loadDataForEdit(id);
            } else {
                this._leaveTypeFormService.loadDataForAdd(this.leaveid);
            }
        });

    }

    onSubmit() {
        let data: any;
        if (this._leaveTypeFormService.isEditMode) {
            // call the update method
            data = this._leaveTypeFormService.updateLeaveEntitlementType();
        } else {
            // call the insert method
            data = this._leaveTypeFormService.saveLeaveEntitlementType(this.leaveid);
        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['/leave-type-setup']);
            }
        });
    }

    addLevel() {
        this.form.controls.properties['controls'].levels.push(this._leaveTypeFormService.createServiceYear(0, 0, 0));
    }

    removeLevel(i: number) {
        const control = <FormArray>this.form.controls.properties['controls'].levels;
        control.removeAt(i);
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
        this.checkModeSubscription.unsubscribe();
    }

}
