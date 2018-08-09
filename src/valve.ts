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
  ValveState,
  ValveStateComposite,
  ValveThrough,
  ValveThroughFactory,
  ValveType
} from './types'

import { assign, map, reduceRight } from 'lodash'

/* Source -> Through... -> Sink */

export function valve<P1, S1 = ValveState, S2 = ValveState, E = ValveError>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeSink<P1, S2, E>
): void
export function valve<P1, P2, S1 = ValveState, S2 = ValveState, S3 = ValveState, E = ValveError>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeSink<P2, S3, E>
): void
export function valve<
  P1,
  P2,
  P3,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeSink<P3, S4, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeSink<P4, S5, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeSink<P5, S6, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>,
  A7: ValveCompositeSink<P6, S7, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>,
  A7: ValveCompositeThrough<P6, P7, S7, E>,
  A8: ValveCompositeSink<P7, S8, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>,
  A7: ValveCompositeThrough<P6, P7, S7, E>,
  A8: ValveCompositeThrough<P7, P8, S8, E>,
  A9: ValveCompositeSink<P8, S9, E>
): void
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  E = ValveError
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
  A10: ValveCompositeSink<P9, S10, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  E = ValveError
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
  A11: ValveCompositeSink<P10, S11, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  E = ValveError
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
  A12: ValveCompositeSink<P11, S12, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  E = ValveError
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
  A13: ValveCompositeSink<P12, S13, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  E = ValveError
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
  A14: ValveCompositeSink<P13, S14, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  E = ValveError
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
  A15: ValveCompositeSink<P14, S15, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  E = ValveError
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
  A16: ValveCompositeSink<P15, S16, E>
): void
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  S17 = ValveState,
  E = ValveError
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
  A17: ValveCompositeSink<P16, S17, E>
): void

/* Source -> Through ... */

export function valve<P1, P2, S1 = ValveState, S2 = ValveState, E = ValveError>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>
): ValveSourceFactory<P2, ValveStateComposite<[S1, S2]>, E>
export function valve<
  P1,
  P2,
  P3,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>
): ValveSourceFactory<P3, ValveStateComposite<[S1, S2, S3]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>
): ValveSourceFactory<P4, ValveStateComposite<[S1, S2, S3, S4]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>
): ValveSourceFactory<P5, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>
): ValveSourceFactory<P6, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>,
  A7: ValveCompositeThrough<P6, P7, S7, E>
): ValveSourceFactory<P7, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeSource<P1, S1, E>,
  A2: ValveCompositeThrough<P1, P2, S2, E>,
  A3: ValveCompositeThrough<P2, P3, S3, E>,
  A4: ValveCompositeThrough<P3, P4, S4, E>,
  A5: ValveCompositeThrough<P4, P5, S5, E>,
  A6: ValveCompositeThrough<P5, P6, S6, E>,
  A7: ValveCompositeThrough<P6, P7, S7, E>,
  A8: ValveCompositeThrough<P7, P8, S8, E>
): ValveSourceFactory<P8, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  E = ValveError
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
): ValveSourceFactory<P9, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  E = ValveError
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
): ValveSourceFactory<P10, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  E = ValveError
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
): ValveSourceFactory<P11, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  E = ValveError
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
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  S17 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17]>,
  E
>

/* Through... -> Sink */

