import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SectionFormService } from 'src/services/section-setup/section-form.service';

@Component({
  selector: 'app-section-setup-form',
  templateUrl: './section-setup-form.page.html',
  styleUrls: ['./section-setup-form.page.scss'],
  providers: [SectionFormService]
})
export class SectionSetupFormPage implements OnInit {

  editMode = false;
  subscription: Subscription;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _router: Router,
    private _sectionFormService: SectionFormService
    ) { }

  get form(): FormGroup {
      return this._sectionFormService.form;
  }

  ngOnInit() {
    const id = this._activatedRouter.snapshot.paramMap.get('id');

        // check if we in edit or add mode
        if (id != null && id !== '') {

            this.editMode = true;

            // load the data from db
            this._sectionFormService.loadDataForEdit(id);
        }
  }

  onSubmit() {
    let data: any;
        if (this.editMode) {
            // call the update method
            data = this._sectionFormService.updateSection();
        } else {
            // call the insert method
            data = this._sectionFormService.saveSection();
        }

        // tslint:disable-next-line:no-shadowed-variable
        this.subscription = data.subscribe(data => {
            if (data.status === 200) {
                this._router.navigate(['/section-setup']);
            }
        });
  }


}
