import { Component, OnInit } from '@angular/core';
import { SectionService } from 'src/services/section-setup/section.service';

@Component({
  selector: 'app-section-setup',
  templateUrl: './section-setup.page.html',
  styleUrls: ['./section-setup.page.scss'],
  providers: [SectionService]
})
export class SectionSetupPage implements OnInit {

  sectionList: any;
  displayedColumns: string[] = ['SECTION_NAME', 'Option'];

  constructor(private _sectionDataService: SectionService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this._sectionDataService.getSectionList()
    .subscribe(() => {
      this.sectionList = this._sectionDataService.sectionData;
    });
  }

  onDeleteSection(id: string) {
    this._sectionDataService.removeSection(id);
  }

}
