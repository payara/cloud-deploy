import { runPclCommand } from '../pcl';

export async function uploadToPayaraCloud(
    pclExecutable: string,
    subscriptionName: string | null,
    namespace: string,
    appName: string,
    warFile: string
) {
    try {
        const args: string[] = ['upload', '-n', namespace, '-a', appName];

        if (subscriptionName) {
            args.push('-s', `"${subscriptionName}"`);
        }

        args.push(warFile);

        await runPclCommand(pclExecutable, args);
    } catch (error) {
        throw new Error(`Failed to upload WAR file: ${(error as Error).message}`);
    }
}
