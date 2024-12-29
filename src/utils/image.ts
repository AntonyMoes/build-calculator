export function imageToSrc(file: File): Promise<string> {
    const fileDataURL = (f: File) => new Promise<string>((resolve, reject) => {
        let fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(f);
    });

    return fileDataURL(file);
}