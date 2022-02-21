import { BaseBlocksCommunicationState, SchemaComponent } from '@one-for-all/page-engine-v2';

export interface BlocksCommunicationType extends BaseBlocksCommunicationState {
  componentToAdd?: SchemaComponent;
}
