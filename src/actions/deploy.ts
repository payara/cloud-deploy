import { runPclCommand } from '../pcl';

export async function deployToPayaraCloud(
    pclExecutable: string,
    subscriptionName: string | null,
    namespace: string,
    appName: string
) {
    try {
        const args: string[] = ['deploy', '-n', namespace, '-a', appName];

        if (subscriptionName) {
            args.push('-s', subscriptionName);
        }

        await runPclCommand(pclExecutable, args);
    } catch (error) {
        throw new Error(`Failed to deploy WAR file: ${(error as Error).message}`);
    }
}
