import {EventAggregator} from 'aurelia-event-aggregator';
import {OnConnect} from 'messages';
import {inject} from 'aurelia-framework';

@inject(EventAggregator)
export class ConnectionSelector {
  constructor(ea) {
    this.ea = ea;
    this.hostname = "255.255.255.255";
    this.validHostname = false;
  }

  // Attempt to connect to Kepserver.  Only localhost accepted currently...
  Connect() {
    this.ea.publish(new OnConnect(this.hostname));
  }

  // Validate hostname... hack: only valid for localhost
  OnHostnameChanged () {
    if (this.hostname.trim() === "localhost") {
      this.validHostname = true;
    }
    else {
      this.validHostname = false;
    }
  }
}
