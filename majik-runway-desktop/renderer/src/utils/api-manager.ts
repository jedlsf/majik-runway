
import { appendStrings, hashString, isSTXExpired, secureReverse, secureTimecode } from "./helper";





export interface EncodedAPI {
    /** API Key */
    k: string;

    /** API Hash */
    h: string;

    /** STX Timestamp in Base64 */
    s: string;

    /** STX Hash */
    sh: string;

    /** Combined Payload Hash */
    r: string;
}



export class APIKeyManager {
    private API_KEY: string;
    private API_HASH: string;

    constructor(apiKey: string) {
        this.API_KEY = apiKey;
        this.API_HASH = hashString(apiKey);
    }

    /**
     * Initialize a new APIKeyManager instance
     */
    static initialize(apiKey: string): APIKeyManager {
        return new APIKeyManager(apiKey);
    }

    /**
   * Generate a root hash given an STX and this instance’s key/hash
   */
    private generateRootHash(stx: string): string {
        const appendedStrings = appendStrings([
            secureReverse(stx),
            this.API_KEY,
            stx,
            this.API_HASH
        ]);

        return hashString(appendedStrings);
    }

    /**
   * Validate an encoded API payload
   */
    private static validatePayload(payload: EncodedAPI): boolean {
        const { k, h, s, sh, r } = payload;

        if (!k?.trim() || !h?.trim() || !s?.trim() || !sh?.trim() || !r?.trim()) {
            throw new Error("There seems to be a problem with this API Key.");
        }

        // Validate API key hash
        if (hashString(k) !== h) {
            throw new Error("Invalid API hash – mismatch detected.");
        }

        // Validate STX hash
        if (hashString(s) !== sh) {
            throw new Error("Invalid STX hash – mismatch detected.");
        }

        if (isSTXExpired(s, 90)) {
            throw new Error("Invalid STX – Expired.");
        }

        // Validate root hash

        const appendedRootString = appendStrings([
            secureReverse(s),
            k,
            s,
            h
        ]);
        const rootHashCheck = hashString(appendedRootString);

        if (rootHashCheck !== r) {
            throw new Error("Invalid root hash – tampering detected.");
        }

        return true;
    }

    /**
     * Encodes the current instance into a base64 string
     */
    encodeAPI(): string {

        const stx = secureTimecode();
        const rootHash = this.generateRootHash(stx);
        const payload: EncodedAPI = {
            "k": this.API_KEY,
            "h": this.API_HASH,
            "s": stx,
            "sh": hashString(stx),
            "r": rootHash
        };

        const json = JSON.stringify(payload);
        return Buffer.from(json).toString("base64");
    }

    /**
     * Decodes a base64 string and returns the API_KEY
     */
    static decodeAPI(encoded: string): string {
        const decoded = Buffer.from(encoded, "base64").toString("utf-8");
        const payload = JSON.parse(decoded) as EncodedAPI;

        this.validatePayload(payload);

        return payload.k;
    }



    get API(): string {
        return this.API_KEY;
    }


}

