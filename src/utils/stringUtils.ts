export function hasWhiteSpace(s: string): boolean {
    return /\s/g.test(s);
}

export function isAlpha(s: string) {
    return /^[a-z]+$/gi.test(s);
}

export function isAlphaNumeric(s: string) {
    return /^[a-z0-9]+$/gi.test(s);
}

export function isWhiteSpace(s: string): boolean {
    return s.trim().length === 0;
}