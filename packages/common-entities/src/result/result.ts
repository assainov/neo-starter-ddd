type Success<T> = { isSuccess: true; data: T};
type Failure<E> = { isSuccess: false; error: E };

export type Result<T, E> = Success<T> | Failure<E>;

export const result = {
  succeed<T>(data: T) {
    return { isSuccess: true, data } as Success<T>;
  },
  fail<E>(error: E) {
    return { isSuccess: false, error } as Failure<E>;
  }
};