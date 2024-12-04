import { Dieb } from "..";

describe("Dieb", () => {
  describe("String data", () => {
    const db = Dieb<string>({ initialData: "John" });
    const { fetch, write, append, reset, destroy } = db;
    beforeEach(async () => {
      await reset();
    });
    afterEach(async () => {
      await destroy();
    });
    test("api", async () => {
      expect(await fetch()).toEqual("John");
      await write("Joe");
      expect(await fetch()).toEqual("Joe");
      await write("Bob");
      expect(await fetch()).toEqual("Bob");
      await reset();
      expect(await fetch()).toEqual("John");
    });
  });

  describe("Simple object data", () => {
    const db = Dieb<{ name: string }>({ initialData: { name: "John" } });
    const { fetch, write, append, reset, destroy } = db;
    beforeEach(async () => {
      await reset();
    });
    afterEach(async () => {
      await destroy();
    });
    test("api", async () => {
      expect(await fetch()).toEqual({ name: "John" });
      await append({ name: "Joe" });
      expect(await fetch()).toEqual({ name: "Joe" });
      await append({ name: "Jane" });
      expect(await fetch()).toEqual({ name: "Jane" });
      await write({ name: "Bob" });
      expect(await fetch()).toEqual({ name: "Bob" });
      await reset();
      expect(await fetch()).toEqual({ name: "John" });
    });
  });

  describe("Complex object data", () => {
    type Person = {
      name: string;
      age: number;
      friends?: Person[];
    };
    const initialData: Person = {
      name: "John",
      age: 21,
      friends: [
        { name: "Joe", age: 23 },
        { name: "Jane", age: 22 },
      ],
    };
    const db = Dieb<Person>({
      initialData,
    });
    const { fetch, write, append, reset, destroy } = db;
    beforeEach(async () => {
      await reset();
    });
    afterEach(async () => {
      await destroy();
    });

    test("api", async () => {
      expect(await fetch()).toEqual(initialData);
      await append({ age: 22 });
      expect(await fetch()).toEqual({
        ...initialData,
        age: 22,
      });
      await append({
        friends: initialData.friends?.concat({
          name: "Bob",
          age: 27,
          friends: [{ name: "Sandy", age: 30 }],
        }),
      });
      expect(await fetch()).toStrictEqual({
        ...initialData,
        age: 22,
        friends: [
          ...(initialData?.friends ?? []),
          { name: "Bob", age: 27, friends: [{ name: "Sandy", age: 30 }] },
        ],
      });
      await write(initialData);
      expect(await fetch()).toEqual(initialData);
      await reset();
      expect(await fetch()).toEqual(initialData);
    });
  });
});
