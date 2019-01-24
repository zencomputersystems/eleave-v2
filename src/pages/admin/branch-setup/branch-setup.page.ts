import { Component, OnInit } from '@angular/core';
import { BranchService } from 'src/services/branch-setup/branch.service';

@Component({
  selector: 'app-branch-setup',
  templateUrl: './branch-setup.page.html',
  styleUrls: ['./branch-setup.page.scss'],
  providers: [BranchService]
})
export class BranchSetupPage implements OnInit {

  branchList: any;
  displayedColumns: string[] = ['BRANCH_NAME', 'Option'];

  constructor(private _branchDataService: BranchService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this._branchDataService.getBranchList()
    .subscribe(() => {
      this.branchList = this._branchDataService.branchData;
    });
  }

  onDeleteBranch(id: string) {
    this._branchDataService.removeBranch(id);
  }


}
