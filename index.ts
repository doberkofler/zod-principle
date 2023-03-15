const enum TypeDef {
  object = "object",
  string = "S",
  number = "N",
  boolean = "B",
  date = "D",
}

type SchemaDef = {
  type: TypeDef;
  value: unknown;
};

type ObjectSchema<T extends { [k: string]: any }> = {
  [k in keyof T]: Type<T[k]>;
};

type Type<T> = {
  type: TypeDef;
  value: unknown;
  infer: () => T;
  props: () => void;
};

const typeObject = <T extends { [k: string]: any }>(
  schema: ObjectSchema<T>
): Type<T> => {
  return {
    type: TypeDef.object,
    value: undefined,
    infer(): T {
      const result: { [k: string]: unknown } = {};
      for (const [key, subSchema] of Object.entries(schema)) {
        result[key] = subSchema.infer();
      }
      return result as T;
    },
    props(): Record<string, SchemaDef> {
      const result: Record<string, SchemaDef> = {};
      for (const [key, subSchema] of Object.entries(schema)) {
        if (subSchema.type !== "object") {
          result[key] = {
            type: subSchema.type,
            value: subSchema.value,
          };
        }
      }
      return result;
    },
  };
};

const typeString = (value?: string): Type<string> => {
  return {
    type: TypeDef.string,
    value,
    infer() {
      return "";
    },
    props() {},
  };
};

const typeNumber = (value?: number): Type<number> => {
  return {
    type: TypeDef.number,
    value,
    infer() {
      return 0;
    },
    props() {},
  };
};

const typeBoolean = (value?: boolean): Type<boolean> => {
  return {
    type: TypeDef.boolean,
    value,
    infer() {
      return true;
    },
    props() {},
  };
};

const typeDate = (value?: Date): Type<Date> => {
  return {
    type: TypeDef.date,
    value,
    infer() {
      return new Date();
    },
    props() {},
  };
};

// example usage:
const fooSchema = typeObject({
  str: typeString("string"),
  num: typeNumber(3.14),
  bol: typeBoolean(true),
  dat: typeDate(),
});

type Foo = typeof fooSchema.infer;

console.log(fooSchema.props());
