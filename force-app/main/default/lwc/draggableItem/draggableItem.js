import { LightningElement, api } from 'lwc';
export default class DraggableItem extends LightningElement 
{
	@api item = {};
	@api index = -1;
}