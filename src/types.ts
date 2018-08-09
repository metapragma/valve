// tslint:disable-next-line no-any
export type ValveError<E = any> = E

export enum ValveActionType {
  Abort,
  Data,
  Error,
  Noop,
  Pull
}

export interface ValveActionGeneric {
  type: ValveActionType
}

export interface ValveActionPull extends ValveActionGeneric {
  type: ValveActionType.Pull
}

export interface ValveActionData<P> extends ValveActionGeneric {
  type: ValveActionType.Data
  payload: P
}

export interface ValveActionError<E> extends ValveActionGeneric {
  type: ValveActionType.Error
  payload: E
}

export interface ValveActionAbort extends ValveActionGeneric {
  type: ValveActionType.Abort
}

export interface ValveActionNoop extends ValveActionGeneric {
  type: ValveActionType.Noop
}

export type ValveAction<P, E> =
  | ValveActionAbort
  | ValveActionData<P>
  | ValveActionError<E>
  | ValveActionNoop
  | ValveActionPull

export type ValveSinkAction<E> = ValveActionAbort | ValveActionError<E> | ValveActionPull

export enum ValveType {
  Source,
  Sink,
  Through
}

export type ValveSourceAction<SA, P, E> = SA extends ValveActionAbort
  ? ValveActionAbort
  : SA extends ValveActionError<E>
    ? ValveActionError<E>
    : (ValveActionAbort | ValveActionData<P> | ValveActionError<E> | ValveActionNoop)

export type ValveCallback<P, E = ValveError, SA = ValveSinkAction<E>> = (
  action: ValveSourceAction<SA, P, E>
) => void

export type ValveSink<P, E = ValveError> = (source: ValveSource<P, E>) => void

export type ValveSource<P, E = ValveError> = (
  action: ValveSinkAction<E>,
  cb: ValveCallback<P, E>
) => void

export type ValveThrough<P, R, E = ValveError> = (source: ValveSource<P, E>) => ValveSource<R, E>

// TODO: pass configuration
// TODO: pass back reference to internal state
// TODO: reconstruct a global state
// TODO: ui change to abort() error() data() noop() and pool()
// TODO: promise

export type ValveStateComposite<A> = A
// tslint:disable-next-line no-any
export type ValveState = any

export interface ValveSinkFactory<P, S, E = ValveError> {
  type: ValveType.Sink
  (props?: S): ValveSink<P, E>
}

export interface ValveSourceFactory<P, S, E = ValveError> {
  type: ValveType.Source
  (props?: S): ValveSource<P, E>
}

export interface ValveThroughFactory<P, R, S, E = ValveError> {
  type: ValveType.Through
  (props?: S): ValveThrough<P, R, E>
}

export type ValveCompositeSource<P, S, E = ValveError> = ValveSourceFactory<P, S, E>
export type ValveCompositeSink<P, S, E = ValveError> = ValveSinkFactory<P, S, E>
export type ValveCompositeThrough<P, R, S, E = ValveError> = ValveThroughFactory<P, R, S, E>

// Utilities

export type ValveCallbackAbort = () => void
export type ValveCallbackData<P> = (data: P) => void
export type ValveCallbackError<E = ValveError> = (error: E) => void
export type ValveCallbackNoop = () => void
export type ValveCallbackPull = () => void

export interface ValveSourceCallbacks<P, E = ValveError> {
  abort: ValveCallbackAbort
  data: ValveCallbackData<P>
  error: ValveCallbackError<E>
  noop: ValveCallbackNoop
}

export interface ValveSinkCallbacks<E = ValveError> {
  abort: ValveCallbackAbort
  error: ValveCallbackError<E>
  pull: ValveCallbackPull
}

export interface ValveCreateSourceOptions<E = ValveError> {
  onAbort(): void
  onError(error: E): void
  onPull(): void
}

export interface ValveCreateSinkOptions<T, E = ValveError> {
  onAbort(): void
  onError(error: E): void
  onData(data: T): void
}

// export interface ValveCreateThroughSourceOptions<T, R = T, E = ValveError> {
//   onAbort(props: ValveSourceCallbacks<R, E>): void
//   onError(error: E): void
//   onData(data: T): void
// }
//
// export interface ValveCreateThroughSinkOptions<E = ValveError> {
//   onAbort(): void
//   onError(error: E): void
//   onPull(): void
// }

// Sinks

export interface ValveReduceOptions<P, R> {
  accumulator?: R
  iteratee(accumulator: R, data: P): R
}

export interface ValveFindOptions<P> {
  predicate?(data: P): boolean
}
