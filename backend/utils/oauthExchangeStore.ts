import crypto from "crypto";

export interface OAuthExchangeRecord {
	githubId: string;
	githubUsername: string;
	expiresAt: number;
}

const exchangeCodes = new Map<string, OAuthExchangeRecord>();
const EXPIRY_SWEEP_INTERVAL_MS = 30_000;

function cleanupExpiredExchangeCodes(now = Date.now()) {
	for (const [code, record] of exchangeCodes.entries()) {
		if (record.expiresAt <= now) {
			exchangeCodes.delete(code);
		}
	}
}

const cleanupTimer = setInterval(() => {
	cleanupExpiredExchangeCodes();
}, EXPIRY_SWEEP_INTERVAL_MS);
cleanupTimer.unref?.();

export function createOAuthExchangeCode(record: Omit<OAuthExchangeRecord, "expiresAt">) {
	cleanupExpiredExchangeCodes();

	const code = crypto.randomBytes(32).toString("hex");

	exchangeCodes.set(code, {
		...record,
		expiresAt: Date.now() + 60_000,
	});

	return code;
}

export function consumeOAuthExchangeCode(code: string) {
	cleanupExpiredExchangeCodes();

	const record = exchangeCodes.get(code);
	if (!record) {
		return null;
	}

	if (record.expiresAt <= Date.now()) {
		exchangeCodes.delete(code);
		return null;
	}

	exchangeCodes.delete(code);
	return record;
}