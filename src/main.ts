import * as core from '@actions/core';
import * as path from 'path';
import { downloadPclJarFile } from './download';
import { uploadToPayaraCloud } from './actions/upload';
import { deployToPayaraCloud } from './actions/deploy';

async function main() {
        core.debug('Starting PCL command...');
    try {
        // Retrieve input parameters
        const token = core.getInput('token');
        const subscriptionName = core.getInput('subscription_name');
        const namespace = core.getInput('namespace');
        const appName = core.getInput('app_name');
        const artifact = core.getInput('artifact_location');
        const isDeploy = core.getInput('deploy') === 'true';
        const pclVersion = core.getInput('pcl_version') || '1.1.0';

        // Set environment variables
        process.env.PCL_AUTH_TOKEN = token;

        // Download PCL
        const pclBinaryUrl = `https://nexus.payara.fish/repository/payara-artifacts/fish/payara/cloud/pcl/${pclVersion}/pcl-${pclVersion}.jar`;
        const pclJarPath = path.join(__dirname, `pcl-${pclVersion}.jar`);
        core.debug(`Downloading PCL JAR file from ${pclBinaryUrl}...`);

        await downloadPclJarFile(pclBinaryUrl, pclJarPath);
        core.debug(`PCL JAR file downloaded to ${pclJarPath}`);
        await uploadToPayaraCloud(pclJarPath, subscriptionName, namespace, appName, artifact);

        if (isDeploy) {
            core.info('Deploying to Payara Cloud...');
            await deployToPayaraCloud(pclJarPath, subscriptionName, namespace, appName);
        }

        core.info('Deployment to Payara Cloud completed.');
    } catch (error) {
        core.debug(`Error: ${(error as Error).message}`);
        core.debug(`Error: ${(error as Error).stack}`);
        core.setFailed(`Action failed: ${(error as Error).message}`);
    }
}

main();
