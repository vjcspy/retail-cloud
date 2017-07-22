import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {MagentoProductState, magentoProductStateFactory} from "./magento-product/magento-product.state";
import {configurationsClientDbStateFactory, ConfigurationsClientDbState} from "./client-db/client-db.state";

export interface ConfigurationsCacheState {
  magentoProduct: MagentoProductState;
  clientDb: ConfigurationsClientDbState;
}

export interface ConfigurationsCacheStateRecord extends TypedRecord<any>, ConfigurationsCacheState {}

export const configurationsCacheStateFactory = makeTypedFactory<ConfigurationsCacheState, ConfigurationsCacheStateRecord>(
  {
    magentoProduct: magentoProductStateFactory(),
    clientDb: configurationsClientDbStateFactory()
  });
