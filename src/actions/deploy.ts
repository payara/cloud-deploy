import { runPclCommand } from '../pcl';

export async function deployToPayaraCloud(pclExecutable: string, namespace: string, appName: string) {
    try {
        console.info('Deploying WAR file to Payara Cloud...');
        await runPclCommand(pclExecutable, ['deploy', '-n' , namespace, '-a', appName]);
        console.info('WAR file deployed successfully.');
    } catch (error) {
        throw new Error(`Failed to deploy WAR file: ${(error as Error).message}`);
    }
}
