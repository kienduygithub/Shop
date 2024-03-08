import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors'
import viewEngine from './config/viewEngine';
import initWebRoutes from './route/web';
import connectDB from './config/connectDB'
require('dotenv').config();
let app = express();
let port = process.env.PORT || 8080;
app.use(cors(
    {
        origin: process.env.URL_CLIENT,
        credentials: true
    }
))
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// CONFIG
viewEngine(app);
initWebRoutes(app)

connectDB();

app.listen(port, () => {
    console.log(`>>> BE NodeJS is running on http://localhost:${ port }`);
})