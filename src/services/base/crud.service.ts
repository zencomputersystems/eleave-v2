import { APIService } from '../shared-service/api.service';
import {Injector} from '@angular/core';

export class CRUD {

    protected apiService: APIService;

    constructor(injector: Injector) {
        this.apiService = injector.get(APIService);
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

    private convertData(data: any) {
       return JSON.stringify({resource: [data]});
    }
}
