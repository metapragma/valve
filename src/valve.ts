/* tslint:disable no-any no-unsafe-any
 * no-object-literal-type-assertion */

import {
  ValveCompositeSink,
  ValveCompositeSource,
  ValveCompositeThrough,
  ValveError,
  ValveSinkFactory,
  ValveSourceFactory,
  ValveStateComposite,
  ValveStream,
  ValveThroughFactory,
  ValveType
} from './types'

import { Source } from './internal/Source'

import { Through } from './internal/Through'

import { Sink } from './internal/Sink'

import { map, reduceRight } from 'lodash'

const composition = (f: ValveType, l: ValveType): ValveType | null => {
  if (f === ValveType.Source) {
    if (l === ValveType.Sink) {
      return ValveType.Stream
    } else {
      return ValveType.Source
    }
  } else if (l === ValveType.Sink) {
    return ValveType.Sink
  } else if (l === ValveType.Through) {
    return ValveType.Through
  }

  return null
}

const _compose = (fns: any[]) =>
  reduceRight(fns, (f, g) => (...args: any[]) => f(g(...args)))

// tslint:disable-next-line max-func-body-length
export function valve<ERR = ValveError>() {
  /* Source -> Through... -> Sink */

  function compose<P1, P2, S1, S2, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeSink<P1, P2, S2, E>
  ): ValveStream<P2, ValveStateComposite<[S1, S2]>, E>
  function compose<P1, P2, P3, S1, S2, S3, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeSink<P2, P3, S3, E>
  ): ValveStream<P3, ValveStateComposite<[S1, S2, S3]>, E>
  function compose<P1, P2, P3, P4, S1, S2, S3, S4, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeSink<P3, P4, S4, E>
  ): ValveStream<P4, ValveStateComposite<[S1, S2, S3, S4]>, E>
  function compose<P1, P2, P3, P4, P5, S1, S2, S3, S4, S5, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeSink<P4, P5, S5, E>
  ): ValveStream<P5, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeSink<P5, P6, S6, E>
  ): ValveStream<P6, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeSink<P6, P7, S7, E>
  ): ValveStream<P7, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeSink<P7, P8, S8, E>
  ): ValveStream<P8, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeSink<P8, P9, S9, E>
  ): ValveStream<
    P9,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeSink<P9, P10, S10, E>
  ): ValveStream<
    P10,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeSink<P10, P11, S11, E>
  ): ValveStream<
    P11,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeSink<P11, P12, S12, E>
  ): ValveStream<
    P12,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeSink<P12, P13, S13, E>
  ): ValveStream<
    P13,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeSink<P13, P14, S14, E>
  ): ValveStream<
    P14,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeSink<P14, P15, S15, E>
  ): ValveStream<
    P15,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeThrough<P14, P15, S15, E>,
    A16: ValveCompositeSink<P15, P16, S16, E>
  ): ValveStream<
    P16,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    S17,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeThrough<P14, P15, S15, E>,
    A16: ValveCompositeThrough<P15, P16, S16, E>,
    A17: ValveCompositeSink<P16, P17, S17, E>
  ): ValveStream<
    P17,
    ValveStateComposite<
      [
        S1,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8,
        S9,
        S10,
        S11,
        S12,
        S13,
        S14,
        S15,
        S16,
        S17
      ]
    >,
    E
  >

  /* Source -> Through ... */

  function compose<P1, P2, S1, S2, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>
  ): ValveSourceFactory<P2, ValveStateComposite<[S1, S2]>, E>
  function compose<P1, P2, P3, S1, S2, S3, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>
  ): ValveSourceFactory<P3, ValveStateComposite<[S1, S2, S3]>, E>
  function compose<P1, P2, P3, P4, S1, S2, S3, S4, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>
  ): ValveSourceFactory<P4, ValveStateComposite<[S1, S2, S3, S4]>, E>
  function compose<P1, P2, P3, P4, P5, S1, S2, S3, S4, S5, E extends ERR>(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>
  ): ValveSourceFactory<P5, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>
  ): ValveSourceFactory<P6, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>
  ): ValveSourceFactory<
    P7,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>
  ): ValveSourceFactory<
    P8,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>
  ): ValveSourceFactory<
    P9,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>
  ): ValveSourceFactory<
    P10,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>
  ): ValveSourceFactory<
    P11,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>
  ): ValveSourceFactory<
    P12,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>
  ): ValveSourceFactory<
    P13,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>
  ): ValveSourceFactory<
    P14,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeThrough<P14, P15, S15, E>
  ): ValveSourceFactory<
    P15,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeThrough<P14, P15, S15, E>,
    A16: ValveCompositeThrough<P15, P16, S16, E>
  ): ValveSourceFactory<
    P16,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    S17,
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, S1, E>,
    A2: ValveCompositeThrough<P1, P2, S2, E>,
    A3: ValveCompositeThrough<P2, P3, S3, E>,
    A4: ValveCompositeThrough<P3, P4, S4, E>,
    A5: ValveCompositeThrough<P4, P5, S5, E>,
    A6: ValveCompositeThrough<P5, P6, S6, E>,
    A7: ValveCompositeThrough<P6, P7, S7, E>,
    A8: ValveCompositeThrough<P7, P8, S8, E>,
    A9: ValveCompositeThrough<P8, P9, S9, E>,
    A10: ValveCompositeThrough<P9, P10, S10, E>,
    A11: ValveCompositeThrough<P10, P11, S11, E>,
    A12: ValveCompositeThrough<P11, P12, S12, E>,
    A13: ValveCompositeThrough<P12, P13, S13, E>,
    A14: ValveCompositeThrough<P13, P14, S14, E>,
    A15: ValveCompositeThrough<P14, P15, S15, E>,
    A16: ValveCompositeThrough<P15, P16, S16, E>,
    A17: ValveCompositeThrough<P16, P17, S17, E>
  ): ValveSourceFactory<
    P17,
    ValveStateComposite<
      [
        S1,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8,
        S9,
        S10,
        S11,
        S12,
        S13,
        S14,
        S15,
        S16,
        S17
      ]
    >,
    E
  >

  /* Through... -> Sink */

  function compose<P1, P2, P3, S1, S2, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeSink<P2, P3, S2, E>
  ): ValveSinkFactory<P1, P3, ValveStateComposite<[S1, S2]>, E>
  function compose<P1, P2, P3, P4, S1, S2, S3, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeSink<P3, P4, S3, E>
  ): ValveSinkFactory<P1, P4, ValveStateComposite<[S1, S2, S3]>, E>
  function compose<P1, P2, P3, P4, P5, S1, S2, S3, S4, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeSink<P4, P5, S4, E>
  ): ValveSinkFactory<P1, P5, ValveStateComposite<[S1, S2, S3, S4]>, E>
  function compose<P1, P2, P3, P4, P5, P6, S1, S2, S3, S4, S5, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeSink<P5, P6, S5, E>
  ): ValveSinkFactory<P1, P6, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeSink<P6, P7, S6, E>
  ): ValveSinkFactory<P1, P7, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeSink<P7, P8, S7, E>
  ): ValveSinkFactory<
    P1,
    P8,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeSink<P8, P9, S8, E>
  ): ValveSinkFactory<
    P1,
    P9,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeSink<P9, P10, S9, E>
  ): ValveSinkFactory<
    P1,
    P10,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeSink<P10, P11, S10, E>
  ): ValveSinkFactory<
    P1,
    P11,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeSink<P11, P12, S11, E>
  ): ValveSinkFactory<
    P1,
    P12,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeSink<P12, P13, S12, E>
  ): ValveSinkFactory<
    P1,
    P13,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeSink<P13, P14, S13, E>
  ): ValveSinkFactory<
    P1,
    P14,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeSink<P14, P15, S14, E>
  ): ValveSinkFactory<
    P1,
    P15,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>,
    A15: ValveCompositeSink<P15, P16, S15, E>
  ): ValveSinkFactory<
    P1,
    P16,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>,
    A15: ValveCompositeThrough<P15, P16, S15, E>,
    A16: ValveCompositeSink<P16, P17, S16, E>
  ): ValveSinkFactory<
    P1,
    P17,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    P18,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    S17,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>,
    A15: ValveCompositeThrough<P15, P16, S15, E>,
    A16: ValveCompositeThrough<P16, P17, S16, E>,
    A17: ValveCompositeSink<P17, P18, S17, E>
  ): ValveSinkFactory<
    P1,
    P18,
    ValveStateComposite<
      [
        S1,
        S2,
        S3,
        S4,
        S5,
        S6,
        S7,
        S8,
        S9,
        S10,
        S11,
        S12,
        S13,
        S14,
        S15,
        S16,
        S17
      ]
    >,
    E
  >

  /* Through ... */

  function compose<P1, P2, S1, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>
  ): ValveThroughFactory<P1, P2, ValveStateComposite<[S1]>, E>
  function compose<P1, P2, P3, S1, S2, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>
  ): ValveThroughFactory<P1, P3, ValveStateComposite<[S1, S2]>, E>
  function compose<P1, P2, P3, P4, S1, S2, S3, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>
  ): ValveThroughFactory<P1, P4, ValveStateComposite<[S1, S2, S3]>, E>
  function compose<P1, P2, P3, P4, P5, S1, S2, S3, S4, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>
  ): ValveThroughFactory<P1, P5, ValveStateComposite<[S1, S2, S3, S4]>, E>
  function compose<P1, P2, P3, P4, P5, P6, S1, S2, S3, S4, S5, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>
  ): ValveThroughFactory<P1, P6, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>
  ): ValveThroughFactory<
    P1,
    P7,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>
  ): ValveThroughFactory<
    P1,
    P8,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>
  ): ValveThroughFactory<
    P1,
    P9,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>
  ): ValveThroughFactory<
    P1,
    P10,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>
  ): ValveThroughFactory<
    P1,
    P11,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>
  ): ValveThroughFactory<
    P1,
    P12,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>
  ): ValveThroughFactory<
    P1,
    P13,
    ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]>,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>
  ): ValveThroughFactory<
    P1,
    P14,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>
  ): ValveThroughFactory<
    P1,
    P15,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>,
    A15: ValveCompositeThrough<P15, P16, S15, E>
  ): ValveThroughFactory<
    P1,
    P16,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]
    >,
    E
  >
  function compose<
    P1,
    P2,
    P3,
    P4,
    P5,
    P6,
    P7,
    P8,
    P9,
    P10,
    P11,
    P12,
    P13,
    P14,
    P15,
    P16,
    P17,
    S1,
    S2,
    S3,
    S4,
    S5,
    S6,
    S7,
    S8,
    S9,
    S10,
    S11,
    S12,
    S13,
    S14,
    S15,
    S16,
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, S1, E>,
    A2: ValveCompositeThrough<P2, P3, S2, E>,
    A3: ValveCompositeThrough<P3, P4, S3, E>,
    A4: ValveCompositeThrough<P4, P5, S4, E>,
    A5: ValveCompositeThrough<P5, P6, S5, E>,
    A6: ValveCompositeThrough<P6, P7, S6, E>,
    A7: ValveCompositeThrough<P7, P8, S7, E>,
    A8: ValveCompositeThrough<P8, P9, S8, E>,
    A9: ValveCompositeThrough<P9, P10, S9, E>,
    A10: ValveCompositeThrough<P10, P11, S10, E>,
    A11: ValveCompositeThrough<P11, P12, S11, E>,
    A12: ValveCompositeThrough<P12, P13, S12, E>,
    A13: ValveCompositeThrough<P13, P14, S13, E>,
    A14: ValveCompositeThrough<P14, P15, S14, E>,
    A15: ValveCompositeThrough<P15, P16, S15, E>,
    A16: ValveCompositeThrough<P16, P17, S16, E>
  ): ValveThroughFactory<
    P1,
    P17,
    ValveStateComposite<
      [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]
    >,
    E
  >

  /// Implementation
  function compose(A1?: any): never

  function compose(
    ...props: Array<
      | ValveCompositeSink<any, any, any, any>
      | ValveCompositeSource<any, any, any>
      | ValveCompositeThrough<any, any, any, any>
    >
  ):
    | ValveStream<any, any, any>
    | ValveSourceFactory<any, any, any>
    | ValveSinkFactory<any, any, any, any>
    | ValveThroughFactory<any, any, any, any> {
    //
    // TODO: 0 / 1 arguments
    // if (props.length === 0) {
    //   return
    // }

    const first = props[0]
    const last = props[props.length - 1]

    switch (composition(first.type, last.type)) {
      case ValveType.Stream: {
        props.shift()

        return _compose(map(props, f => f.pipe(/* configuration */)))(
          first.pipe(/* configuration */)
        )
      }

      case ValveType.Source: {
        props.shift()

        return new Source(
          _compose(map(props, f => f.pipe(/* configuration */)))(
            first.pipe(/* configuration */)
          )
        )
      }

      case ValveType.Sink: {
        return new Sink(_compose(map(props, f => f.pipe(/* configuration */))))
      }

      case ValveType.Through: {
        return new Through(
          _compose(map(props, f => f.pipe(/* configuration */)))
        )
      }

      default: {
        throw new Error('Invalid')
      }
    }
  }

  return compose
}
