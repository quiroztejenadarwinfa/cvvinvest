// Test para verificar que el TOTP funciona correctamente
// Este test usa valores conocidos de RFC 6238

// Base32 encoding para TOTP
function base32Encode(buffer: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i]
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

// Base32 Decode
function base32Decode(encoded: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  const output: number[] = []

  for (let i = 0; i < encoded.length; i++) {
    const index = alphabet.indexOf(encoded[i].toUpperCase())
    if (index < 0) throw new Error(`Invalid base32 character: ${encoded[i]}`)
    
    value = (value << 5) | index
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }

  return new Uint8Array(output)
}

// HMAC-SHA1 usando Web Crypto API
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const keyBuffer = key.buffer.slice(key.byteOffset, key.byteOffset + key.byteLength) as ArrayBuffer
  const messageBuffer = message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength) as ArrayBuffer
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageBuffer
  )
  return new Uint8Array(signature)
}

// Calcular TOTP 
async function calculateTOTP(secret: string, timestamp?: number): Promise<string> {
  try {
    let time = Math.floor((timestamp || Date.now()) / 1000 / 30)
    const timeBytes = new Uint8Array(8)
    
    for (let i = 7; i >= 0; i--) {
      timeBytes[i] = time & 0xff
      time = time >> 8
    }

    const secretBytes = base32Decode(secret)
    const hmac = await hmacSha1(secretBytes, timeBytes)
    
    const offset = hmac[hmac.length - 1] & 0x0f
    const p = (
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff)
    )

    return ((p % 1000000) + '').padStart(6, '0')
  } catch {
    return '000000'
  }
}

// Test con valores de RFC 6238
async function testTOTP() {
  console.log('Testing TOTP with RFC 6238 test vectors...\n')

  // Secret: JBSWY3DPEBLW64TMMQ====== (base32 encoded)
  // Este es el secreto de prueba estándar para "12345678901234567890"
  const testSecret = 'JBSWY3DPEBLW64TMMQ======'
  
  // Test cases from RFC 6238 (timestamps in SECONDS, not milliseconds)
  const testCases = [
    { timestamp: 59, expected: '287082' },
    { timestamp: 1111111109, expected: '081804' },
    { timestamp: 1111111111, expected: '050471' },
    { timestamp: 1234567890, expected: '005924' },
    { timestamp: 2000000000, expected: '279037' },
    { timestamp: 20000000000, expected: '353393' },
  ]

  for (const test of testCases) {
    // Convertir segundos a milisegundos para la función
    const code = await calculateTOTP(testSecret, test.timestamp * 1000)
    const status = code === test.expected ? '✓' : '✗'
    console.log(`${status} Timestamp: ${test.timestamp}s, Expected: ${test.expected}, Got: ${code}`)
  }
}

// Run test
testTOTP().catch(console.error)
