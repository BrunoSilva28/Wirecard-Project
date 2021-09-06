export class HashManagerMock {
    public async hash(textToHide: string): Promise<string> {
        return "hash";
    }

    public async compare(text: string, hash: string): Promise<boolean> {
        return text === hash;
    };
};