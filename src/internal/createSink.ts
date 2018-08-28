/* tslint:disable max-func-body-length */

import {
  ValveActionGeneric,
  ValveActionNext,
  ValveCallback,
  ValveError,
  ValveHandlerNextNext,
  ValveMessageType,
  ValveSink,
  ValveSinkFactory,
  ValveSinkMessage,
  ValveSource,
  ValveState,
  ValveType
} from '../types'

import { hasEnded } from './hasEnded'

import { normalizeNextNext } from './interface'
import { observableFactory } from './observable'
// import { sinkOperator } from './operator'

// type RecursiveFunction = () => RecursiveFunction | false

// const dumb = (fn: RecursiveFunction): void => {
//   while (fn() !== false) {}
// }

// const fanOutFactory = <T>(args: Array<T>) => (fn: (prop: T) => void) => {
//   switch (args.length) {
//     case 1: fn(args[0]) ; break
//     case 2: (fn(args[0]), fn(args[1])); break
//     case 3: (fn(args[0]), fn(args[1]), fn(args[2])); break
//     default:
//       forEach(args, fn)
//   }
// }

// tslint:disable-next-line completed-docs
class Dispatcher<T, E> {
  private actions: ValveActionNext<T, E>
  private callback: ValveCallback<T, E>
  private control: ValveActionGeneric<E>
  private hasResponded = false
  private loop = true
  private message: ValveSinkMessage = ValveMessageType.Pull
  private messageValue: E | undefined

  constructor(
    source: ValveSource<T, E>,
    normalize: (actions: ValveActionGeneric<E>) => ValveActionNext<T, E>
  ) {
    this.control = {
      complete: () => {
        this.message = hasEnded(this.message)
          ? this.message
          : ValveMessageType.Complete
      },
      error: (error: E) => {
        if (!hasEnded(this.message)) {
          this.message = ValveMessageType.Error
          this.messageValue = error
        }
      }
    }
    this.actions = normalize(this.control)
    this.callback = source((message, value) => {
      this.hasResponded = true

      switch (message) {
        case ValveMessageType.Next: {
          this.next(value as T)

          break
        }
        case ValveMessageType.Noop: {
          break
        }
        case ValveMessageType.Complete: {
          this.complete()

          break
        }
        case ValveMessageType.Error: {
          this.error(value as E)
        }
      }
    })
  }

  public nextTick() {
    // this function is much simpler to write if you just use recursion,
    // but by using a while loop we do not blow the stack if the stream
    // happens to be sync.

    this.loop = true
    this.hasResponded = false

    // tslint:disable-next-line no-empty
    while (this.tick() !== false) {}
  }

  public error(errorValue: E) {
    // this.hasResponded = true
    this.loop = false

    this.actions.error(errorValue)
    this.control.error(errorValue)
  }

  public complete() {
    // this.hasResponded = true
    this.loop = false

    this.actions.complete()
    this.control.complete()
  }

  public next(value: T) {
    // this.hasResponded = true
    this.actions.next(value)

    if (!this.loop) {
      // tslint:disable-next-line no-use-before-declare
      this.nextTick()
    }
  }

  private tick() {
    this.hasResponded = false

    this.callback(this.message, this.messageValue)

    // loop = hasResponded
    if (!this.hasResponded) {
      this.loop = false
    }

    return this.loop ? this.tick : false
  }
}

const createSinkPipeline = <T, R, E>(
  handler: ValveHandlerNextNext<T, R, E>
): ValveSink<T, R, E> => {
  const { observer, observable } = observableFactory<R, E>()
  const normalize = normalizeNextNext(handler, observer)

  return source => {
    const dispatcher = new Dispatcher(source, normalize)

    return {
      schedule() {
        dispatcher.nextTick()
      },
      ...observable
    }
  }
}

export const createSink = <
  T,
  R,
  S = ValveState,
  E extends ValveError = ValveError
>(
  handler: ValveHandlerNextNext<T, R, E> = () => ({})
): ValveSinkFactory<T, R, S, E> => {
  return {
    pipe() {
      return createSinkPipeline(handler)
    },
    type: ValveType.Sink
  }
}
