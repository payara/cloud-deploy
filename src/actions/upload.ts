import {runPclCommand} from '../pcl';

export async function uploadToPayaraCloud(
    pclExecutable: string,
    subscriptionName: string | null,
    namespace: string,
    appName: string,
    warFile: string
) {
    const args: string[] = ['upload', '-n', namespace, '-a', appName];

    if (subscriptionName) {
        args.push('-s', subscriptionName);
    }

    args.push(warFile);

    await runPclCommand(pclExecutable, args);
}
