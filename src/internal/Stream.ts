import { Stream as S, ValveType } from '../types'
import { Observable } from './Observable'
import { Dispatcher } from './Dispatcher'

export class Stream<T, R, E> extends Observable<R, E> implements S<R, E> {
  public type: ValveType.Stream = ValveType.Stream

  private value: Dispatcher<T, E> | undefined

  constructor() {
    super()
  }

  public of(dispatcher: Dispatcher<T, E>) {
    this.value = dispatcher
  }

  public schedule() {
    if (this.value !== undefined) {
      this.value.nextTick()
    }
  }
}
