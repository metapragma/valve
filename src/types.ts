export type ValveError = unknown

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

export type ValveSinkAction<E> =
  | ValveActionAbort
  | ValveActionError<E>
  | ValveActionPull

export enum ValveType {
  Source,
  Sink,
  Through
}

export type ValveSourceAction<SA, P, E> = SA extends ValveActionAbort
  ? ValveActionAbort
  : SA extends ValveActionError<E>
    ? ValveActionError<E>
    : (
        | ValveActionAbort
        | ValveActionData<P>
        | ValveActionError<E>
        | ValveActionNoop)

export type ValveCallback<P, E, SA = ValveSinkAction<E>> = (
  action: ValveSourceAction<SA, P, E>
) => void

interface ValveReturn<P, E> {
  then<TResult1, TResult2 = E>(
    onfulfilled?:
      | ((value: P) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: E) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2>
  catch<TResult2>(
    onrejected?:
      | ((reason: E) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<P | TResult2>
}

export type ValveSink<P, E> = (source: ValveSource<P, E>) => void

export type ValveSource<P, E> = (
  action: ValveSinkAction<E>,
  cb: ValveCallback<P, E>
) => void

export type ValveThrough<P, R, E> = (
  source: ValveSource<P, E>
) => ValveSource<R, E>

// TODO: pass configuration
// TODO: pass back reference to internal state
// TODO: reconstruct a global state
// TODO: promise

export type ValveStateComposite<A> = A
// tslint:disable-next-line no-any
export type ValveState = any

export interface ValveSinkFactory<P, S, E> {
  type: ValveType.Sink
  (props?: S): ValveSink<P, E>
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
export type ValveCompositeSink<P, S, E> = ValveSinkFactory<P, S, E>
export type ValveCompositeThrough<P, R, S, E> = ValveThroughFactory<P, R, S, E>

// Utilities

export type ValveCallbackAbort = () => void
export type ValveCallbackData<P> = (data: P) => void
export type ValveCallbackError<E> = (error: E) => void
export type ValveCallbackNoop = () => void
export type ValveCallbackPull = () => void

export interface ValveSourceCallbacks<P, E> {
  abort: ValveCallbackAbort
  data: ValveCallbackData<P>
  error: ValveCallbackError<E>
  noop: ValveCallbackNoop
}

export interface ValveSinkCallbacks<E> {
  abort: ValveCallbackAbort
  error: ValveCallbackError<E>
  pull: ValveCallbackPull
}

export interface ValveCreateSourceOptions<E> {
  onAbort(): void
  onError(error: E): void
  onPull(): void
}

export interface ValveCreateSinkOptions<T, E> {
  onAbort(): void
  onError(error: E): void
  onData(data: T): void
}

// Sinks

export interface ValveReduceOptions<P, R> {
  accumulator?: R
  iteratee(accumulator: R, data: P): R
}

export interface ValveFindOptions<P> {
  predicate?(data: P): boolean
}
