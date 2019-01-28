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

    subscription: Subscription;
    checkModeSubscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _branchFormService: BranchFormService,
    ) { }

  get form(): FormGroup {
      return this._branchFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

    // set the form mode
   this.checkModeSubscription = this._branchFormService.checkEditMode(id).subscribe(() => {
        this._branchFormService.loadDataForEdit(id);
    });

  }

  onSubmit() {
    let data: any;
        if (this._branchFormService.isEditMode) {
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

  ionViewWillLeave() {
      this.checkModeSubscription.unsubscribe();
  }


}
