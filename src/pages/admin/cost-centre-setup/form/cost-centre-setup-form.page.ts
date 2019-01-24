import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CostCentreFormService } from 'src/services/cost-centre-setup/cost-centre-form.service';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CheckEdit } from 'src/services/shared-service/checkEdit.service';

@Component({
  selector: 'app-cost-centre-setup-form',
  templateUrl: './cost-centre-setup-form.page.html',
  styleUrls: ['./cost-centre-setup-form.page.scss'],
  providers: [CostCentreFormService, CheckEdit]
})
export class CostCentreSetupFormPage implements OnInit {

  editMode = false;
  subscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _costCentreFormService: CostCentreFormService,
    private _checkEdit: CheckEdit
    ) { }

  get form(): FormGroup {
      return this._costCentreFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

    if (this._checkEdit.checkMode(id)) {
        this.editMode = true;
        // load the data from db
        this._costCentreFormService.loadDataForEdit(id);
    }
  }

  onSubmit() {
    let data: any;
        if (this.editMode) {
            // call the update method
            data = this._costCentreFormService.updateCostCentre();
        } else {
            // call the insert method
            data = this._costCentreFormService.saveCostCentre();
        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['/cost-centre-setup']);
            }
        });
  }

}
