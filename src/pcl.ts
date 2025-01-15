import * as exec from '@actions/exec';
import * as core from '@actions/core';

export async function ensureJavaIsAvailable() {
    try {
        await exec.exec('java', ['-version'], {
            silent: false,
            listeners: {
                stdout: (data: Buffer) => core.info(data.toString()),
                stderr: (data: Buffer) => core.error(data.toString()),
            }
        });
    } catch (error) {
        core.setFailed('Java is not installed. Please ensure actions/setup-java is used in your workflow.');
        throw new Error('Java not available');
    }
}

export async function runPclCommand(command: string, args: string[]) {
    await ensureJavaIsAvailable();

    try {
        const javaArgs = ['-jar', command, ...args];
        core.debug(`Running PCL command: java ${javaArgs.join(' ')}`);

        await exec.exec('java', javaArgs, {
            silent: false,
            listeners: {
                stdout: (data: Buffer) => core.info(data.toString()),
                stderr: (data: Buffer) => core.error(data.toString()),
            },
        });
    } catch (error) {
        core.setFailed(`Failed to execute PCL command: ${(error as Error).message}`);
    }
}
