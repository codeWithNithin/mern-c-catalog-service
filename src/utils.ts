export function mapToObject(map: Map<string, unknown>) {
    const obj = {}
    for (const [key, value] of map) {
        // todo: fix this type error
        // @ts-expect-error - Type mismatch in this assignment
        obj[key] = value instanceof Map ? mapToObject(value) : value
    }
    return obj
}
