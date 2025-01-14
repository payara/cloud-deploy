import * as axios from 'axios';
import * as fs from 'fs';

export async function downloadPclJarFile(url: string, outputPath: string): Promise<void> {
    const writer = fs.createWriteStream(outputPath);

    try {
        const response = await axios.default.get(url, { responseType: 'stream' });
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', (err) => {
                // Remove partially downloaded file on error
                fs.unlink(outputPath, () => reject(err));
            });
        });
    } catch (error) {
        throw new Error(`Failed to download PCL binaries: ${(error as Error).message}`);
    } finally {
        writer.close();
    }
}
