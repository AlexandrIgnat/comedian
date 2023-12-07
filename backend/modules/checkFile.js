import fs from "node:fs/promises";
export const checkFile = async ($path, $isFileMissing) => {
    try {
        await fs.access($path);
    } catch (error) {
        console.log("error: ", error);
        if ($isFileMissing) {
            await fs.writeFile($path, JSON.stringify([]));
            console.log(`Файл ${$path} был создан!`);
            
            return true;
        }
        console.error(`Файл ${path} не найден!`);
        
        return false;
    }

    return true;
}