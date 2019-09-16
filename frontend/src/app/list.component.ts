import { Component } from '@angular/core';

import axios from 'axios';
import qs from 'qs';

const serverUri = 'http://localhost:8080'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJiZjYwYzUyZjhjM2QxMWI4YjlmY2JlMjFkMDAxMGVjIiwiaWF0IjoxNTY4Mzk1MjE5LCJleHAiOjE1NzAxMjMyMTl9.XyHgqSsJq6kNy-HHU-KwtlOx1XS_mfwL2QgnG5HppLI'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./app.component.css']
})
export class ListComponent {
	data: string[];
	newTask: string;
	taskEditingIndex: int;
	editTitleInput: string;

	ngOnInit() {
		axios.get(serverUri + '/list', {
			headers: { 'x-todo-token': token }
		}).then(res => {
			if (res && res.data && res.data.rows) {
				console.log(res)
				this.data = res.data.rows;
			} // handle err
		}).catch(err => {
		    console.log(err);
		});
	}

	addClicked() {
		if (!this.newTask) return;

		axios({
			method: 'POST',
			data: qs.stringify({ 'title': this.newTask }),
			headers: { 'x-todo-token': token },
			url: `${serverUri}/list`
		}).then(res => {
			if (res && res.data) {
				this.data.unshift(res.data);
				this.newTask = null;
			} // handle err
		}).catch(err => {
		    console.log(err);
		});
	}

	onNewTaskInput(event: any) {
		this.newTask = event.target.value;
	}

	editClicked(i) {
		this.taskEditingIndex = i;
	}

	onEditTitleInput(event: any) {
		this.editTitleInput = event.target.value;
	}

	saveClicked() {
		axios({
			method: 'POST',
			data: qs.stringify({ 'title': this.editTitleInput }),
			headers: { 'x-todo-token': token },
			url: `${serverUri}/list/${this.data[this.taskEditingIndex].id}`
		}).then(res => {
			if (res && res.data) {
				this.data[this.taskEditingIndex].doc.title = this.editTitleInput;
				this.taskEditingIndex = null; 
			} // handle err
		}).catch(err => {
		    console.log(err);
		});
	}

	deleteClicked(i) {
		axios({
			method: 'DELETE',
			headers: { 'x-todo-token': token },
			url: `${serverUri}/list/${this.data[i].doc._id}`
		}).then(res => {
			if (res && res.data && res.data.success) {
				this.data.splice(i, 1);
			} // handle err
		}).catch(err => {
		    console.log(err);
		});
	}

}
