import argon from "argon2"
export class Password {
    static toHash(password:string): Promise<string> {
        return argon.hash(password);
    }
    static compare (storedPassword:string,suppliedPassword:string): Promise<boolean> {
        return argon.verify(storedPassword,suppliedPassword);
    }
}