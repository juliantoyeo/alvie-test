export interface errorType {
    error: any
}

export function isError(err: any): err is errorType {
    return (err as errorType).error !== undefined;
  }