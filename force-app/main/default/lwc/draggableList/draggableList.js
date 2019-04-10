import { LightningElement, api, track } from 'lwc';

export default class DraggableList extends LightningElement {

	dragIndex = -1;

	@api title;	
	@track _items = [
		{ name: "Item 1" },
		{ name: "Item 2" },
		{ name: "Item 3" },
		{ name: "Item 4" },
		{ name: "Item 5" }
	];

	@api set items(value) {
		this._items = [];
		value.forEach(element => {
			this._items.push(element);
		});
	}

	get items() {
		return this._items;
	}


	allowDrop(ev) {
		// on dragover I swap the elements
		var el = ev.target;
		var idxSource = this.dragIndex;
		var idxTarget = el.index;
		console.log(' Index source: ' + idxSource + ' Index target: ' + idxTarget);
		this.swapArray(idxSource, idxTarget);

		this.dragIndex = idxTarget;

		ev.preventDefault();
		ev.stopPropagation();
		ev.dataTransfer.dropEffect = "move";

		el.parentElement.classList.add('dragover');
	}

	dropItem(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		let el = ev.target; // current element
		let idxSource = this.dragIndex;
		let idxTarget = el.index;
		console.log(' Index source: ' + idxSource + ' Index target: ' + idxTarget);
		this.swapArray(idxSource, idxTarget);
		ev.dataTransfer.clearData('text/index');
		this.dragIndex = -1;
		el.parentElement.classList.remove('dragover');

		console.log(this.items);
	}

	startDrag(ev) {
		this.dragIndex = ev.target.querySelector('c-draggable-item').index
		ev.dataTransfer.setData('text/index', this.dragIndex);
		ev.dataTransfer.dropEffect = "move";
	}

	swapArray(idx1, idx2) {		
		[this._items[idx1], this._items[idx2]] = [this._items[idx2], this._items[idx1]];
		this.dispatchEvent(new CustomEvent('listchanged', { detail: this._items}));
	}

	dragEnter(ev) {
		var el = ev.target.parentElement;
		if (el) { 
			el.classList.add('dragover'); 
		}
	}

	dragLeave(ev) {
		var el = ev.target.parentElement;
		if (el) {
			el.classList.remove('dragover');
		}
	}
}