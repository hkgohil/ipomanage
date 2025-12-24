import * as crypto from "crypto"

const ENCRYPTION_KEY = process.env.PAN_ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex")
const ALGORITHM = "aes-256-gcm"

function getKey(): Buffer {
  return crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
}

export function encryptPAN(pan: string): string {
  const key = getKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(pan, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
}

export function decryptPAN(encryptedPAN: string): string {
  const key = getKey()
  const parts = encryptedPAN.split(":")
  
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted PAN format")
  }

  const [ivHex, authTagHex, encrypted] = parts
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

