export type StreamAbort<E = Error> = boolean | void | E

export type StreamCallback<P, E = Error> =
  (abort: StreamAbort<E>, data?: P) => void

export type StreamSource<P, E = Error> =
  (abort: StreamAbort<E>, cb: StreamCallback<P, E>) => void

export type StreamSinkAbort<P, E> =
  (err?: StreamAbort<E>, cb?: StreamCallback<P, E>) => void

export interface StreamSink<P, E = Error> {
  (source: IStreamSource<P, E>): void
  abort?: StreamSinkAbort<P, E>
}

export interface StreamThrough<P, R, E = Error> {
  (source: IStreamSource<P, E>): IStreamSource<R, E> 
  abort?: StreamSinkAbort<P, E>
}

export enum StreamType {
  Source,
  Sink,
  Through
}

export interface IStreamSink<P, E = Error> {
  type: StreamType.Sink
  sink: StreamSink<P, E>
}

export interface IStreamSource<P, E = Error> {
  type: StreamType.Source
  source: StreamSource<P, E>
}

export interface IStreamThrough<P, R, E = Error> {
  type: StreamType.Through
  sink: StreamThrough<P, R, E>
}
