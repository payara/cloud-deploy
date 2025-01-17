import {runPclCommand} from '../pcl';

export async function uploadToPayaraCloud(
    pclExecutable: string,
    subscriptionName: string | null,
    namespace: string,
    appName: string | null,
    warFile: string,
    isDeploy: boolean
) {
    const args: string[] = ['upload', '-n', namespace];

    if (subscriptionName) {
        args.push('-s', subscriptionName);
    }

    if (appName) {
        args.push('-a', appName);
    }

    args.push(warFile);

    if (isDeploy) {
        args.push('--deploy');
    }

    await runPclCommand(pclExecutable, args);
}
