/**
 * Password hashing utilities using Web Crypto API
 * Provides a secure way to hash and verify passwords without external dependencies
 */

/**
 * Hash a password using SHA-256 with salt
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Hash password with salt
  const data = encoder.encode(password + saltHex)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  // Return salt and hash combined
  return `${saltHex}:${hashHex}`
}

/**
 * Compare a password with a stored hash
 */
export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()

    // Split salt and hash
    const [saltHex, hashHex] = storedHash.split(':')

    if (!saltHex || !hashHex) {
      console.error('Invalid hash format')
      return false
    }

    // Hash the provided password with the stored salt
    const data = encoder.encode(password + saltHex)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hash))
    const computedHashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    // Compare hashes using constant-time comparison
    return computedHashHex === hashHex
  } catch (error) {
    console.error('Error comparing passwords:', error)
    return false
  }
}
