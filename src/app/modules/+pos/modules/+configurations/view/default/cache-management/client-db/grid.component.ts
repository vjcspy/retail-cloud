import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ConfigurationsClientDbState} from "../../../../R/cache/client-db/client-db.state";
import {ConfigurationsClientDbActions} from "../../../../R/cache/client-db/client-db.actions";
import {DatabaseManager} from "../../../../../../../../services/database-manager";
import {RetailDB} from "../../../../../../database/xretail/db/retail-db";
import {AppStorage} from "../../../../../../../../services/storage";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-client-db-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
             styleUrls: ['grid.component.scss']
           })

export class ConfigurationsDefaultCacheManagementClientDBGridComponent {
  @Input() clientDbState: ConfigurationsClientDbState;
  
  constructor(public clientDbActions: ConfigurationsClientDbActions,
              protected databaseManager: DatabaseManager,
              protected storage: AppStorage) { }
  
  getDateTimeString(time) {
    return new Date(time);
  }
  
  async flushAll() {
    let db: RetailDB = this.databaseManager.getDbInstance();
    await db.delete();
    location.reload(true);
  }
  
  flushStorage() {
    this.storage.localClear();
    location.reload(true);
  }
}
