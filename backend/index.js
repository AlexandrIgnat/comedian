import http from "node:http";
import fs from 'node:fs/promises';
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";

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
                const segments = req.url.split('/').filter(Boolean);

                if (req.method === "GET" && segments[0] === "comedians") {
                    handleComediansRequest(req, res, comedians, segments);
                    
                    return;
                }
                
                if (req.method === "POST" && segments[0] === "clients") {
                    handleAddClient(req, res);
                    
                    return;
                }

                if (req.method === "GET" && segments[0] === "clients" && segments.length === 2) {
                    const ticket = segments[1];
                    handleAddClient(req, res, ticket);
                    
                    return; 
                }

                if(req.method === "PATCH" && segments[0] === "clients" && segments.length === 2) {
                    handleUpdateClient(req, res, segments);

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
