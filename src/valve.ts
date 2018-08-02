/* tslint:disable no-any no-unsafe-any
 * no-object-literal-type-assertion */

import {
  ValveCompositeSink,
  ValveCompositeSource,
  ValveCompositeThrough,
  ValveError,
  ValveSink,
  ValveSinkFactory,
  ValveSource,
  ValveSourceFactory,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

import { assign, map, reduceRight } from 'lodash'

export function valve<P, E = ValveError>(A1: ValveCompositeSink<P, E>): ValveSinkFactory<P, E>

// Source -> ...Through -> Sink

export function valve<P, E = ValveError>(A1: ValveCompositeSource<P, E>): ValveSourceFactory<P, E>

export function valve<P1, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  RR: ValveCompositeSink<P1, E>
): void

export function valve<P1, P2, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  RR: ValveCompositeSink<P2, E>
): void

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  RR: ValveCompositeSink<P3, E>
): void

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  RR: ValveCompositeSink<P4, E>
): void

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  RR: ValveCompositeSink<P5, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>,
  RR: ValveCompositeSink<P6, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>,
  A7: ValveCompositeThrough<P6, P7, E>,
  RR: ValveCompositeSink<P7, E>
): void

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>,
  A7: ValveCompositeThrough<P6, P7, E>,
  A8: ValveCompositeThrough<P6, P8, E>,
  RR: ValveCompositeSink<P8, E>
): void

// ...Through -> Sink

export function valve<P1, P2, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeSink<P2, E>
): ValveSinkFactory<P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeSink<P3, E>
): ValveSinkFactory<P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeSink<P4, E>
): ValveSinkFactory<P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeSink<P5, E>
): ValveSinkFactory<P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>,
  A6: ValveCompositeSink<P6, E>
): ValveSinkFactory<P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>,
  A6: ValveCompositeThrough<P6, P7, E>,
  A7: ValveCompositeSink<P7, E>
): ValveSinkFactory<P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>,
  A6: ValveCompositeThrough<P6, P7, E>,
  A7: ValveCompositeThrough<P7, P8, E>,
  A8: ValveCompositeSink<P8, E>
): ValveSinkFactory<P8, E>

// Source -> ...Through (TODO: finish this)

export function valve<P1, P2, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>
): ValveSourceFactory<P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>
): ValveSourceFactory<P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>
): ValveSourceFactory<P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>
): ValveSourceFactory<P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>
): ValveSourceFactory<P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>,
  A7: ValveCompositeThrough<P6, P7, E>
): ValveSourceFactory<P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveCompositeSource<P1, E>,
  A2: ValveCompositeThrough<P1, P2, E>,
  A3: ValveCompositeThrough<P2, P3, E>,
  A4: ValveCompositeThrough<P3, P4, E>,
  A5: ValveCompositeThrough<P4, P5, E>,
  A6: ValveCompositeThrough<P5, P6, E>,
  A7: ValveCompositeThrough<P6, P7, E>,
  A8: ValveCompositeThrough<P7, P8, E>
): ValveSourceFactory<P8, E>

// ...Through

export function valve<P1, P2, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>
): ValveThroughFactory<P1, P2, E>

export function valve<P1, P2, P3, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>
): ValveThroughFactory<P1, P3, E>

export function valve<P1, P2, P3, P4, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>
): ValveThroughFactory<P1, P4, E>

export function valve<P1, P2, P3, P4, P5, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>
): ValveThroughFactory<P1, P5, E>

export function valve<P1, P2, P3, P4, P5, P6, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>
): ValveThroughFactory<P1, P6, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>,
  A6: ValveCompositeThrough<P6, P7, E>
): ValveThroughFactory<P1, P7, E>

export function valve<P1, P2, P3, P4, P5, P6, P7, P8, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, E>,
  A2: ValveCompositeThrough<P2, P3, E>,
  A3: ValveCompositeThrough<P3, P4, E>,
  A4: ValveCompositeThrough<P4, P5, E>,
  A5: ValveCompositeThrough<P5, P6, E>,
  A6: ValveCompositeThrough<P6, P7, E>,
  A7: ValveCompositeThrough<P7, P8, E>
): ValveThroughFactory<P1, P8, E>

