/* tslint:disable no-any no-unsafe-any
 * no-object-literal-type-assertion */

import {
  Stream,
  ValveCompositeSink,
  ValveCompositeSource,
  ValveCompositeThrough,
  ValveError,
  ValveSinkFactory,
  ValveSourceFactory,
  ValveThroughFactory,
  ValveType
} from './types'

import { Source } from './internal/Source'

import { Through } from './internal/Through'

import { Sink } from './internal/Sink'

import { map, reduceRight } from 'lodash'
import { composition } from './internal/composition'

const _compose = (fns: any[]) =>
  reduceRight(fns, (f, g) => (...args: any[]) => f(g(...args)))

// tslint:disable-next-line max-func-body-length
export function valve<ERR = ValveError>() {
  /* Source -> Through... -> Sink */

  function compose<P1, P2, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeSink<P1, P2, E>
  ): Stream<P2, E>
  function compose<P1, P2, P3, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeSink<P2, P3, E>
  ): Stream<P3, E>
  function compose<P1, P2, P3, P4, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeSink<P3, P4, E>
  ): Stream<P4, E>
  function compose<P1, P2, P3, P4, P5, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeSink<P4, P5, E>
  ): Stream<P5, E>
  function compose<P1, P2, P3, P4, P5, P6, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeSink<P5, P6, E>
  ): Stream<P6, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeSink<P6, P7, E>
  ): Stream<P7, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeSink<P7, P8, E>
  ): Stream<P8, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeSink<P8, P9, E>
  ): Stream<P9, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeSink<P9, P10, E>
  ): Stream<P10, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeSink<P10, P11, E>
  ): Stream<P11, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeSink<P11, P12, E>
  ): Stream<P12, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeSink<P12, P13, E>
  ): Stream<P13, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeSink<P13, P14, E>
  ): Stream<P14, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeSink<P14, P15, E>
  ): Stream<P15, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeThrough<P14, P15, E>,
    A16: ValveCompositeSink<P15, P16, E>
  ): Stream<P16, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeThrough<P14, P15, E>,
    A16: ValveCompositeThrough<P15, P16, E>,
    A17: ValveCompositeSink<P16, P17, E>
  ): Stream<P17, E>

  /* Source -> Through ... */

  function compose<P1, P2, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>
  ): ValveSourceFactory<P2, E>
  function compose<P1, P2, P3, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>
  ): ValveSourceFactory<P3, E>
  function compose<P1, P2, P3, P4, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>
  ): ValveSourceFactory<P4, E>
  function compose<P1, P2, P3, P4, P5, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>
  ): ValveSourceFactory<P5, E>
  function compose<P1, P2, P3, P4, P5, P6, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>
  ): ValveSourceFactory<P6, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>
  ): ValveSourceFactory<P7, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>
  ): ValveSourceFactory<P8, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>
  ): ValveSourceFactory<P9, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>
  ): ValveSourceFactory<P10, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, E extends ERR>(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>
  ): ValveSourceFactory<P11, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>
  ): ValveSourceFactory<P12, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>
  ): ValveSourceFactory<P13, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>
  ): ValveSourceFactory<P14, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeThrough<P14, P15, E>
  ): ValveSourceFactory<P15, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeThrough<P14, P15, E>,
    A16: ValveCompositeThrough<P15, P16, E>
  ): ValveSourceFactory<P16, E>
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
    E extends ERR
  >(
    A1: ValveCompositeSource<P1, E>,
    A2: ValveCompositeThrough<P1, P2, E>,
    A3: ValveCompositeThrough<P2, P3, E>,
    A4: ValveCompositeThrough<P3, P4, E>,
    A5: ValveCompositeThrough<P4, P5, E>,
    A6: ValveCompositeThrough<P5, P6, E>,
    A7: ValveCompositeThrough<P6, P7, E>,
    A8: ValveCompositeThrough<P7, P8, E>,
    A9: ValveCompositeThrough<P8, P9, E>,
    A10: ValveCompositeThrough<P9, P10, E>,
    A11: ValveCompositeThrough<P10, P11, E>,
    A12: ValveCompositeThrough<P11, P12, E>,
    A13: ValveCompositeThrough<P12, P13, E>,
    A14: ValveCompositeThrough<P13, P14, E>,
    A15: ValveCompositeThrough<P14, P15, E>,
    A16: ValveCompositeThrough<P15, P16, E>,
    A17: ValveCompositeThrough<P16, P17, E>
  ): ValveSourceFactory<P17, E>

  /* Through... -> Sink */

  function compose<P1, P2, P3, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeSink<P2, P3, E>
  ): ValveSinkFactory<P1, P3, E>
  function compose<P1, P2, P3, P4, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeSink<P3, P4, E>
  ): ValveSinkFactory<P1, P4, E>
  function compose<P1, P2, P3, P4, P5, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeSink<P4, P5, E>
  ): ValveSinkFactory<P1, P5, E>
  function compose<P1, P2, P3, P4, P5, P6, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeSink<P5, P6, E>
  ): ValveSinkFactory<P1, P6, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeSink<P6, P7, E>
  ): ValveSinkFactory<P1, P7, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeSink<P7, P8, E>
  ): ValveSinkFactory<P1, P8, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeSink<P8, P9, E>
  ): ValveSinkFactory<P1, P9, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeSink<P9, P10, E>
  ): ValveSinkFactory<P1, P10, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeSink<P10, P11, E>
  ): ValveSinkFactory<P1, P11, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeSink<P11, P12, E>
  ): ValveSinkFactory<P1, P12, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeSink<P12, P13, E>
  ): ValveSinkFactory<P1, P13, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeSink<P13, P14, E>
  ): ValveSinkFactory<P1, P14, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeSink<P14, P15, E>
  ): ValveSinkFactory<P1, P15, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>,
    A15: ValveCompositeSink<P15, P16, E>
  ): ValveSinkFactory<P1, P16, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>,
    A15: ValveCompositeThrough<P15, P16, E>,
    A16: ValveCompositeSink<P16, P17, E>
  ): ValveSinkFactory<P1, P17, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>,
    A15: ValveCompositeThrough<P15, P16, E>,
    A16: ValveCompositeThrough<P16, P17, E>,
    A17: ValveCompositeSink<P17, P18, E>
  ): ValveSinkFactory<P1, P18, E>

  /* Through ... */

  function compose<P1, P2, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>
  ): ValveThroughFactory<P1, P2, E>
  function compose<P1, P2, P3, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>
  ): ValveThroughFactory<P1, P3, E>
  function compose<P1, P2, P3, P4, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>
  ): ValveThroughFactory<P1, P4, E>
  function compose<P1, P2, P3, P4, P5, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>
  ): ValveThroughFactory<P1, P5, E>
  function compose<P1, P2, P3, P4, P5, P6, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>
  ): ValveThroughFactory<P1, P6, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>
  ): ValveThroughFactory<P1, P7, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>
  ): ValveThroughFactory<P1, P8, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>
  ): ValveThroughFactory<P1, P9, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>
  ): ValveThroughFactory<P1, P10, E>
  function compose<P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, E extends ERR>(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>
  ): ValveThroughFactory<P1, P11, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>
  ): ValveThroughFactory<P1, P12, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>
  ): ValveThroughFactory<P1, P13, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>
  ): ValveThroughFactory<P1, P14, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>
  ): ValveThroughFactory<P1, P15, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>,
    A15: ValveCompositeThrough<P15, P16, E>
  ): ValveThroughFactory<P1, P16, E>
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
    E extends ERR
  >(
    A1: ValveCompositeThrough<P1, P2, E>,
    A2: ValveCompositeThrough<P2, P3, E>,
    A3: ValveCompositeThrough<P3, P4, E>,
    A4: ValveCompositeThrough<P4, P5, E>,
    A5: ValveCompositeThrough<P5, P6, E>,
    A6: ValveCompositeThrough<P6, P7, E>,
    A7: ValveCompositeThrough<P7, P8, E>,
    A8: ValveCompositeThrough<P8, P9, E>,
    A9: ValveCompositeThrough<P9, P10, E>,
    A10: ValveCompositeThrough<P10, P11, E>,
    A11: ValveCompositeThrough<P11, P12, E>,
    A12: ValveCompositeThrough<P12, P13, E>,
    A13: ValveCompositeThrough<P13, P14, E>,
    A14: ValveCompositeThrough<P14, P15, E>,
    A15: ValveCompositeThrough<P15, P16, E>,
    A16: ValveCompositeThrough<P16, P17, E>
  ): ValveThroughFactory<P1, P17, E>

  /// Implementation
  function compose(A1?: any): never

  function compose(
    ...props: Array<
      | ValveCompositeSink<any, any, any>
      | ValveCompositeSource<any, any>
      | ValveCompositeThrough<any, any, any>
    >
  ):
    | Stream<any, any>
    | ValveSourceFactory<any, any>
    | ValveSinkFactory<any, any, any>
    | ValveThroughFactory<any, any, any> {
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
