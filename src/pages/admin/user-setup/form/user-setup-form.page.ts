import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserFormService } from 'src/services/user-setup/user-form.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-setup-form',
  templateUrl: './user-setup-form.page.html',
  styleUrls: ['./user-setup-form.page.scss'],
  providers: [UserFormService]
})
export class UserSetupFormPage implements OnInit {

  subscription: Subscription;
  checkModeSubscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _userFormService: UserFormService
    ) { }

  get form(): FormGroup {
      return this._userFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

    // set the form mode
    this.checkModeSubscription = this._userFormService.checkEditMode(id).subscribe(() => {
        // this._userFormService.loadDataForEdit(id);
    });
  }

  onSubmit() {
    let data: any;
        if (this._userFormService.isEditMode) {
            // call the update method
            data = this._userFormService.updateUserData();
        } else {

        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['/section-setup']);
            }
        });
  }


}
