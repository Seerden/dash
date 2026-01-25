export type ObjectEntries<T> = [keyof T, T[keyof T]][];

export function typedObjectEntries<T extends object>(obj: T) {
	return Object.entries(obj) as ObjectEntries<T>;
}
