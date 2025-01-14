import { runPclCommand } from '../pcl';

export async function deployToPayaraCloud(pclExecutable: string) {
    try {
        console.info('Deploying WAR file to Payara Cloud...');
        await runPclCommand(pclExecutable, ['deploy']);
        console.info('WAR file deployed successfully.');
    } catch (error) {
        const e = error as Error;  // Type assertion
        throw new Error(`Failed to deploy WAR file: ${e.message}`);
    }
}
