import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AlertService {
    constructor(private _alertCtrl: AlertController) {

    }

    public showRemoveAlert(d: Observable<any>) {

        return new Promise((resolve, reject) => {
            const alert = this._alertCtrl.create({
                header: 'Remove Confirmation!',
                message: 'Are you sure to remove?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        reject(false);
                    }
                  }, {
                    text: 'OK',
                    handler: () => {
                        d.subscribe((response) => {
                            if (response.status === 200) {
                               // reload the data from db
                               resolve(true);
                            } else {
                                reject(false);
                            }
                        });
                    }
                  }
                ]
              });
              alert.then(a => a.present());
        });
    }
}


