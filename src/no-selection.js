import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SelectObject} from './messages';

@inject(EventAggregator)
export class NoSelection {
  constructor(ea) {
    this.message = "Please Select an Object.";
    this.ea = ea;
  }

  activate (){
    // Need to reset everything when this is activated.
    // Causes object view to select the root node.
    this.ea.publish(new SelectObject(""));
  }
}
