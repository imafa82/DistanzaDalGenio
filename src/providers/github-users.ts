import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../models/user';
/*
  Generated class for the GithubUsers provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GithubUsers {
	githubApiUrl = 'https://api.github.com';
  constructor(public http: Http) {

  }

// Load all github users
  load(): Observable<User[]> {
    return this.http.get(`${this.githubApiUrl}/users`)
      .map(res => <User[]>res.json());
  }

  // Get github user by providing login(username)
  loadDetails(login: string): Observable<User> {
    return this.http.get(`${this.githubApiUrl}/users/${login}`)
      .map(res => <User>(res.json()))
  }

   // Search for github users  
  searchUsers(searchParam: string): Observable<User[]> {
    return this.http.get(`${this.githubApiUrl}/search/users?q=${searchParam}`) 
      .map(res => <User[]>(res.json().items))
  }

  // Search for github users  
  getLatLang(indirizzo): Observable<any> {
    return this.http.get(`http://maps.google.com/maps/api/geocode/json?address=`+indirizzo) 
      .map(res => <any>(res.json()))
  }

  // Search for github users  
  getDistanza(partenza, arrivo): Observable<any> {
    return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins='+partenza+',+Roma&destinations='+arrivo+'&key=AIzaSyC9IJh8rT6Xawb_tA8KMsC5W7nvq8ElOG0') 
      .map(res => <any>(res.json()))
  }

  getAddress(latitudine, longitudine): Observable<any> {
    return this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitudine+','+longitudine+'&sensor=false') 
      .map(res => <any>(res.json()))
  }

}
