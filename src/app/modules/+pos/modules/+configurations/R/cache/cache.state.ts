import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {MagentoProductState, magentoProductStateFactory} from "./magento-product/magento-product.state";

export interface ConfigurationsCacheState {
  magentoProduct: MagentoProductState;
}

export interface ConfigurationsCacheStateRecord extends TypedRecord<any>, ConfigurationsCacheState {}

export const configurationsCacheStateFactory = makeTypedFactory<ConfigurationsCacheState, ConfigurationsCacheStateRecord>(
  {
    magentoProduct: magentoProductStateFactory()
  });
