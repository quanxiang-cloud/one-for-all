import { BehaviorSubject } from 'rxjs';
import type { Artery, Node } from '@one-for-all/artery';
import { set, lensPath } from 'ramda';

export class Store<T extends ArteryEngine.BaseBlocksCommunicationState> extends BehaviorSubject<ArteryEngine.EngineState<T>> {
  private set = <T>(path: string, value: T): void => {
    this.next(set(lensPath(path.split('.')), value, this.getValue()));
  }

  public setArteryStore(arteryStore: BehaviorSubject<Artery>): void {
    this.set('arteryStore$', arteryStore);
  }

  public setActiveNode = (node?: Node): void => {
    this.set('activeNode', node);
  }

  public setBlocksCommunicationState = <T>(blocksCommunicationState: BehaviorSubject<T>): void => {
    this.set('blocksCommunicationState$', blocksCommunicationState);
  }
}

export function create<T extends ArteryEngine.BaseBlocksCommunicationState>(stateValue: ArteryEngine.EngineState<T>): Store<T> {
  return new Store<T>(stateValue);
}

