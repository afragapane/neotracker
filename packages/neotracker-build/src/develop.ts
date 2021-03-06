import rc from 'rc';
import { HotWebServer } from './HotWebServer';

const ntConfig = rc('neotracker', {
  ci: false, // Running as part of continuous integration
  prod: false, // Compile for production
});

const server = new HotWebServer({
  isCI: ntConfig.ci,
  prod: ntConfig.prod,
});

// tslint:disable-next-line no-floating-promises
server.start();
