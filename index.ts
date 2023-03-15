type ObjectSchema<T extends {[k: string]: any}> = {
    [k in keyof T]: Type<T[k]>;
};

type Type<T> = {
    infer: () => T;
};

const typeObject = <T extends {[k: string]: any}>(schema: ObjectSchema<T>): Type<T> => {
    return {
        infer() {
            const result: {[k: string]: unknown} = {};
            for (const [key, subSchema] of Object.entries(schema)) {
                result[key] = subSchema.infer();
            }
        return result as T;
        },
    };
};

const typeString = (): Type<string> => {
    return {
        infer() {
            return '';
        },
    };
};

const typeNumber = (): Type<number> => {
    return {
        infer() {
            return 0;
        },
    };
};

const typeBoolean = (): Type<boolean> => {
    return {
        infer() {
            return true;
        },
    };
};

const typeDate = (value: Date | null = null): Type<Date> => {
    return {
        infer() {
            return new Date();
        },
    };
};

// example usage:
const fooSchema = typeObject({
    str: typeString(),
    num: typeNumber(),
    bol: typeBoolean(),
    dat: typeDate(),
});

type Foo = typeof fooSchema.infer;