export function valve<E = ValveError>(
  ...props: Array<ValveCompositeThrough<any, any, E>>
): ValveThroughFactory<any, any, E>

export function valve<E = ValveError>(
  A1: ValveCompositeSource<any, E>,
  ...props: Array<ValveCompositeThrough<any, any, E>>
): ValveSourceFactory<any, E>

export function valve<E = ValveError>(
  A1: ValveCompositeSource<any, E>,
  A2: ValveCompositeSink<any, E>
): void

export function valve<E = ValveError>(
  ...props: Array<
    ValveCompositeSink<any, E> | ValveCompositeSource<any, E> | ValveCompositeThrough<any, any, E>
  >
): void | ValveSourceFactory<any, E> | ValveSinkFactory<any, E> | ValveThroughFactory<any, any, E> {
  // TODO: 0 / 1 arguments
  if (props.length === 0) {
    return
  }

  const first = props[0]
  const last = props[props.length - 1]

  const compose = (fns: any[]) => reduceRight(fns, (f, g) => (...args: any[]) => f(g(...args)))

  if (props.length === 1) {
    return
  } else if (first.type === ValveType.Source) {
    // last is a sink, or a through
    // source -> sink = void
    // source -> through = source
    // source -> source = never
    props.shift()

    if (last.type === ValveType.Sink) {
      // source -> sink = void

      return compose(map(props, f => f(/* configuration */)))(first(/* configuration */))
    } else {
      // TODO: source -> through = source

      // return compose(map(props, f => f(#<{(| configuration |)}>#)))(first(#<{(| configuration |)}>#))
      return assign<() => ValveSource<any, E>, { type: ValveType.Source }>(
        () =>
          /* configuration */ compose(map(props, f => f(/* configuration */)))(
            first(/* configuration */)
          ),
        { type: ValveType.Source }
      )
    }
  } else {
    // first is a sink, or a through
    // sink -> through = never
    // sink -> sink = never
    // through -> sink = sink
    // through -> through = through

    if (last.type === ValveType.Sink) {
      // TODO: through -> sink = sink

      return assign<() => ValveSink<any, E>, { type: ValveType.Sink }>(
        () => /* configuration */ compose(map(props, f => f(/* configuration */))),
        { type: ValveType.Sink }
      )
    } else {
      // through -> through = through

      return assign<() => ValveThrough<any, any, E>, { type: ValveType.Through }>(
        () => /* configuration */ compose(map(props, f => f(/* configuration */))),
        { type: ValveType.Through }
      )
    }
  }
}

// const compose = (fns) => fns.reduceRight((f, g) => (...args) => f(g(...args)))
// // const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
//
// if (first.type === ValveType.Sink || ValveType.Through) {
//   // This returns a sink or a thtrough
//   return compose(
//     map(props, f => f())
//   )
// } else {
//   props.shift()
//
//   return compose(
//     map(props, f => f())
//   )
// }

// console.log(

// )

// return compose(map(props, f => f()))

// if (first.type === ValveType.Sink || first.type === ValveType.Through) {
//   let trigger: boolean = false
//
//   return assign<{ type: ValveType.Sink | ValveType.Through }, any>(
//     { type: first.type },
//     () => ({
//       sink(source: ValveSource<any, E>) {
//         if (trigger === true) {
//           throw new TypeError('partial sink should only be called once!')
//         }
//
//         trigger = true
//
//         props.unshift(source)
//
//         return valve.apply(null, props)
//       }
//     })
//   ) as ValveSinkFactory<any, E> | ValveThroughFactory<any, any, E>
// }
//
// let read: void | ValveSource<any, E> = first
//
// forEach(props, stream => {
//   if (
//     (stream.type === ValveType.Sink || stream.type === ValveType.Through) &&
//     // tslint:disable-next-line strict-boolean-expressions
//     read
//   ) {
//     read = stream.sink(read)
//   }
// })
//
// return read
