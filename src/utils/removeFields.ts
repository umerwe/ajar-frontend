export const removeFields = <T extends Record<string, any>>(
    data: T | T[],
    fieldsToRemove: (keyof T)[]
): Partial<T>[] => {
    const processItem = (item: T) =>
        Object.fromEntries(
            Object.entries(item).filter(
                ([key]) => !fieldsToRemove.includes(key as keyof T)
            )
        ) as Partial<T>;

    return Array.isArray(data) ? data.map(processItem) : [processItem(data)];
};
