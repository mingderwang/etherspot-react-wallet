export function today(): Promise<Date> {
  return new Promise<Date>((resolve) => {
    setTimeout(() => resolve(new Date), 1000);
  })
}

export function tomorrow(): Promise<Error> {
  return new Promise<Error>((reject) => {
    setTimeout(() => reject(new Error("Whoops!")), 1000);
  })
}