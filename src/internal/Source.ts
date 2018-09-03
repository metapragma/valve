import {
  ValveError,
  ValveHandlerNoopPull,
  ValveSource,
  ValveSourceFactory,
  ValveState,
  ValveType
} from '../types'

import { normalizeNoopPull, sourceActionsFactory } from './interface'
import { sourceOperator } from './operator'

// export interface Morphism<A, B> {
//   f: (_: A) => B
//   left: <C>(f: Morphism<C, A>) => Morphism<C, B>
//   right: <C>(f: Morphism<B, C>) => Morphism<A, C>
// }

export class Source<T, S = ValveState, E extends ValveError = ValveError>
  implements ValveSourceFactory<T, S, E> {
  public type: ValveType.Source = ValveType.Source

  private value: ValveSource<T, E>

  // tslint:disable-next-line function-name
  public static of<_T, _S = ValveState, _E extends ValveError = ValveError>(
    handler?: ValveHandlerNoopPull<_T, _E>
  ) {
    return new Source<_T, _S, _E>(cb =>
      sourceOperator(normalizeNoopPull(handler, sourceActionsFactory(cb)))
    )
  }

  constructor(value: ValveSource<T, E>) {
    this.value = value
  }

  public pipe(_?: S) {
    return this.value
  }
}
