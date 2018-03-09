// tslint:disable-next-line no-any
export type ValveError<E = any> = E

export enum ValveActionType {
  Pull,
  Data,
  Abort,
  Error
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

export type ValveAction<P, E> =
  | ValveActionData<P>
  | ValveActionError<E>
  | ValveActionAbort
  | ValveActionPull

export type ValveSourceAction<P, E> =
  | ValveActionData<P>
  | ValveActionError<E>
  | ValveActionAbort
export type ValveSinkAction<E> =
  | ValveActionPull
  | ValveActionError<E>
  | ValveActionAbort

export enum ValveType {
  Source,
  Sink,
  Through
}

export type ValveSourceCallback<P, E = ValveError> = (
  action: ValveSourceAction<P, E>
) => void

export type ValveSourceFunction<P, E = ValveError> = (
  action: ValveSinkAction<E>,
  cb: ValveSourceCallback<P, E>
) => void

export type ValveSinkFunction<P, E = ValveError> = (
  source: ValveSource<P, E>
) => void

export type ValveThroughFunction<P, R, E = ValveError> = (
  source: ValveSource<P, E>
) => ValveSource<R, E>

export interface ValveSink<P, E = ValveError> {
  type: ValveType.Sink
  sink: ValveSinkFunction<P, E>
  terminate: (action: ValveActionAbort | ValveActionError<E>) => void
}

export interface ValveSource<P, E = ValveError> {
  type: ValveType.Source
  source: ValveSourceFunction<P, E>
}

export interface ValveThrough<P, R, E = ValveError> {
  type: ValveType.Through
  sink: ValveThroughFunction<P, R, E>
  terminate: (action?: ValveActionAbort | ValveActionError<E>) => void
}

// Utilities

export interface ValveCreateSourceOptions<T, E = ValveError> {
  onAbort(action: ValveActionAbort, cb: ValveSourceCallback<T, E>): void
  onError(action: ValveActionError<E>, cb: ValveSourceCallback<T, E>): void
  onPull(action: ValveActionPull, cb: ValveSourceCallback<T, E>): void
}

export interface ValveCreateSinkOptions<T, E = ValveError> {
  onAbort(action: ValveActionAbort): void
  onError(action: ValveActionError<E>): void
  onData(action: ValveActionData<T>): void
}

export interface ValveCreateThroughOptions<T, R = T, E = ValveError> {
  onAbort(action: ValveActionAbort): void
  onError(action: ValveActionError<E>): void
  onData(
    action: ValveActionData<T>,
    cb: ValveSourceCallback<R, E>,
    source: ValveSource<T, E>
  ): void
}

// Sinks

export interface ValveReduceOptions<P, R> {
  accumulator?: R
  iteratee(accumulator: R, data: P): R
}

export interface ValveFindOptions<P> {
  predicate?(data: P): boolean
}

export type ValveDone<P, E> = (
  action: ValveActionData<P> | ValveActionError<E> | ValveActionAbort
) => void
