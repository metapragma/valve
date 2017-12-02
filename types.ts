export type ValveError<E = Error> = null | E
export type ValveAbort<E = Error> = true | ValveError<E>

export type ValveCallback<P, E = Error> =
  (abort: ValveAbort<E>, data?: P) => void

export enum ValveType {
  Source,
  Sink,
  Through
}

export type ValveSourceFunction<P, E = Error> =
  (abort: ValveAbort<E>, cb: ValveCallback<P, E>) => void

export type ValveAbortFunction<P, E> =
  (err?: ValveAbort<E>, cb?: ValveCallback<P, E>) => void

export interface ValveSinkFunction<P, E = Error> {
  (source: ValveSource<P, E>): void
  abort?: ValveAbortFunction<P, E>
}

export interface ValveThroughFunction<P, R, E = Error> {
  (source: ValveSource<P, E>): ValveSource<R, E> 
  abort?: ValveAbortFunction<P, E>
}

export interface ValveSink<P, E = Error> {
  type: ValveType.Sink
  sink: ValveSinkFunction<P, E>
}

export interface ValveSource<P, E = Error> {
  type: ValveType.Source
  source: ValveSourceFunction<P, E>
}

export interface ValveThrough<P, R, E = Error> {
  type: ValveType.Through
  sink: ValveThroughFunction<P, R, E>
}
