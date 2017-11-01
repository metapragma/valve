export type StreamAbort<E = Error> = boolean | void | E

export type StreamCallback<P, E = Error> =
  (abort: StreamAbort<E>, data?: P) => void

export type StreamSource<P, E = Error> =
  (abort: StreamAbort<E>, cb: StreamCallback<P, E>) => void

export type StreamSinkAbort<P, E> =
  (err?: StreamAbort<E>, cb?: StreamCallback<P, E>) => void

export interface StreamSink<P, E = Error> {
  (source: StreamSource<P, E>): void
  abort?: StreamSinkAbort<P, E>
}

export interface StreamThrough<P, R, E = Error> {
  (source: StreamSource<P, E>): (abort: StreamAbort<E>, cb: StreamCallback<R, E>) => void
}