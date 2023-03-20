import { Component, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  // classe: any;
  /* Deux options:
  Soit considérer que un téléphone = une personne qui peut avoir plusieurs enfants 
  dans plusieurs classes différentes
  et donc garder les articles inter-classes en favori en local pour les trois comptes
  Soit faire en sorte que favori allie classe et compte 
  (et donc que l'on puisse avoir des favoris différents pour chaque compte) 
  */
  articles: any;
  articlesToShow: any;
  favorites: any;
  showingOnlyFavorites: boolean = false;
  hasTutorialBeenSeen: boolean = false;
  
  constructor(private loadingController: LoadingController) {
  }
  
  ngOnInit() {
    // Set up the articles, wait for the data to be loaded
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
    const checkDataArticles = async (key: string) => {
      const { value } = await Preferences.get({ key });
      if (value) {
        loading.dismiss();
        this.articles = JSON.parse(value).articles;
        this.articlesToShow = this.articles;
      }
    }
    checkDataArticles('data');

    const checkDataFavorites = async (key: string) => {
      const { value } = await Preferences.get({ key });
      if (value) {
        loading.dismiss();
        this.favorites = JSON.parse(value);
      }
    }
    checkDataFavorites('favorites');

    const checkTutorial = async (key: string) => {
      const { value } = await Preferences.get({ key });
      if (value) {
        this.hasTutorialBeenSeen = JSON.parse(value);
      }
    }
    checkTutorial('tutorial');  
    console.log(this.hasTutorialBeenSeen);

    // this.classe = this.articles[0].classe; 
  }

  addToFavorites(article: any) {
    console.log(this.favorites);
    console.log(article);
    // Add the article id to the favorites list if it isn't already there
    if (!this.favorites) {
      this.favorites = [article.id];
    } else if (!this.favorites.includes(article.id)) {
      this.favorites.push(article.id);
    }
    // Save the favorites list to Preferences
    Preferences.set({
      key: 'favorites',
      value: JSON.stringify(this.favorites)
    });

    // Log the favorites list
    console.log(this.favorites);
  }

  removeFromFavorites(article: any) {
    console.log(article);
    // Remove the article id from the favorites list if it is there
    if (this.favorites && this.favorites.includes(article.id)) {
      this.favorites = this.favorites.filter((id: any) => id !== article.id);
    }
    // Save the favorites list to Preferences
    Preferences.set({
      key: 'favorites',
      value: JSON.stringify(this.favorites)
    });

    // Log the favorites list
    console.log(this.favorites);
  }

  isFavorite(article: any) {
    // Check if the article is in the favorites list
    if (this.favorites && this.favorites.includes(article.id)) {
      return true;
    }
    return false;
  }

  showOnlyFavorites() {
    // Filter the articles list to only show the favorites and set the flag
    if (this.favorites) {
      this.articlesToShow = this.articlesToShow.filter((article: any) => this.favorites.includes(article.id));
      this.showingOnlyFavorites = true;
    }
  }

  showAll() {
    // Show all the articles and set the flag
    this.articlesToShow = this.articles;
    this.showingOnlyFavorites = false;
  }

  tutorialHasBeenSeen() {
    this.hasTutorialBeenSeen = true;

    // Save the data using Preferences
    Preferences.set({
      key: 'tutorial',
      value: this.hasTutorialBeenSeen.toString()
    });
  }

  search(event: any) {
    // Filter the articles list to only show the ones that match the search query
    console.log(event.target.value);
    const query = event.target.value.toLowerCase();

    this.articlesToShow = this.articles.filter((article: any) => {
      if (article.titre.toLowerCase().indexOf(query) > -1 || article.texte.toLowerCase().indexOf(query) > -1) {
        return true;
      }
      return false;
    });
  }
}
