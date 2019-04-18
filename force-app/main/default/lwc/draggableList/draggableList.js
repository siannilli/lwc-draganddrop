import { LightningElement, api, track } from 'lwc';
import DragDropTouch from '@salesforce/resourceUrl/DragDropTouch';
import { loadScript } from 'lightning/platformResourceLoader';

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

	renderedCallback() {
		Promise.all([loadScript(this, DragDropTouch)])
			.then(() => {
				console.log('DnDTouch Laoded');
				window.DDT.init(this.template.querySelectorAll('.c-draggable'));
			})
			.catch((error) => console.error(error));
	} 

	allowDrop(ev) {
		// on dragover I swap the elements
		var el = ev.target;
		var idxSource = this.dragIndex;
		var idxTarget = el.index;
		
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
	
		this.swapArray(idxSource, idxTarget);
		ev.dataTransfer.clearData('text/index');
		this.dragIndex = -1;
		el.parentElement.classList.remove('dragover');
		this.dispatchEvent(new CustomEvent('listchanged', { /* detail: this.items */ }));
	}

	startDrag(ev) {
		this.dragIndex = ev.target.querySelector('c-draggable-item').index
		ev.dataTransfer.setData('text/index', this.dragIndex);
		ev.dataTransfer.dropEffect = "move";
	}

	swapArray(idx1, idx2) {		
		[this._items[idx1], this._items[idx2]] = [this._items[idx2], this._items[idx1]];
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

	touchEnd(ev) {
		if (this.dragIndex === -1) {
			this._dispatchEvent(ev, 'drop', ev.target);
		}
		console.log('Touch ended');
	}

	touchStart(ev) {
		if (this.dragIndex === -1) {
			this._dispatchEvent(ev, 'dragstart', ev.target);
		}
		console.log('Touch started');
	}

	touchMove (ev) {
		console.log('Touch moving');
	}

	touchCancel(ev) {
		console.log('Touch canceled');
	}

	_dispatchEvent(e, type, target) {
		if (e && target) {
			let evt = document.createEvent('Event');
			evt.initEvent(type, true, true);
			evt.button = 0;
			evt.which = evt.buttons = 1;
			target.parentElement.dispatchEvent(evt);
			return evt.defaultPrevented;
		}
		return false;
	}

}