export function valve<P1, P2, S1 = ValveState, S2 = ValveState, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeSink<P2, S2, E>
): ValveSinkFactory<P2, ValveStateComposite<[S1, S2]>, E>
export function valve<
  P1,
  P2,
  P3,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeSink<P3, S3, E>
): ValveSinkFactory<P3, ValveStateComposite<[S1, S2, S3]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeSink<P4, S4, E>
): ValveSinkFactory<P4, ValveStateComposite<[S1, S2, S3, S4]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeSink<P5, S5, E>
): ValveSinkFactory<P5, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeSink<P6, S6, E>
): ValveSinkFactory<P6, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>,
  A7: ValveCompositeSink<P7, S7, E>
): ValveSinkFactory<P7, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>,
  A7: ValveCompositeThrough<P7, P8, S7, E>,
  A8: ValveCompositeSink<P8, S8, E>
): ValveSinkFactory<P8, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>,
  A7: ValveCompositeThrough<P7, P8, S7, E>,
  A8: ValveCompositeThrough<P8, P9, S8, E>,
  A9: ValveCompositeSink<P9, S9, E>
): ValveSinkFactory<P9, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  E = ValveError
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
  A10: ValveCompositeSink<P10, S10, E>
): ValveSinkFactory<P10, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  E = ValveError
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
  A11: ValveCompositeSink<P11, S11, E>
): ValveSinkFactory<P11, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  E = ValveError
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
  A12: ValveCompositeSink<P12, S12, E>
): ValveSinkFactory<
  P12,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  E = ValveError
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
  A13: ValveCompositeSink<P13, S13, E>
): ValveSinkFactory<
  P13,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  E = ValveError
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
  A14: ValveCompositeSink<P14, S14, E>
): ValveSinkFactory<
  P14,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  E = ValveError
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
  A15: ValveCompositeSink<P15, S15, E>
): ValveSinkFactory<
  P15,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  E = ValveError
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
  A16: ValveCompositeSink<P16, S16, E>
): ValveSinkFactory<
  P16,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  S17 = ValveState,
  E = ValveError
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
  A17: ValveCompositeSink<P17, S17, E>
): ValveSinkFactory<
  P17,
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17]>,
  E
>

/* Through ... */

export function valve<P1, P2, S1 = ValveState, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, S1, E>
): ValveThroughFactory<P1, P2, ValveStateComposite<[S1]>, E>
export function valve<P1, P2, P3, S1 = ValveState, S2 = ValveState, E = ValveError>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>
): ValveThroughFactory<P1, P3, ValveStateComposite<[S1, S2]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>
): ValveThroughFactory<P1, P4, ValveStateComposite<[S1, S2, S3]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>
): ValveThroughFactory<P1, P5, ValveStateComposite<[S1, S2, S3, S4]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>
): ValveThroughFactory<P1, P6, ValveStateComposite<[S1, S2, S3, S4, S5]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>
): ValveThroughFactory<P1, P7, ValveStateComposite<[S1, S2, S3, S4, S5, S6]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>,
  A7: ValveCompositeThrough<P7, P8, S7, E>
): ValveThroughFactory<P1, P8, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7]>, E>
export function valve<
  P1,
  P2,
  P3,
  P4,
  P5,
  P6,
  P7,
  P8,
  P9,
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  E = ValveError
>(
  A1: ValveCompositeThrough<P1, P2, S1, E>,
  A2: ValveCompositeThrough<P2, P3, S2, E>,
  A3: ValveCompositeThrough<P3, P4, S3, E>,
  A4: ValveCompositeThrough<P4, P5, S4, E>,
  A5: ValveCompositeThrough<P5, P6, S5, E>,
  A6: ValveCompositeThrough<P6, P7, S6, E>,
  A7: ValveCompositeThrough<P7, P8, S7, E>,
  A8: ValveCompositeThrough<P8, P9, S8, E>
): ValveThroughFactory<P1, P9, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  E = ValveError
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
): ValveThroughFactory<P1, P10, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  E = ValveError
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
): ValveThroughFactory<P1, P11, ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>, E>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  E = ValveError
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
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  E = ValveError
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
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15]>,
  E
>
export function valve<
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
  S1 = ValveState,
  S2 = ValveState,
  S3 = ValveState,
  S4 = ValveState,
  S5 = ValveState,
  S6 = ValveState,
  S7 = ValveState,
  S8 = ValveState,
  S9 = ValveState,
  S10 = ValveState,
  S11 = ValveState,
  S12 = ValveState,
  S13 = ValveState,
  S14 = ValveState,
  S15 = ValveState,
  S16 = ValveState,
  E = ValveError
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
  ValveStateComposite<[S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16]>,
  E
>

/// Implementation
export function valve<E = ValveError>(A1?: any): never

export function valve<E = ValveError>(
  ...props: Array<
    | ValveCompositeSink<any, any, E>
    | ValveCompositeSource<any, any, E>
    | ValveCompositeThrough<any, any, any, E>
  >
):
  | void
  | ValveSourceFactory<any, any, E>
  | ValveSinkFactory<any, any, E>
  | ValveThroughFactory<any, any, any, E> {
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
