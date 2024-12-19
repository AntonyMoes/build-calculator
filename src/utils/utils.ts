export function parseEnum<E, K extends string>(
    enumDef: { [key in K]: E },
    str: string | undefined
): E | undefined {
    return Object.values(enumDef).find(e => e === str) as E;
}

export function downloadFile(filename: string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}