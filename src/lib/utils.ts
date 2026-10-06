import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function isNumeric(input: string): boolean {
	return /^\d*$/.exec(input) !== null;
}

export function secondStringify(seconds: number): string {
	seconds = Math.round(seconds);

	function printZero(input: number): string {
		if (input < 10) return "0" + input;
		return input.toString();
	}

	const days = Math.floor(seconds / 86400);
	const r1 = seconds % 86400;

	const hours = Math.floor(r1 / 3600);
	const r2 = r1 % 3600;

	const minutes = Math.floor(r2 / 60);
	const second = r2 % 60;

	let rstring = `${printZero(minutes)}:${printZero(second)}`;
	if (hours > 0) rstring = hours + ":" + rstring;
	if (days > 0) rstring = `${days} Tag${days > 1 ? "s" : ""} ` + rstring;

	return rstring;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const FULL_ISO_DATE_REGEX =
	/^\d{4}-(?:0[1-9]|1[0-2])-(?:[12]\d|0[1-9]|3[01])[T ](?:0\d|1\d|2[0-3])(?::[0-5]\d){2}\.\d{3}Z$/u;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
