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
      if (!res.locals.isAuth) {
        throw new Error('Пользователь не найден')
      }
      const userId = res.locals.userId;
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
      let url = new URL(req.headers.origin);
      res.cookie('accessToken', accessToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None'
      })
      res.cookie('refreshToken', refreshToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None'
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
      let url = new URL(req.headers.origin);
      res.cookie('accessToken', accessToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None',
      })
      res.cookie('refreshToken', refreshToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None'
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
      const { id, hash } = await tokenService.verifyRefreshToken(req.cookies.refreshToken);

      const { accessToken, refreshToken } = await updateRefreshToken(id, hash);
      let url = new URL(req.headers.origin);
      res.cookie('accessToken', accessToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None',
      })
      res.cookie('refreshToken', refreshToken, {
        domain: url.hostname,
        secure: false,
        sameSite: 'None',
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