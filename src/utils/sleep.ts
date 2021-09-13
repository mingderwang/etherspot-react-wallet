export function sleep(sec: number): Promise<void> {
  return new Promise<void>((resolve) => {
    console.log('sleep ', sec)
    setTimeout(resolve, sec * 1000)
  })
}
