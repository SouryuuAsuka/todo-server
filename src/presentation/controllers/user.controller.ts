import { IDependency } from '@application/ports/IDependency';
import userUseCase from '@application/use-cases/user.use-case';
const userControllerCreate = (dependencies: IDependency) => {
  const { userRepository } = dependencies.DatabaseService;
  const cryptoService = dependencies.CryptoService;
  const tokenService = dependencies.JwtService;
  const {
    getUser,
    createUser,
    signin,
    updateRefreshToken
  } = userUseCase(userRepository, cryptoService, tokenService);
  const getController = async (req: any, res: any, next: any) => {
    try {
      if (req.locals.isAuth) {
        throw new Error('Пользователь не найден')
      }
      const userId = req.locals.userId;
      const user = await getUser(userId);
      return res.status(200).json({
        status: 'success',
        data: {
          user
        },
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const createController = async (req: any, res: any, next: any) => {
    try {
      const { username, password, avatar } = req.body;
      const { accessToken, refreshToken, user } = await createUser(username, password, avatar);
      res.cookie('accessToken', accessToken, {
        domain: process.env.SERVER_HOST,
      })
      res.cookie('refreshToken', refreshToken, {
        domain: process.env.SERVER_HOST,
      })
      return res.status(200).json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const signinController = async (req: any, res: any, next: any) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, user } = await signin(username, password);
      res.cookie('accessToken', accessToken, {
        domain: process.env.SERVER_HOST,
      })
      res.cookie('refreshToken', refreshToken, {
        domain: process.env.SERVER_HOST,
      })
      return res.status(200).json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  const refreshTokenController = async (req: any, res: any, next: any) => {
    try {
      if (req.cookies.refreshToken === undefined) throw new Error("Unauthorized access.");
      const { userId, hash } = await tokenService.verifyRefreshToken(req.cookies.refreshToken);
      const { accessToken, refreshToken } = await updateRefreshToken(userId, hash);
      res.cookie('accessToken', accessToken, {
        domain: process.env.SERVER_HOST,
      })
      res.cookie('refreshToken', refreshToken, {
        domain: process.env.SERVER_HOST,
      })
      return res.status(200).json({
        status: 'success',
        data: {}
      })
    } catch (err: any) {
      return res.status(500).json({
        status: 'error',
        message: err.message ?? "Server error"
      })
    }
  }
  return {
    getController,
    createController,
    signinController,
    refreshTokenController,
  }
}

export default userControllerCreate;