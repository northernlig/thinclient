import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';

@inject(WebAPI)
export class App {
  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Thin Client';
    config.map([
      { route: ['','project'],    moduleId: 'no-selection',  name:'project'},
      { route: 'project/*path',  moduleId: 'property-view',  name:'project'  }
    ]);

    this.router = router;
  }
}
