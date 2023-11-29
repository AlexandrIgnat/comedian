import http from "node:http";
import fs from 'node:fs/promises';
import { log } from "node:console";

const PORT = 8080;
const COMEDIANS = "./comedians.json";
const CLIENTS = "./clients.json";

const checkFiles = async () => {
    try {
        await fs.access(COMEDIANS);
    } catch (error) {
        console.error(`Файл ${COMEDIANS} не найден!`);
        return false;
    }

    try {
        await fs.access(CLIENTS);
    } catch (error) {
        await fs.writeFile(CLIENTS, JSON.stringify([]));
        console.log(`Файл ${CLIENTS} был создан!`);
        return false;
    }

    return true;
}

const sendData = function(res, data) {
    res.writeHead(200, {
        "Content-Type": "text/json; charset=utf-8",
    });

    res.end(data);
}

const sendError = function(res, status, error) {
    res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(error);
}

const startServer = async () => {
    if (!(await checkFiles())) {
        return;
    }
    http
        .createServer(async (req, res) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            const segment = req.url.split('/').filter(Boolean);

            if (req.method === "GET" && segment[0] === "comedians") {
                try {
                    const data = JSON.parse(await fs.readFile("comedians.json", "utf-8"));

                    if (segment.length === 2) {
                        const comedian = data.filter(c => c.id === segment[1]);

                        if (!comedian) {
                            sendError(res, 404, "Stand up комик не найден");
                            
                            return;
                        }

                        sendData(res, JSON.stringify(comedian));
                        return;
                    }
                    sendData(res, JSON.stringify(comedian));
                    return;
                } catch (error) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain; charset=utf-8",
                    });
                    res.end(`Ошибка сервера ${error}`);
                }

            } else {
                res.writeHead(400, {
                    "Content-Type": "text/plain; charset=utf-8",
                });
                res.end("Not found");
            }
        })
        .listen(PORT);
        console.log('Сервер запущен');       
}

startServer()
