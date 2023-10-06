import * as jwt from 'jsonwebtoken';

export class JwtService {
  async generateAccessToken(user_id: number, username: string, userRole: number): Promise<string> {
    try {
      const accessToken = jwt.sign(
        {
          id: user_id,
          username,
          role: userRole,
        },
        process.env.ACCESS_KEY_SECRET,
        {
          expiresIn: '5m',
        },
      );
      return accessToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateRefreshToken(user_id: number, tokenHash: string): Promise<string> {
    try {
      const refreshToken = jwt.sign(
        {
          id: user_id,
          hash: tokenHash,
        },
        process.env.REFRESH_KEY_SECRET,
        {
          expiresIn: '30d',
        },
      );
      return refreshToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async verifyRefreshToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, process.env.REFRESH_KEY_SECRET ?? '');
    } catch (err) {
      throw err;
    }
  }
}
