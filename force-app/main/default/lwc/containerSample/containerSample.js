import { LightningElement, api, track } from 'lwc';

export default class ContainerSample extends LightningElement {

	items = [
		{ name: 'Container Item 1'},
		{ name: 'Container Item 2' },
		{ name: 'Container Item 3' },
		{ name: 'Container Item 4' },
	];

	@track
	_sortedList = [];

	@api get sortedList () {
		return this._sortedList;
	}

	set sortedList (value) {		
		this._sortedList = [];
		value.forEach(element => {
			this._sortedList.push(element);
		});
	}

	connectedCallback() {
		this.items.forEach( element => this._sortedList.push(element));
	}

	handleListChanged(ev) {
		this.sortedList = ev.target.items;
		console.log(JSON.stringify(ev.target.items));
	}
}