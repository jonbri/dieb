import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";

export interface DiebArgs<T> {
  file?: string;
  initialData: T;
}
export const Dieb = <T>({ file = "_work.json", initialData }: DiebArgs<T>) => {
  const initIfNeeded = async () => {
    if (existsSync(file)) return;
    await delay(0);
    writeFileSync(file, JSON.stringify(initialData));
  };
  const fetch = async (): Promise<T> => {
    await initIfNeeded();
    await delay(0);
    return JSON.parse(readFileSync(file, "utf-8"));
  };
  const write = async (cache: T) => {
    await initIfNeeded();
    await delay(250);
    writeFileSync(file, JSON.stringify(cache));
  };
  const append = async (data: Partial<T>) => {
    const cache = await fetch();
    await write({
      ...initialData,
      ...cache,
      ...data,
    });
  };
  const reset = async () => {
    await initIfNeeded();
    await delay(0);
    await write(initialData);
  };
  const destroy = async () => {
    await initIfNeeded();
    await delay(0);
    unlinkSync(file);
  };
  return {
    fetch,
    write,
    append,
    reset,
    destroy,
  };
};

const delay = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
