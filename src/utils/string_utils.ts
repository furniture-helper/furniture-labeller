export function removeAllNonNumericCharacters(str: string): string {
    return str.replace(/[^\d.]/g, '').replace(/^\.+/, '');
}