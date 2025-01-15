import * as core from '@actions/core';
import * as path from 'path';
import { downloadPclJarFile } from './download';
import { uploadToPayaraCloud } from './actions/upload';
import { deployToPayaraCloud } from './actions/deploy';

async function main() {
        core.info('Starting PCL command...');
        core.setOutput('log', 'Starting PCL command...');
    try {
        // Retrieve input parameters
        const token = core.getInput('token');
        const namespace = core.getInput('namespace');
        const appName = core.getInput('app_name');
        const artifact = core.getInput('artifact');
        const pclVersion = core.getInput('pcl_version') || '1.0.1';

        // Set environment variables
        process.env.PCL_AUTH_TOKEN = token;
        process.env.PCL_ENDPOINT = 'https://manage.dev02-head.payara.cloud'; // Or use a dynamic input
        process.env.PCL_CLIENT_ID = 'OPWL6h4SUxPHa1rMZ9flPStKkxnMQj8H';

        // Download PCL
        const pclBinaryUrl = `https://nexus.payara.fish/repository/payara-artifacts/fish/payara/cloud/pcl/${pclVersion}/pcl-${pclVersion}.jar`;
        const pclJarPath = path.join(__dirname, `pcl-${pclVersion}.jar`);

        core.setOutput('download_source', pclBinaryUrl);

        await downloadPclJarFile(pclBinaryUrl, pclJarPath);

        // Step 1: Upload the WAR file
        await uploadToPayaraCloud(pclJarPath, namespace, appName, artifact);

        // Step 2: Deploy the WAR file
        await deployToPayaraCloud(pclJarPath, namespace, appName);

        core.info('Deployment to Payara Cloud completed.');
    } catch (error) {
        // @ts-ignore
        core.error((error as Error).stack);
        core.error((error as Error).message);
        core.setFailed(`Action failed: ${(error as Error).message}`);
    }
}

main();
