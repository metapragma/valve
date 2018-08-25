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
  Complete,
  Next,
  Error,
  Noop,
  Pull
}

export enum ValveType {
  Source,
  Sink,
  Through
}

/* Messages */

export interface ValveMessageGeneric {
  type: ValveMessageType
}

export interface ValveMessagePull extends ValveMessageGeneric {
  type: ValveMessageType.Pull
}

export interface ValveMessageNext<P> extends ValveMessageGeneric {
  type: ValveMessageType.Next
  payload: P
}

export interface ValveMessageError<E> extends ValveMessageGeneric {
  type: ValveMessageType.Error
  payload: E
}

export interface ValveMessageComplete extends ValveMessageGeneric {
  type: ValveMessageType.Complete
}

export interface ValveMessageNoop extends ValveMessageGeneric {
  type: ValveMessageType.Noop
}

export type ValveMessage<P, E> =
  | ValveMessageComplete
  | ValveMessageNext<P>
  | ValveMessageError<E>
  | ValveMessageNoop
  | ValveMessagePull

export type ValveSinkMessage<E> =
  | ValveMessageComplete
  | ValveMessageError<E>
  | ValveMessagePull

export type ValveSourceMessage<
  P,
  E,
  SA = ValveSinkMessage<E>
> = SA extends ValveMessageComplete
  ? ValveMessageComplete
  : SA extends ValveMessageError<E>
    ? ValveMessageError<E>
    : (
        | ValveMessageComplete
        | ValveMessageNext<P>
        | ValveMessageError<E>
        | ValveMessageNoop)

/* Actions */

export interface ValveGenericAction<E> {
  complete(): void
  error(errorValue: E): void
}

export interface ValvePullAction<E> extends ValveGenericAction<E> {
  pull(): void
}

export interface ValveNextAction<T, E> extends ValveGenericAction<E> {
  next(value: T): void
}

export interface ValveNoopAction<T, E> extends ValveNextAction<T, E> {
  noop(): void
}

/* Primitive Abstractions */

export type ValveError = unknown

export type ValveCallback<P, E, SA = ValveSinkMessage<E>> = (
  action: ValveSourceMessage<P, E, SA>
) => void

export interface ValvePrimitiveStream<R, E> extends Observable<R, E> {
  schedule(scheduler?: (tick: () => boolean) => void): void
}

export type ValveSink<P, R, E> = (
  source: ValveSource<P, E>
) => ValvePrimitiveStream<R, E>

export type ValveSource<P, E> = (
  action: ValveSinkMessage<E>,
  cb: ValveCallback<P, E>
) => void

export type ValveThrough<P, R, E> = (
  source: ValveSource<P, E>
) => ValveSource<R, E>

/* Factories */

export interface ValveSinkFactory<P, R, S, E> {
  type: ValveType.Sink
  (props?: S): ValveSink<P, R, E>
}

export interface ValveSourceFactory<P, S, E> {
  type: ValveType.Source
  (props?: S): ValveSource<P, E>
}

export interface ValveThroughFactory<P, R, S, E> {
  type: ValveType.Through
  (props?: S): ValveThrough<P, R, E>
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
