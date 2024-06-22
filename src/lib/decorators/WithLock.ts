let mutex = Promise.resolve();

export function WithLock() {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      mutex = mutex.then(async () => {
        const result = await originalMethod.apply(this, args);
        return result;
      });
      return mutex;
    };

    return descriptor;
  };
}
