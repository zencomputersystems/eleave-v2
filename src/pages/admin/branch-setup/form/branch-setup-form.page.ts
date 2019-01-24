import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BranchFormService } from 'src/services/branch-setup/branch-form.service';
import { CheckEdit } from 'src/services/shared-service/checkEdit.service';

@Component({
  selector: 'app-branch-setup-form',
  templateUrl: './branch-setup-form.page.html',
  styleUrls: ['./branch-setup-form.page.scss'],
  providers: [BranchFormService, CheckEdit]
})
export class BranchSetupFormPage implements OnInit {

    editMode = false;
    subscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _branchFormService: BranchFormService,
    private _checkEdit: CheckEdit
    ) { }

  get form(): FormGroup {
      return this._branchFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

    if (this._checkEdit.checkMode(id)) {
        this.editMode = true;
        // load the data from db
        this._branchFormService.loadDataForEdit(id);
    }

  }

  onSubmit() {
    let data: any;
        if (this.editMode) {
            // call the update method
            data = this._branchFormService.updateBranch();
        } else {
            // call the insert method
            data = this._branchFormService.saveBranch();
        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['/branch-setup']);
            }
        });
  }


}
