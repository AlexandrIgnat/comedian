import http from "node:http";
import fs from 'node:fs/promises';
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";

const PORT = 8080;
const COMEDIANS = "./comedians.json";
const CLIENTS = "./clients.json";

const startServer = async () => {
    if (!(await checkFile(COMEDIANS))) {
        return;
    }

    const comedians = JSON.parse(await fs.readFile("comedians.json", "utf-8"));

    http
        .createServer(async (req, res) => {
            try {
                res.setHeader("Access-Control-Allow-Origin", "*");
                const segment = req.url.split('/').filter(Boolean);

                if (req.method === "GET" && segment[0] === "comedians") {
                    handleComediansRequest(req, res, comedians, segment);
                    
                    return;
                }
                
                sendError(res, 404, "Not found");
            } catch (error) {
                sendError(res, 500, `Ошибка сервера ${error}`)
            }
        })
        .listen(PORT);
        console.log('Сервер запущен');       
}

startServer()
