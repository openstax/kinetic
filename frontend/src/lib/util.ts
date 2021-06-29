export function omit<T extends object = {}>(obj: T, ...keys: string[]): Partial<T> {
    return (keys as any).reduce((a: Partial<T>, e: keyof T) => {
        const { [e]: _omitted, ...rest } = a;
        return rest;
    }, obj);
}
