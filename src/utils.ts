/**
 * Checks if a value is null or undefined.
 * @param value - The value to check.
 * @returns true if the value is null or undefined, false otherwise.
 */
export function isNil<T>(value: T): value is Extract<T, null | undefined> {
    return value === null || value === undefined;
}

/**
 * Checks if a value is not null or undefined.
 * @param value - The value to check.
 * @returns true if the value is not null or undefined, false otherwise.
 */
export function isNotNil<T>(value: T): value is Exclude<T, null | undefined> {
    return !isNil(value);
}
