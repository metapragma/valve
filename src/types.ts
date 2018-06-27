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

export interface ValveSink<P, E = ValveError> {
  type: ValveType.Sink
  sink: (source: ValveSource<P, E>) => void
  terminate: (action: ValveActionAbort | ValveActionError<E>) => void
}

export interface ValveSource<P, E = ValveError> {
  type: ValveType.Source
  source: (action: ValveSinkAction<E>, cb: ValveCallback<P, E>) => void
}

export interface ValveThrough<P, R, E = ValveError> {
  type: ValveType.Through
  sink: (source: ValveSource<P, E>) => ValveSource<R, E>
}

// Utilities

export interface ValveCreateSourceOptions<T, E = ValveError> {
  onAbort(action: ValveActionAbort, cb: ValveCallback<T, E, ValveActionAbort>): void
  onError(action: ValveActionError<E>, cb: ValveCallback<T, E, ValveActionError<E>>): void
  onPull(action: ValveActionPull, cb: ValveCallback<T, E, ValveActionPull>): void
}

export interface ValveCreateSinkOptions<T, E = ValveError> {
  onAbort(action: ValveActionAbort): void
  onError(action: ValveActionError<E>): void
  onData(action: ValveActionData<T>): void
}

export interface ValveCreateThroughOptions<T, R = T, E = ValveError> {
  onSourceAbort(action: ValveActionAbort, cb: ValveCallback<R, E>): void
  onSourceError(action: ValveActionError<E>, cb: ValveCallback<R, E>): void
  onSourceData(action: ValveActionData<T>, cb: ValveCallback<R, E>): void
  onSinkAbort(action: ValveActionAbort, cb: ValveCallback<R, E>, source: ValveSource<T, E>): void
  onSinkError(action: ValveActionError<E>, cb: ValveCallback<R, E>, source: ValveSource<T, E>): void
  onSinkPull(action: ValveActionPull, cb: ValveCallback<R, E>, source: ValveSource<T, E>): void
}

// Sinks

export interface ValveReduceOptions<P, R> {
  accumulator?: R
  iteratee(accumulator: R, data: P): R
}

export interface ValveFindOptions<P> {
  predicate?(data: P): boolean
}
