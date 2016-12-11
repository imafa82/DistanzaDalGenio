import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { Indirizzo } from '../../models/indirizzo';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, Geolocation } from 'ionic-native';
import {  GithubUsers } from '../../providers/github-users';
import { UserDetailsPage } from '../user-details/user-details';
@Component({
  selector: 'page-users',
  templateUrl: 'users.html'
})
export class UsersPage {
  users: User[]
  originalUsers: User[];
  private map: GoogleMap;
  partenza: Indirizzo;
  arrivo: Indirizzo;
  via:string;
  latitudine;
  longitudine;
  distanzaMiglia;
  tempo;

  constructor(public navCtrl: NavController, private githubUsers: GithubUsers, platform: Platform) {
    
platform.ready().then(()=>{
  GoogleMap.isAvailable().then(()=>{
          this.map = new GoogleMap('map_canvas');
          this.map.one(GoogleMapsEvent.MAP_READY).then((data:any)=>{
            // Centrare la mappa
            Geolocation.getCurrentPosition().then(pos =>{
              githubUsers.getLatLang("Raffaele+Garofalo+81,+Roma").subscribe(response => {
                    console.log(response);
                    this.longitudine = response.results[0].geometry.location.lng;
                    this.latitudine = response.results[0].geometry.location.lat;
                    this.via = response.results[0].formatted_address;
                    this.arrivo = new Indirizzo(this.via, this.latitudine, this.longitudine);
                    console.log(this.arrivo);
                     //alert(this.arrivo.latitudine+ " - " + this.arrivo.longitudine);
                    let myPosition = new GoogleMapsLatLng(pos.coords.latitude, pos.coords.longitude);
                    let destPosition= new GoogleMapsLatLng(+this.arrivo.latitudine, +this.arrivo.longitudine);

                    this.map.animateCamera({target: myPosition, zoom: 10});
                    this.map.addMarker({
                      'position': myPosition,
                      'title': 'Tu sei qui'
                    });
                    this.map.addMarker({
                      'position' : destPosition,
                      'title': 'Qui alloggia il genio'
                    });

                     githubUsers.getAddress(pos.coords.latitude, pos.coords.longitude).subscribe(response => {
                        console.log(response);
                        this.longitudine = response.results[0].geometry.location.lng;
                        this.latitudine = response.results[0].geometry.location.lat;
                        this.via = response.results[0].formatted_address;
                        this.partenza = new Indirizzo(this.via, this.latitudine, this.longitudine);
                       //alert(this.partenza.indirizzo);
                       githubUsers.getDistanza(this.partenza.indirizzo, this.arrivo.indirizzo).subscribe(response => {
                              console.log(response);
                             this.distanzaMiglia = response.rows[0].elements[0].distance.text;
                             this.tempo = response.rows[0].elements[0].duration.text;
                      });
                    });
                  });
            });
              

          });
          githubUsers.load().subscribe(users => {
             this.users = users;
             this.originalUsers = users;
          })
           githubUsers
            .searchUsers('scotch').subscribe(users => {
              console.log(users)
            });
            
      //Chiusura GoogleMap
       })
       .catch(
         () => alert("Google Map nativo non è avviabile")
         );
    //Chiusura Platform    
    });
      

       
  }
  goToDetails(login: string) {
    this.navCtrl.push(UserDetailsPage, {login});
  }
  
  search(searchEvent) {
    let term = searchEvent.target.value
    // We will only perform the search if we have 3 or more characters
    if (term.trim() === '' || term.trim().length < 3) {
      // Load cached users
      this.users = this.originalUsers;
    } else {
      // Get the searched users from github
      this.githubUsers.searchUsers(term).subscribe(users => {
        this.users = users
      });
    }
  }
}