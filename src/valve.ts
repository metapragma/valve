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

/* Source -> Through... -> Sink */

export function valve<T1, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeSink<T1, E>
): void
export function valve<T1, T2, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeSink<T2, E>
): void
export function valve<T1, T2, T3, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeSink<T3, E>
): void
export function valve<T1, T2, T3, T4, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeSink<T4, E>
): void
export function valve<T1, T2, T3, T4, T5, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeSink<T5, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeSink<T6, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeSink<T7, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeSink<T8, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeSink<T9, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeSink<T10, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeSink<T11, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeSink<T12, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeSink<T13, E>
): void
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>,
  A15: ValveCompositeSink<T14, E>
): void
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  E = ValveError
>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>,
  A15: ValveCompositeThrough<T14, T15, E>,
  A16: ValveCompositeSink<T15, E>
): void
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  E = ValveError
>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>,
  A15: ValveCompositeThrough<T14, T15, E>,
  A16: ValveCompositeThrough<T15, T16, E>,
  A17: ValveCompositeSink<T16, E>
): void

/* Through... -> Sink */

export function valve<T1, T2, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeSink<T2, E>
): ValveSinkFactory<T2, E>
export function valve<T1, T2, T3, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeSink<T3, E>
): ValveSinkFactory<T3, E>
export function valve<T1, T2, T3, T4, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeSink<T4, E>
): ValveSinkFactory<T4, E>
export function valve<T1, T2, T3, T4, T5, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeSink<T5, E>
): ValveSinkFactory<T5, E>
export function valve<T1, T2, T3, T4, T5, T6, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeSink<T6, E>
): ValveSinkFactory<T6, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeSink<T7, E>
): ValveSinkFactory<T7, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeSink<T8, E>
): ValveSinkFactory<T8, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeSink<T9, E>
): ValveSinkFactory<T9, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeSink<T10, E>
): ValveSinkFactory<T10, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeSink<T11, E>
): ValveSinkFactory<T11, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeSink<T12, E>
): ValveSinkFactory<T12, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeSink<T13, E>
): ValveSinkFactory<T13, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>,
  A14: ValveCompositeSink<T14, E>
): ValveSinkFactory<T14, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  E = ValveError
>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>,
  A14: ValveCompositeThrough<T14, T15, E>,
  A15: ValveCompositeSink<T15, E>
): ValveSinkFactory<T15, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  E = ValveError
>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>,
  A14: ValveCompositeThrough<T14, T15, E>,
  A15: ValveCompositeThrough<T15, T16, E>,
  A16: ValveCompositeSink<T16, E>
): ValveSinkFactory<T16, E>

/* Source -> Through ... */

export function valve<T1, E = ValveError>(
  A1: ValveCompositeSource<T1, E>
): ValveSourceFactory<T1, E>
export function valve<T1, T2, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>
): ValveSourceFactory<T2, E>
export function valve<T1, T2, T3, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>
): ValveSourceFactory<T3, E>
export function valve<T1, T2, T3, T4, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>
): ValveSourceFactory<T4, E>
export function valve<T1, T2, T3, T4, T5, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>
): ValveSourceFactory<T5, E>
export function valve<T1, T2, T3, T4, T5, T6, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>
): ValveSourceFactory<T6, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>
): ValveSourceFactory<T7, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>
): ValveSourceFactory<T8, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>
): ValveSourceFactory<T9, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>
): ValveSourceFactory<T10, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>
): ValveSourceFactory<T11, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>
): ValveSourceFactory<T12, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>
): ValveSourceFactory<T13, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, E = ValveError>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>
): ValveSourceFactory<T14, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  E = ValveError
>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>,
  A15: ValveCompositeThrough<T14, T15, E>
): ValveSourceFactory<T15, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  E = ValveError
>(
  A1: ValveCompositeSource<T1, E>,
  A2: ValveCompositeThrough<T1, T2, E>,
  A3: ValveCompositeThrough<T2, T3, E>,
  A4: ValveCompositeThrough<T3, T4, E>,
  A5: ValveCompositeThrough<T4, T5, E>,
  A6: ValveCompositeThrough<T5, T6, E>,
  A7: ValveCompositeThrough<T6, T7, E>,
  A8: ValveCompositeThrough<T7, T8, E>,
  A9: ValveCompositeThrough<T8, T9, E>,
  A10: ValveCompositeThrough<T9, T10, E>,
  A11: ValveCompositeThrough<T10, T11, E>,
  A12: ValveCompositeThrough<T11, T12, E>,
  A13: ValveCompositeThrough<T12, T13, E>,
  A14: ValveCompositeThrough<T13, T14, E>,
  A15: ValveCompositeThrough<T14, T15, E>,
  A16: ValveCompositeThrough<T15, T16, E>
): ValveSourceFactory<T16, E>

/* Through ... */

export function valve<T1, T2, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>
): ValveThroughFactory<T1, T2, E>
export function valve<T1, T2, T3, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>
): ValveThroughFactory<T1, T3, E>
export function valve<T1, T2, T3, T4, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>
): ValveThroughFactory<T1, T4, E>
export function valve<T1, T2, T3, T4, T5, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>
): ValveThroughFactory<T1, T5, E>
export function valve<T1, T2, T3, T4, T5, T6, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>
): ValveThroughFactory<T1, T6, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>
): ValveThroughFactory<T1, T7, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>
): ValveThroughFactory<T1, T8, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>
): ValveThroughFactory<T1, T9, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>
): ValveThroughFactory<T1, T10, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>
): ValveThroughFactory<T1, T11, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>
): ValveThroughFactory<T1, T12, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>
): ValveThroughFactory<T1, T13, E>
export function valve<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, E = ValveError>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>
): ValveThroughFactory<T1, T14, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  E = ValveError
>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>,
  A14: ValveCompositeThrough<T14, T15, E>
): ValveThroughFactory<T1, T15, E>
export function valve<
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  E = ValveError
>(
  A1: ValveCompositeThrough<T1, T2, E>,
  A2: ValveCompositeThrough<T2, T3, E>,
  A3: ValveCompositeThrough<T3, T4, E>,
  A4: ValveCompositeThrough<T4, T5, E>,
  A5: ValveCompositeThrough<T5, T6, E>,
  A6: ValveCompositeThrough<T6, T7, E>,
  A7: ValveCompositeThrough<T7, T8, E>,
  A8: ValveCompositeThrough<T8, T9, E>,
  A9: ValveCompositeThrough<T9, T10, E>,
  A10: ValveCompositeThrough<T10, T11, E>,
  A11: ValveCompositeThrough<T11, T12, E>,
  A12: ValveCompositeThrough<T12, T13, E>,
  A13: ValveCompositeThrough<T13, T14, E>,
  A14: ValveCompositeThrough<T14, T15, E>,
  A15: ValveCompositeThrough<T15, T16, E>
): ValveThroughFactory<T1, T16, E>

/// Implementation

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
