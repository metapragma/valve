export type ValveError = unknown

export enum ValveMessageType {
  Complete,
  Next,
  Error,
  Noop,
  Pull
}

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

export enum ValveType {
  Source,
  Sink,
  Through
}

export type ValveSourceMessage<SA, P, E> = SA extends ValveMessageComplete
  ? ValveMessageComplete
  : SA extends ValveMessageError<E>
    ? ValveMessageError<E>
    : (
        | ValveMessageComplete
        | ValveMessageNext<P>
        | ValveMessageError<E>
        | ValveMessageNoop)

export type ValveCallback<P, E, SA = ValveSinkMessage<E>> = (
  action: ValveSourceMessage<SA, P, E>
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
  action: ValveSinkMessage<E>,
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

export type ValveActionComplete = () => void
export type ValveActionNext<P> = (next: P) => void
export type ValveActionError<E> = (error: E) => void
export type ValveActionNoop = () => void
export type ValveActionPull = () => void

export interface ValveSourceAction<P, E> {
  complete: ValveActionComplete
  next: ValveActionNext<P>
  error: ValveActionError<E>
  noop: ValveActionNoop
}

export interface ValveSinkAction<E> {
  complete: ValveActionComplete
  error: ValveActionError<E>
  pull: ValveActionPull
}

export interface ValveCreateSourceOptions<E> {
  complete(): void
  error(error: E): void
  pull(): void
}

export interface ValveCreateSinkOptions<T, E> {
  complete(): void
  error(error: E): void
  next(next: T): void
}

// Sinks

export interface ValveReduceOptions<P, R> {
  accumulator?: R
  iteratee(accumulator: R, next: P): R
}

export interface ValveFindOptions<P> {
  predicate?(next: P): boolean
}
