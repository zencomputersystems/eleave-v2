import { APIService } from '../shared-service/api.service';
import {Injector} from '@angular/core';
import { AlertService } from '../shared-service/alert.service';
import { Observable } from 'rxjs';

export class CRUD {

    protected apiService: APIService;
    protected alertCtrl: AlertService;

    constructor(injector: Injector) {
        this.apiService = injector.get(APIService);
        this.alertCtrl = injector.get(AlertService);
    }

    public read (tableName: string, filter: string) {
        return this.apiService.getApiModel(tableName, filter);
    }

    public create (tableName: string, saveData: any) {

        saveData.CREATION_TS = new Date().toISOString();
        saveData.CREATION_USER_GUID = '';
        saveData.TENANT_GUID = '';

        return this.apiService.save(this.convertData(saveData), tableName);
    }

    public update (tableName: string, saveData: any) {

        saveData.UPDATE_TS = new Date().toISOString();

        return this.apiService.update(this.convertData(saveData), tableName);
    }

    public delete (data: any, tableName: string, successCallback: Observable<any>) {
        const updateData = this.apiService.update(JSON.stringify(data), tableName);

        this.alertCtrl.showRemoveAlert(updateData).then((res) => {
            successCallback.subscribe();
        },
        err => {});

    }

    private convertData(data: any) {
       return JSON.stringify({resource: [data]});
    }
}
