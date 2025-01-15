import { runPclCommand } from '../pcl';

export async function uploadToPayaraCloud(pclExecutable: string, namespace: string, appName: string, warFile: string) {
    try {
        console.info('Uploading WAR file to Payara Cloud...');
        await runPclCommand(pclExecutable, ['upload', '-n', namespace, '-a', appName, warFile]);
        console.info('WAR file uploaded successfully.');
    } catch (error) {
        throw new Error(`Failed to upload WAR file: ${(error as Error).message}`);
    }
}
