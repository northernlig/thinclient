import {EventAggregator} from 'aurelia-event-aggregator';
import {WebAPI} from './web-api';
import {OnObjectUpdated, SelectObject, OnConnect} from './messages';
import {inject} from 'aurelia-framework';

@inject(WebAPI, EventAggregator)
export class ObjectView {
  constructor(api, ea) {
    this.api = api;
    this.objects = [];

    // Always begin by selecting nothing
    this.select ("");

    // Select object events
    ea.subscribe(SelectObject, msg => {
      this.select(msg.path)
    });

    // Object updated events
    ea.subscribe(OnObjectUpdated, msg => {
      this.selected = msg.object.name;
    });

    // Connect to server events
    ea.subscribe(OnConnect, msg => {
      api.connect (msg.hostname);

      // Select nothing
      this.select ("")
    });
  }

  // Update view: occurs upon selection.
  // Path format is: /collectionName/collectionItem/collectionName/etc...
  select(path) {
    this.currentPath = path;
    this.parentPath = this.getParentPath ();

    // Update the name of the parent object
    if (path == "") {
      // Empty path should show project static text (there is no object to represent this parent)
      this.selected = "Project";
    }
    else {
      // Name is the part of the path after the '/'.
      // Todo: It's possible to have a path with an ending '/'.  Example: objects/Channel1/
      // The algorithm would fail for this.  Not bother to fix that now though..
      let pathParts = path.split("/");
      let objectName = pathParts[pathParts.length-1];
      this.selected = objectName;
    }

    // Update the select nodes children
    // ToDo: Need to genericize this to grab channels or devices
    this.api.getChildObjects(path).then(objects => this.objects = objects);

    return true;
  }

  getChildPath (childObject) {
    // ToDo: Need to use information from REST to determine what the collection names should
    // actually be.  Should probably do this as  a class function attached to childObject... i.e. childObject.GetPath ()
    if (this.currentPath == 0) {// Channels
      return 'channels/' + childObject.name;
    }
    else {
      return this.currentPath + '/devices/' + childObject.name;
    }
  }

  getParentPath (){
    let pathParts = this.currentPath.split ('/');
    if (pathParts.length == 1 || pathParts.length == 2){  // Project selected or channel selected
      return "";
    }

    // New path is everything but the last two parts.  This should work N deep
    let parentPath = pathParts[0];  // Can't include channels because of this.
    for (let i = 1; i < pathParts.length - 2; i++){
      parentPath += '/' + pathParts[i];
    }

    return parentPath;
  }
}
