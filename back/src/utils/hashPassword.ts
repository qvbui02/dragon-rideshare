import argon2 from "argon2";

// Hash a password
export async function hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
}

// Verify a password
export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
}
