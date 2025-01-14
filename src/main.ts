import * as core from '@actions/core';
import * as path from 'path';
import { downloadPclJarFile } from './download';
import { uploadToPayaraCloud } from './actions/upload';
import { deployToPayaraCloud } from './actions/deploy';

async function main() {
    try {
        // Retrieve input parameters
        const token = core.getInput('token');
        const namespace = core.getInput('namespace');
        const appName = core.getInput('app_name');
        const artifact = core.getInput('artifact');
        const pclVersion = core.getInput('pcl_version') || '1.0.1';

        // Set environment variables
        process.env.PCL_AUTH_TOKEN = token;
        process.env.PCL_ENDPOINT = 'https://manage.dev01-head.payara.cloud'; // Or use a dynamic input

        // Download PCL
        const pclBinaryUrl = `https://nexus.payara.fish/repository/payara-artifacts/fish/payara/cloud/pcl/${pclVersion}/pcl-${pclVersion}.jar`;
        const pclJarPath = path.join(__dirname, `pcl-${pclVersion}.jar`);
        await downloadPclJarFile(pclBinaryUrl, pclJarPath);

        // Run PCL Upload and Deploy
        const pclExecutable = path.join(pclJarPath, 'pcl');

        // Step 1: Upload the WAR file
        await uploadToPayaraCloud(pclExecutable, namespace, appName, artifact);

        // Step 2: Deploy the WAR file
        await deployToPayaraCloud(pclExecutable);

        core.info('Deployment to Payara Cloud completed.');
    } catch (error) {
        const e = error as Error;  // Type assertion
        core.setFailed(`Action failed: ${e.message}`);
    }
}

main();
