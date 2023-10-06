export interface IJwtService {
  generateAccessToken(user_id: number, email: string, userRole: number): Promise<string>;
  generateRefreshToken(user_id: number, tokenHash: string): Promise<string>;
  verifyRefreshToken(token: string): Promise<any>;
}
