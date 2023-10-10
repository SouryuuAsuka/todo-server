import 'module-alias/register';
import * as express from 'express';
import { projectRouter, taskRouter, commentRouter, userRouter } from '@framework/web/routes';
import dependency from '@configuration/projectDependencies';
import * as fs from 'fs';
import * as os from 'os';

const multer  = require('multer');
const upload = multer({ dest: os.tmpdir() });

const PORT = 3000;
const HOST = '0.0.0.0';
const app: express.Express = express();

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
app.use('/api/static', express.static('../dist'))

app.use('/api/users/', userRouter(dependency));
app.use('/api/projects/', projectRouter(dependency));
app.use('/api/projects/', taskRouter(dependency));
app.use('/api/projects/', commentRouter(dependency));
app.post('/api/files', upload.single('file'), (req:any, res) => {
  console.log(JSON.stringify(req.file));
  let file = req.file;
  file.originalname = req.body.filename;
  fs.writeFile("../dist", file , function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    res.json({});
}); 
})
