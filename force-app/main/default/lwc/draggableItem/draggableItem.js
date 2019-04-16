import { LightningElement, api } from 'lwc';
import dragDropTouch from '@salesforce/resourceUrl/DragDropTouch';
import { loadScript } from 'lightning/platformResourceLoader';
export default class DraggableItem extends LightningElement 
{
	@api item = {};
	@api index = -1;


	renderedCallback() {
		Promise.all([loadScript(this, dragDropTouch)])
			.then(() => console.log('DnDTouch Laoded'))
			.catch((error) => console.error(error));
	} 


}