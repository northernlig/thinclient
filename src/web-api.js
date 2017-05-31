import {cloneObject} from './utility';

// Fake channels
let channels = [
  {
    name:'Channel1',
    prop1:'localhost',
    prop2:'0',
    prop3:'222'
  },
  {
    name:'Channel2',
    prop1:'true',
    prop2:'55',
    prop3:'read-only'
  },
  {
    name:'Channel3',
    prop1:'192.168.1.1',
    prop2:'yes',
    prop3:'33'
  },
  {
    name:'Channel4',
    prop1:'255.255.255.255',
    prop2:'2',
    prop3:'33'
  },
  {
    name:'Channel5',
    prop1:'localhost',
    prop2:'35',
    prop3:'23'
  }
];

// Fake devices: normally each channel has different devices, but we just want a pretty hack.
let devices = [
  {
    name:'Device1',
    prop1:'localhost',
    prop2:'0',
    prop3:'222'
  },
  {
    name:'Device2',
    prop1:'true',
    prop2:'55',
    prop3:'read-only'
  }
];

export class WebAPI {
  isRequesting = false;
  hostname = "";

  connect (hostname) {
    // In rest, connections are stateless.  So, just keep track of the current IP rather than communicating with server.
    this.hostname = hostname;
  }

  // Given the path to a parent, return its children
  // Without in memory, this would just be a rest call, and JSON conversion code.
  getChildObjects(path) {
    this.isRequesting = true;
    return new Promise(resolve => {
      let results = [];

      // Hack: this makes it look like we're disconnected unless someone has connected with localhost.
      if (this.hostname != 'localhost'){
        return [];
      }

      // Hack: return either devices or channels depending on the path
      let pathParts = path.split ('/');
      if (pathParts.length == 1) {
        results = channels.map(channel => {
          return cloneObject(channel)
        });
      }
      else if (pathParts.length==2){
        results = devices.map(device => {
          return cloneObject(device)
        });
      }

      resolve(results);
      this.isRequesting = false;
    });
  }

  getObjectProperties(path) {
    this.isRequesting = true;
    return new Promise(resolve => {
      // Hack: return device/channel properties depending on path.
      let pathParts = path.split ("/");
      let name = pathParts [pathParts.length-1];

      let object;
      if (pathParts.length == 2) {
        object = channels.filter(x => x.name == name)[0];
      }
      else {
        object = devices.filter(x => x.name == name)[0];
      }

      resolve(cloneObject(object));
      this.isRequesting = false;
    });
  }

  saveObject(originalObject, modifiedObject){
    // ToDo: Need to add device name saving support.  Requires path implementation.  Not bothering to do this
    // because real REST client implementation would rewrite this into a simple PUT call given a path and modified object.
    this.isRequesting = true;
    return new Promise(resolve => {
      let instance = cloneObject(modifiedObject);

      // Duplicate names aren't allowed, but that's enforced by kepserver, so no need to enforce here.
      let found = channels.filter(x => x.name == originalObject.name)[0];

      if(found){
        let index = channels.indexOf(found);
        channels[index] = instance;
      }

      this.isRequesting = false;
      resolve(instance);
    });
  }
}
