export function parseEnum<E, K extends string>(
    enumDef: { [key in K]: E },
    str: string | undefined
): E | undefined {
    return Object.values(enumDef).find(e => e === str) as E;
}