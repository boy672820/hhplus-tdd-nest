import { Mutex } from 'async-mutex';

const mutex = new Mutex();

export function WithLock() {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const release = await mutex.acquire();
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        throw error;
      } finally {
        release();
      }
    };

    return descriptor;
  };
}
