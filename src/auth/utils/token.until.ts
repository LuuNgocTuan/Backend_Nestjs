import * as bcrypt from 'bcrypt';

/**
 * Hash refresh token trước khi lưu DB
 */
export async function hashRefreshToken(token: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
}

/**
 * So sánh refresh token từ client với token đã hash trong DB
 */
export async function compareRefreshToken(
    token: string,
    hashedToken: string,
): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
}