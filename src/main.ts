import 'module-alias/register';
import * as express from 'express';
import { projectRouter, taskRouter, commentRouter, userRouter } from '@framework/web/routes';
import dependency from '@configuration/projectDependencies';



const PORT = 3000;
const HOST = '0.0.0.0';
const app: express.Express = express();

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
app.use('/api/static', express.static(__dirname+'/../static'))
console.log(__dirname+'/../dist')
app.use('/api/users/', userRouter(dependency));
app.use('/api/projects/', projectRouter(dependency));
app.use('/api/projects/', taskRouter(dependency));
app.use('/api/projects/', commentRouter(dependency));


