import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  dates: any;

  constructor(private loadingController: LoadingController) {}

  ngOnInit() {
    // Set up the dates, wait for the data to be loaded
    this.loadData();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadData();
      event.target.complete();
    }, 2000);
  }

  async loadData() {
    // Setup a loading screen here
    const loading = await this.loadingController.create({
      message: 'Loading data...',
      spinner: 'crescent'
    });
    await loading.present();

    // Use Preferences to retrieve the data, and if it exists, prefill the form
    const checkData = async (key: string) => {
      const { value } = await Preferences.get({ key });
      if (value) {
        loading.dismiss();
        this.dates = JSON.parse(value).dates;
      }
    }
    checkData('data');
  }

}
