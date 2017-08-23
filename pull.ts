/* tslint:disable no-any */

import {
  StreamSink,
  StreamSource,
  StreamThrough
} from './types'

// TODO: pull detects if it's missing a Source by checking function arity, if
// the function takes only one argument it's either a sink or a through.
// Otherwise it's a Source.

export function isSink <P, E> (
  stream: StreamSink<P, E> | StreamSource<P, E>
): stream is StreamSink<P, E> {
  return (typeof stream === 'function' && stream.length === 1)
}

// Source -> ...Through

export function pull <P1, P2, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>
): StreamSource<P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>
): StreamSource<P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>
): StreamSource<P4, E>

// TODO: finish this

// Source -> ...Through -> Sink

export function pull <P1, P2, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  RR: StreamSink<P2, E>,
): void

export function pull <P1, P2, P3, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  RR: StreamSink<P3, E>,
): void

export function pull <P1, P2, P3, P4, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>,
  RR: StreamSink<P4, E>,
): void

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>,
  A5: StreamThrough<P4, P5, E>,
  RR: StreamSink<P5, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>,
  A5: StreamThrough<P4, P5, E>,
  A6: StreamThrough<P5, P6, E>,
  RR: StreamSink<P6, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>,
  A5: StreamThrough<P4, P5, E>,
  A6: StreamThrough<P5, P6, E>,
  A7: StreamThrough<P6, P7, E>,
  RR: StreamSink<P7, E>,
): void

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: StreamSource<P1, E>,
  A2: StreamThrough<P1, P2, E>,
  A3: StreamThrough<P2, P3, E>,
  A4: StreamThrough<P3, P4, E>,
  A5: StreamThrough<P4, P5, E>,
  A6: StreamThrough<P5, P6, E>,
  A7: StreamThrough<P6, P7, E>,
  A8: StreamThrough<P6, P8, E>,
  RR: StreamSink<P8, E>,
): void

// ...Through

export function pull <P1, P2, E = Error>(
  A1: StreamThrough<P1, P2, E>
): StreamThrough<P1, P2, E>

export function pull <P1, P2, P3, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>
): StreamThrough<P1, P3, E>

export function pull <P1, P2, P3, P4, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>,
  A3: StreamThrough<P3, P4, E>
): StreamThrough<P1, P4, E>

export function pull <P1, P2, P3, P4, P5, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>,
  A3: StreamThrough<P3, P4, E>,
  A4: StreamThrough<P4, P5, E>
): StreamThrough<P1, P5, E>

export function pull <P1, P2, P3, P4, P5, P6, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>,
  A3: StreamThrough<P3, P4, E>,
  A4: StreamThrough<P4, P5, E>,
  A5: StreamThrough<P5, P6, E>
): StreamThrough<P1, P6, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>,
  A3: StreamThrough<P3, P4, E>,
  A4: StreamThrough<P4, P5, E>,
  A5: StreamThrough<P5, P6, E>,
  A6: StreamThrough<P6, P7, E>
): StreamThrough<P1, P7, E>

export function pull <P1, P2, P3, P4, P5, P6, P7, P8, E = Error>(
  A1: StreamThrough<P1, P2, E>,
  A2: StreamThrough<P2, P3, E>,
  A3: StreamThrough<P3, P4, E>,
  A4: StreamThrough<P4, P5, E>,
  A5: StreamThrough<P5, P6, E>,
  A6: StreamThrough<P6, P7, E>,
  A7: StreamThrough<P7, P8, E>
): StreamThrough<P1, P8, E>

// ---

export function pull <P, E = Error>(
  A1: StreamSource<P, E>,
  RR: StreamSink<P, E>
): void

export function pull <P, E = Error>(
  A1: StreamSource<P, E>
): StreamSource<P, E>

export function pull <P, E = Error>(
  A1: StreamSink<P, E>,
): StreamSink<P, E>

// TODO: Duplex
// TODO: Prioritize common case of small number of pulls

export function pull <E = Error>(
  ...props: Array<StreamSink<any, E> | StreamSource<any, E>>
): void | StreamSource<any, E> | StreamSink<any, E> {
  const length = props.length
  const a: StreamSource<any, E> | StreamSink<any, E> = props[0]

  if (isSink(a)) {
    // tslint:disable-next-line no-shadowed-variable
    return (read: StreamSource<any, E>) => {
      if (props == null) {
        throw new TypeError('partial sink should only be called once!')
      }

      // Grab the reference after the check, because it's always an array now
      // (engines like that kind of consistency).
      const ref = props
      props = null

      // Prioritize common case of small number of pulls.
      // switch (length) {
      //   case 1:
      //     return pull(read, ref[0])
      //   case 2:
      //     return pull(read, ref[0], ref[1])
      //   case 3:
      //     return pull(read, ref[0], ref[1], ref[2])
      //   case 4:
      //     return pull(read, ref[0], ref[1], ref[2], ref[3])
      //   default:
      //     ref.unshift(read)
      //
      //     return pull.apply(null, ref)
      // }
      ref.unshift(read)

      return pull.apply(null, ref)
    }
  }

  let read: void | StreamSource<any, E> = a

  // if (read && typeof read.source === 'function') {
  //   read = read.source
  // }

  // tslint:disable-next-line no-increment-decrement
  for (let i = 1; i < length; i++) {
    const s = props[i]
    if (isSink(s) && read) {
      read = s(read)
    }
    // else if (s && typeof s === 'object') {
    //   s.sink(read)
    //   read = s.source
    // }
  }

  return read
}
