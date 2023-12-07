import { sendData, sendError } from "./send.js";
export const handleComediansRequest = async function(req, res, comedians, segment) {
    if (segment.length === 2) {
        const comedian = comedians.filter(c => c.id === segment[1]);

        if (!comedian) {
            sendError(res, 404, "Stand up комик не найден");

            return;
        }
        sendData(res, comedian);

        return;
    }
    sendData(res, comedians);

    return;
}