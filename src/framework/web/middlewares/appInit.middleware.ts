import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  console.log(JSON.stringify(req.cookies));
  if (req.cookies?.accessToken && !(req.url.includes('/token') && req.method === 'GET')) {
    jwt.verify(req.cookies?.accessToken, process.env.ACCESS_KEY_SECRET, async function (err, decoded) {
      if (err) {
        return res.status(401).json({});
      } else {
        res.locals.isAuth = true;
        res.locals.userRole = decoded.userRole;
        res.locals.userId = decoded.userId;
        if (decoded.userRole == 5 || decoded.userRole == 6) {
          res.locals.isAuth = true;
        } else {
          res.locals.isAdmin = false;
        }
        console.log(JSON.stringify(res.locals));
        next();
      }
    })
  } else {
    res.locals.isAuth = false;
    res.locals.isAdmin = false;
    res.locals.userId = null;
    next();
  }
}

const appInit = [
  cors({ credentials: true, origin: true }),
  bodyParser.urlencoded({ extended: false }), // parse application/x-www-form-urlencoded
  bodyParser.json(),  // parse application/json
  jwtAuth
]

export default appInit;