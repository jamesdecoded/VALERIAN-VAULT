// JWT Utility Functions (Simplified client-side implementation)
// Note: In production, JWT should be generated and verified on the server

const JWT_SECRET = 'valerian-vault-secret-key-2024'; // In production, use environment variable on server

// Base64 URL encoding
function base64UrlEncode(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Base64 URL decoding
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return atob(str);
}

// Simple HMAC SHA256 simulation (for demo purposes)
// In production, use a proper crypto library on the server
async function simpleHash(message, secret) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate JWT Token
async function generateToken(payload, expiresIn = '7d') {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const expiration = now + (7 * 24 * 60 * 60); // 7 days

    const tokenPayload = {
        ...payload,
        iat: now,
        exp: expiration
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
    
    const signature = await simpleHash(encodedHeader + '.' + encodedPayload, JWT_SECRET);
    const encodedSignature = base64UrlEncode(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// Verify JWT Token
async function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        
        // Verify signature
        const expectedSignature = await simpleHash(encodedHeader + '.' + encodedPayload, JWT_SECRET);
        const expectedEncodedSignature = base64UrlEncode(expectedSignature);

        if (encodedSignature !== expectedEncodedSignature) {
            return null;
        }

        // Decode payload
        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiration
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return null; // Token expired
        }

        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

// Decode JWT without verification (for reading payload)
function decodeToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        return JSON.parse(base64UrlDecode(parts[1]));
    } catch (error) {
        return null;
    }
}

// Export functions
window.JWT = {
    generateToken,
    verifyToken,
    decodeToken
};
