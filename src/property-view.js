
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {OnObjectUpdated, SelectObject} from './messages';
import {areEqual, cloneObject} from './utility';

@inject(WebAPI, EventAggregator)
export class PropertyView {
  constructor(api, ea){
    this.api = api;
    this.ea = ea;
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    // Initialize properties
    // ToDo: Display generic object properties.  Currently, we assume 3 static properties and statically code their names.
    return this.api.getObjectProperties(params.path).then(object => {
      // Keep track of object being edited
      this.object = object;
      this.originalObject = cloneObject(object);

      this.ea.publish(new SelectObject(params.path));
    });
  }

  get canSave() {
    return  !areEqual (this.originalObject, this.object) && !this.api.isRequesting;
  }

  save() {
    this.api.saveObject(this.originalObject, this.object).then(object => {
      // Update locally cached object
      this.object = object;
      this.originalObject = cloneObject(object);

      this.ea.publish(new OnObjectUpdated(this.object));
    });
  }

  canDeactivate() {
    // If unsaved changes, give user the opportunity to not change views
    if (!areEqual(this.originalObject, this.object)){
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
      return result;
    }

    return true;
  }
}

