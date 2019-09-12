import { Component } from '@angular/core';
import { Router } from '@angular/router';

import axios from 'axios';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setToken } from './store/token.actions';


const serverUri = 'http://localhost:8080'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./app.component.css']
})

export class LoginComponent {
	token$: Observable<string>;
	username: string;
	password: string;

	constructor(private store: Store<{ token: string }>, private router: Router) {
  	this.token$ = store.pipe(select(state => state.token));
	}

	onLoginClick() {
		axios.post(serverUri + '/login', {
			username: this.username,
		  password: this.password
		}).then(res => {
			if (res && res.data) {
				const data = res.data;
				console.log(data)
				if (data.success && data.token) {
					this.store.dispatch(setToken(data.token));
					this.router.navigate(['list'])
				} // handle err
			} // handle err
		}).catch(err => {
		    console.log(err);
		});
	}

	onUsernameInput(event: any) {
		this.username = event.target.value;
	}

	onPasswordInput(event: any) {
		this.password = event.target.value;
	}
}