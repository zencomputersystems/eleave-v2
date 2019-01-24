import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BranchFormService } from 'src/services/branch-setup/branch-form.service';

@Component({
  selector: 'app-branch-setup-form',
  templateUrl: './branch-setup-form.page.html',
  styleUrls: ['./branch-setup-form.page.scss'],
  providers: [BranchFormService]
})
export class BranchSetupFormPage implements OnInit {

  editMode = false;
  subscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _branchFormService: BranchFormService
    ) { }

  get form(): FormGroup {
      return this._branchFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

        // check if we in edit or add mode
        if (id != null && id !== '') {

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
