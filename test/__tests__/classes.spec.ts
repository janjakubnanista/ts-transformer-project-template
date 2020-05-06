import 'jest';

import { FilterFunction, aPrimitive, notOfType, testTypeChecks } from './utils';
// @ts-ignore
import { isA, typeCheckFor } from 'ts-type-checked';
import fc from 'fast-check';

describe('classes', () => {
  test('public properties', () => {
    class TypeReference1 {
      constructor(public property: string) {}
    }

    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.constantFrom(
        new TypeReference1('string'),
        { property: 'string' },
        Object.assign(() => true, { property: 'string' }),
      ),
      fc.string().map((value) => new TypeReference1(value)),
      fc.record({
        property: fc.string(),
      }),
    );
    const invalidArbitrary = fc.oneof(
      fc.anything().filter(aPrimitive),
      fc.record({
        property: fc.anything().filter(notOfType('string')),
      }),
    );

    const checks: FilterFunction[] = [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)];

    testTypeChecks(validArbitrary, checks, true);
    testTypeChecks(invalidArbitrary, checks, false);
  });

  test('public methods', () => {
    class TypeReference1 {
      method(): string {
        return 'value';
      }
    }

    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.constantFrom(
        new TypeReference1(),
        { method: () => 'value' },
        Object.assign(() => true, { method: () => 'value' }),
      ),
      fc.record({
        method: fc.func(fc.anything() as fc.Arbitrary<any>),
      }),
    );
    const invalidArbitrary = fc.oneof(
      fc.anything().filter(aPrimitive),
      fc.record({
        method: fc.anything().filter(notOfType('function')),
      }),
    );

    const checks: FilterFunction[] = [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)];

    testTypeChecks(validArbitrary, checks, true);
    testTypeChecks(invalidArbitrary, checks, false);
  });

  test('public async methods', () => {
    class TypeReference1 {
      async method() {
        return 'value';
      }
    }

    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.constantFrom(
        new TypeReference1(),
        { method: () => Promise.resolve('value') },
        Object.assign(() => true, { method: () => Promise.resolve('value') }),
      ),
      fc.record({
        method: fc.func(fc.anything() as fc.Arbitrary<any>),
      }),
    );
    const invalidArbitrary = fc.oneof(
      fc.anything().filter(aPrimitive),
      fc.record({
        method: fc.anything().filter(notOfType('function')),
      }),
    );

    const checks: FilterFunction[] = [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)];

    testTypeChecks(validArbitrary, checks, true);
    testTypeChecks(invalidArbitrary, checks, false);
  });

  test('generic properties', () => {
    class TypeReference1<T> {
      constructor(public property: T) {}
    }

    const validArbitrary: fc.Arbitrary<TypeReference1<number>> = fc.oneof(
      fc.constantFrom(
        new TypeReference1(1),
        { property: 7 },
        Object.assign(() => true, { property: NaN }),
      ),
      fc.record({
        property: fc.oneof(fc.integer(), fc.float()),
      }),
    );
    const invalidArbitrary = fc.oneof(
      fc.anything().filter(aPrimitive),
      fc.record({
        property: fc.anything().filter(notOfType('number')),
      }),
    );

    const checks: FilterFunction[] = [
      typeCheckFor<TypeReference1<number>>(),
      (value) => isA<TypeReference1<number>>(value),
    ];

    testTypeChecks(validArbitrary, checks, true);
    testTypeChecks(invalidArbitrary, checks, false);
  });

  test('property initailizers', () => {
    class TypeReference1 {
      property = 'value';
    }

    const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
      fc.constantFrom(
        new TypeReference1(),
        { property: 'string' },
        Object.assign(() => true, { property: 'value' }),
      ),
      fc.record({
        property: fc.string(),
      }),
    );
    const invalidArbitrary = fc.oneof(
      fc.anything().filter(aPrimitive),
      fc.record({
        property: fc.anything().filter(notOfType('string')),
      }),
    );

    const checks: FilterFunction[] = [typeCheckFor<TypeReference1>(), (value) => isA<TypeReference1>(value)];

    testTypeChecks(validArbitrary, checks, true);
    testTypeChecks(invalidArbitrary, checks, false);
  });

  // test.skip('private properties', () => {
  //   class TypeReference1 {
  //     constructor(public property: string, private privateProperty: boolean) {}
  //   }

  //   const validArbitrary: fc.Arbitrary<TypeReference1> = fc.oneof(
  //     fc.constantFrom(new TypeReference1('string', true), new TypeReference1('string', false)),
  //     fc.tuple(fc.string(), fc.boolean()).map(([a, b]) => new TypeReference1(a, b)),
  //     fc.record({
  //       property: fc.string(),
  //     }),
  //   );
  //   const invalidArbitrary = fc.oneof(
  //     fc.anything().filter(aPrimitive),
  //     fc.record({
  //       property: fc.anything().filter(notOfType('string')),
  //     }),
  //   );

  //   const checks: FilterFunction[] = [typeCheckFor<TypeReference1>(), value => isA<TypeReference1>(value)];

  //   testTypeChecks(validArbitrary, checks, true);
  //   testTypeChecks(invalidArbitrary, checks, false);
  // });
});