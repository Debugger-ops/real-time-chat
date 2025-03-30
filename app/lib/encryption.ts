import { hash, compare, genSalt } from 'bcryptjs';
import crypto from 'crypto';

// Hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(12);
  return hash(password, salt);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Generate a secure random token
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// Encrypt a message (for securing sensitive data)
export function encryptMessage(text: string, key: string): string {
  // Use environment variable for IV or generate one
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-ctr', 
    crypto.createHash('sha256').update(key).digest().subarray(0, 32),
    iv
  );
  
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Decrypt a message
export function decryptMessage(encryptedText: string, key: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-ctr',
    crypto.createHash('sha256').update(key).digest().subarray(0, 32),
    iv
  );
  
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  
  return decrypted.toString();
}