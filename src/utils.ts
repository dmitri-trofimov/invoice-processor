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

/**
 * Gets a string representation of a date in YYYY-MM-DD format.
 */
export function getDateSting(date: Date): string {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}`: d}`;
}