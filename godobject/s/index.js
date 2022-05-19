//import directusStore from 'src/cynova/directus.store';
import editContext from './editContext';
import * as distributedStore from './store';
import initServerSync from './initServerSync';
import sync from './sync';

const rootEditContext = editContext(distributedStore);
window.distributedStore = distributedStore;

export * from './store';
export { rootEditContext, initServerSync, sync };
