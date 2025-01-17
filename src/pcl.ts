import * as exec from '@actions/exec';
import * as core from '@actions/core';

export async function ensureJavaIsAvailable() {
    try {
        core.debug('Checking if Java is available...');
        core.debug(`PATH: ${process.env['RUNNER_TOOL_CACHE']}`);

        // await exec.exec(, ['-version'], {
        //     silent: true,
        //     listeners: {
        //         stdout: (data: Buffer) => core.info(data.toString()),
        //         stderr: (data: Buffer) => {
        //             const message = data.toString();
        //             // Only log certain critical errors as stderr
        //             if (message.includes('ERROR') || message.includes('Failed')) {
        //                 core.error(message);
        //             } else {
        //                 core.info(message); // Log informational messages in stdout
        //             }
        //         },
        //     }
        // });
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
                stderr: (data: Buffer) => {
                    const message = data.toString();
                    // Only log certain critical errors as stderr
                    if (message.includes('ERROR') || message.includes('Failed')) {
                        core.error(message);
                    } else {
                        core.info(message); // Log informational messages in stdout
                    }
                },
            },
        });
    } catch (error) {
        core.setFailed(`Failed to execute PCL command: ${(error as Error).message}`);
    }
}
