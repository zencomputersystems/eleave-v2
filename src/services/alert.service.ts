import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class AlertService {
    constructor(private _alertCtrl: AlertController) {

    }

    public showAlert() {

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
                        resolve(true);
                    }
                  }
                ]
              });
              alert.then(a => a.present());
        });
    }
}


