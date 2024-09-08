export {};

declare global {
  interface Promise<T> {
    retry(retries: number): Promise<T>;
  }
}

Promise.prototype.retry = function <T>(this: Promise<T>, retries: number): Promise<T> {
  const originalFn = this;

  return new Promise(async (resolve, reject) => {
    let attempt = 0;
    let lastError;

    while (attempt < retries) {
      try {
        const result = await originalFn;
        return resolve(result);
      } catch (error) {
        lastError = error;
        attempt++;
        console.warn(`Retry attempt ${attempt} failed. Retrying...`);
      }
    }

    return reject(lastError);
  });
};