import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  user: any;

  constructor(private router: Router) {}

  /**
   * Standard Angular lifecycle hook ; 
   * data loading is done here to ensure that a user is logged in
   */
  ngOnInit() {
  }

  /** 
   * Erase the data of both the user and the user's data
   */
  eraseData() { 
    this.user = null;
    // Erase the data using Preferences
    const eraseData = async (key: string) => {
      await Preferences.remove({ key });
    }
    eraseData('data');
  }

  /**
   * Disconnect the current user and erase the data
   */
  disconnect() {
    // Erase the data
    this.eraseData();
    // Navigate to the main page without the back button
    this.router.navigate([''], { replaceUrl: true });
  }
}
