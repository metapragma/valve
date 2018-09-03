// export interface Morphism<A, B> {
//   f: (_: A) => B
//   left: <C>(f: Morphism<C, A>) => Morphism<C, B>
//   right: <C>(f: Morphism<B, C>) => Morphism<A, C>
// }
/* Observable */

export interface Subscription {
  // Cancels the subscription
  unsubscribe(): void

  // // A boolean value indicating whether the subscription is closed
  // readonly closed() : Boolean;
}

export interface Observer<P, E> {
  next?(value: P): void
  error?(errorValue: E): void
  complete?(): void
}

export interface Observable<P, E> {
  // Returns itself
  [Symbol.observable](): Observable<P, E>

  // Subscribes to the sequence with an observer
  subscribe(observer: Observer<P, E>): Subscription
}

/* Enums */

export enum ValveMessageType {
  Pull = 1,
  Next = 2,
  Noop = 3,
  Complete = 4,
  Error = 5
}

export enum ValveType {
  Source,
  Sink,
  Through,
  Stream
}

/* Messages */

export type ValveSinkMessage =
  | ValveMessageType.Complete
  | ValveMessageType.Error
  | ValveMessageType.Pull

export type ValveSourceMessage<
  SA = ValveSinkMessage
> = SA extends ValveMessageType.Complete
  ? ValveMessageType.Complete
  : SA extends ValveMessageType.Error
    ? ValveMessageType.Error
    : (
        | ValveMessageType.Complete
        | ValveMessageType.Next
        | ValveMessageType.Error
        | ValveMessageType.Noop)

/* Actions */

export interface ValveActionGeneric<E> {
  complete(): void
  error(errorValue: E): void
}

export interface ValveActionPull<E> extends ValveActionGeneric<E> {
  pull(): void
}

export interface ValveActionNext<T, E> extends ValveActionGeneric<E> {
  next(value: T): void
}

export interface ValveActionNoop<T, E> extends ValveActionNext<T, E> {
  noop(): void
}

/* Primitive Abstractions */

export type ValveError = unknown

export type ValveCallback<P, E, SA = ValveSinkMessage> = (
  message: SA,
  value?: SA extends ValveMessageType.Next
    ? P
    : SA extends ValveMessageType.Error ? E : undefined
) => void

export interface ValvePrimitiveStream<R, E> extends Observable<R, E> {
  schedule(scheduler?: (tick: () => boolean) => void): void
}

export type ValveSink<P, R, E> = (
  source: ValveSource<P, E>
) => ValvePrimitiveStream<R, E>

export type ValveSource<
  P,
  E,
  SA extends ValveSourceMessage = ValveSourceMessage
> = (
  cb: ValveCallback<P, E, ValveSourceMessage>
) => (
  message: ValveSinkMessage,
  value: SA extends ValveMessageType.Error ? E : undefined
) => void

export type ValveThrough<P, R, E> = (
  source: ValveSource<P, E>
) => ValveSource<R, E>

/* Factories */

export interface ValveSinkFactory<P, R, S, E> {
  type: ValveType.Sink
  pipe(props?: S): ValveSink<P, R, E>
}

export interface ValveSourceFactory<P, S, E> {
  type: ValveType.Source
  pipe(props?: S): ValveSource<P, E>
}

export interface ValveThroughFactory<P, R, S, E> {
  type: ValveType.Through
  pipe(props?: S): ValveThrough<P, R, E>
}

export type ValveCompositeSource<P, S, E> = ValveSourceFactory<P, S, E>
export type ValveCompositeSink<P, R, S, E> = ValveSinkFactory<P, R, S, E>
export type ValveCompositeThrough<P, R, S, E> = ValveThroughFactory<P, R, S, E>

/* Streams */

// export interface ValveGenericStream<R, E> {
//   type:
// }

export interface ValveStream<R, S, E> extends ValvePrimitiveStream<R, E> {
  getState?: S
}

// TODO: composable instrumentation
export type ValveScheduler = <R, S, E>(
  stream: ValveStream<R, S, E>
) => Observable<R, E>

export type ValveStateComposite<A> = A
// tslint:disable-next-line no-any
export type ValveState = any

export type ValveHandlerNoopPull<T, E> = (
  actions: ValveActionNoop<T, E>
) => Partial<ValveActionPull<E>>

export type ValveHandlerNoopNoop<T, R, E> = (
  actions: ValveActionNoop<R, E>
) => Partial<ValveActionNoop<T, E>>

export type ValveHandlerPullPull<E> = (
  actions: ValveActionPull<E>
) => Partial<ValveActionPull<E>>

export type ValveHandlerNextNext<T, R, E> = (
  actions: ValveActionNext<R, E>,
  terminate: ValveActionGeneric<E>
) => Partial<ValveActionNext<T, E>>
