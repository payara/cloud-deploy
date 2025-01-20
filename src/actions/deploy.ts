import {runPclCommand} from '../pcl';

export async function deployToPayaraCloud(
    pclExecutable: string,
    subscriptionName: string | null,
    namespace: string,
    appName: string
) {
    const args: string[] = ['deploy', '-n', namespace, '-a', appName];

    if (subscriptionName) {
        args.push('-s', subscriptionName);
    }

    await runPclCommand(pclExecutable, args);
}
