import pLimit from 'p-limit';

export function mapConcurrently<T, U>(concurrency: number, fn: (item: T) => Promise<U>, list: T[]): Promise<U[]> {
    const limit = pLimit(concurrency);

    return Promise.all(list.map(item => limit(() => fn(item))));
}
