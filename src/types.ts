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

export type ValveSourceAction<P, E> =
  | ValveActionAbort
  | ValveActionData<P>
  | ValveActionError<E>
  | ValveActionNoop

export type ValveSinkAction<E> =
  | ValveActionAbort
  | ValveActionError<E>
  | ValveActionPull

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
