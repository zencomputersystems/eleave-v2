import { Component, OnInit } from '@angular/core';
import { CostCentreService } from 'src/services/cost-centre-setup/cost-centre.service';

@Component({
  selector: 'app-cost-centre-setup',
  templateUrl: './cost-centre-setup.page.html',
  styleUrls: ['./cost-centre-setup.page.scss'],
  providers: [CostCentreService]
})
export class CostCentreSetupPage implements OnInit {
  costCentreList: any;
  displayedColumns: string[] = ['COST_CENTRE_NAME', 'Option'];

  constructor(private _costCentreDataService: CostCentreService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this._costCentreDataService.getCostCentreList()
    .subscribe(() => {
      this.costCentreList = this._costCentreDataService.costCentreData;
    });
  }

  onDeleteCostCentre(id: string) {
    this._costCentreDataService.removeCostCentre(id);
  }

}
