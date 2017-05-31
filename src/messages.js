export class OnObjectUpdated {
  constructor(object) {
    this.object = object;
  }
}

export class SelectObject {
  constructor(path) {
    this.path = path;
  }
}

export class OnConnect {
  constructor (hostname) {
    this.hostname = hostname;
  }
}
