import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {
    username: '',
    password: ''
  };

  remember = false;

  constructor(private router: Router, private http: HttpClient, private toastController: ToastController) { 
    // Use Preferences to retrieve the data, and if it exists, prefill the form
    const checkData = async (key: string) => {
      const { value } = await Preferences.get({ key });
      if (value) {
        this.user = JSON.parse(value);
      }
    }
    checkData('user');
  }

  login(form: NgForm) {
    console.log('Accessing login');

    // Get the user data from the html form
    // console.log(form.value);
    this.user.username = form.value.username;
    this.user.password = form.value.password;
    console.log('First accessing http://www.sebastien-thon.fr');

    // this.remember = form.value.remember;
    // console.log(form.value.remember);

    // interrogate http://www.sebastien-thon.fr/prince/index.php?connexion
    // if success, then navigate to tabs
    // if failure, then display error message
    console.log('Second accessing http://www.sebastien-thon.fr');
    console.log('Third accessing http://www.sebastien-thon.fr');
    this.http.get('http://www.sebastien-thon.fr/prince/index.php?connexion&login=' + this.user.username + '&mdp=' + this.user.password).subscribe((data: any) => {
      console.log('Checking data resultat');
      if (data.resultat  === 'OK') {
        console.log('Login successful, accessing user data');
        let navigationExtras: NavigationExtras = {
          state: {
            user: this.user
          }
        };
        console.log('Accessed user data')
        if (form.value.remember) {
          console.log('Remembering user');
          console.log(form.value.remember);
          this.rememberMe();
        } else {
          console.log('Forgetting user');
          console.log(form.value.remember);
          this.forgetMe();
        }
        console.log('Going to california');
        this.getData();
        this.router.navigate(['/tabs'], navigationExtras);
      } else {
        const toast = this.toastController.create({
          message: 'Login failed',
          duration: 1500,
          color: 'danger',
          position: 'top'
        });
        toast.then(toast => toast.present());
      }
    });
  }

  rememberMe() {
    // Use Preferences to store the data
    const storeData = async (key: string, value: string) => {
      await Preferences.set({ key, value });
    }
    storeData('user', JSON.stringify(this.user));
  }

  forgetMe() {
    // Use Preferences to remove the data
    const removeData = async (key: string) => {
      await Preferences.remove({ key });
    }
    removeData('user');
  }

  /** 
   * Request the data from the server at http://www.sebastien-thon.fr/prince/index.php?login=user.username&mdp=user.password 
   * and store it in local storage using Preferences
   */
  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Loading data...');
      console.log(this.user);
      this.http.get('http://www.sebastien-thon.fr/prince/index.php?login=' + this.user.username + '&mdp=' + this.user.password).subscribe({
        next: (data) => {
          // Store the data using Preferences
          const storeData = async (key: string, value: string) => {
            await Preferences.set({ key, value });
          }
          storeData('data', JSON.stringify(data));
          resolve(data);
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          console.log('Data loaded');
        }
      });
    });
  }

  ngOnInit() {
  }

}
