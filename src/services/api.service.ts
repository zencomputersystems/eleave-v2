import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import * as constants from '../config/constant';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
export class APIService {

    queryHeaders = new Headers();

    constructor(public http: Http) {
        this.queryHeaders.append('Content-Type', 'application/json');
        this.queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

    getModelUrl(table: string, args?: string) {
        if (args != null) {
            return constants.DREAMFACTORY_TABLE_URL + '/' + table + '?' + args;
        }
        return constants.DREAMFACTORY_TABLE_URL + '/' + table;
    }

    getApiModel(endPoint: string, args?: string) {
        const url = this.getModelUrl(endPoint, args);
        return this.http.get(url, { headers: this.queryHeaders }).pipe(map(res => res.json()));
    }

    save(Model_Name: any, Table_Name: string): Observable<any> {
        const options = new RequestOptions({ headers: this.queryHeaders });
        return this.http.post(constants.DREAMFACTORY_TABLE_URL + '/' + Table_Name, Model_Name, options)
        .pipe(map((response) => {
                return response;
            }));
    }

    update(Model_Name: any, Table_Name: string): Observable<any> {
        const options = new RequestOptions({ headers: this.queryHeaders });
        return this.http.patch(constants.DREAMFACTORY_TABLE_URL + '/' + Table_Name, Model_Name, options)
            .pipe(map((response) => {
                return response;
            }));
    }

    createTimestamp() {
        // return moment.utc(new Date()).zone('+08:00').format('YYYY-MM-DDTHH:mm');
        // return moment.utc(new Date()).zone(localStorage.getItem("cs_timestamp")).format('YYYY-MM-DDTHH:mm');
    }

}
