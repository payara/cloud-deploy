import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { runPclCommand } from '../pcl';

jest.mock('@actions/exec');
jest.mock('@actions/core');

describe('PCL Commands', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('ensureJavaIsAvailable', () => {
        it('should not throw if Java is available', async () => {
            (exec.exec as jest.Mock).mockResolvedValue(0);  // Simulate successful Java check
            const ensureJavaIsAvailable = jest.requireActual('../pcl').ensureJavaIsAvailable;
            await expect(ensureJavaIsAvailable()).resolves.not.toThrow();
        });

        it('should fail if Java is not available', async () => {
            (exec.exec as jest.Mock).mockRejectedValue(new Error('Java not found'));
            const ensureJavaIsAvailable = jest.requireActual('../pcl').ensureJavaIsAvailable;
            await expect(ensureJavaIsAvailable()).rejects.toThrow('Java not available');
            expect(core.setFailed).toHaveBeenCalledWith(
                'Java is not installed or not available in the PATH. Please ensure actions/setup-java is used in your workflow.'
            );
        });
    });

    describe('runPclCommand', () => {
        it('should execute the PCL command when Java is available', async () => {
            (exec.exec as jest.Mock).mockResolvedValue(0);  // Mock successful command execution
            await runPclCommand('pcl-1.0.1.jar', ['deploy']);
            expect(exec.exec).toHaveBeenCalledWith('java', ['-jar', 'pcl-1.0.1.jar', 'deploy'], expect.any(Object));
        });

        it('should setFailed when PCL command fails', async () => {
            (exec.exec as jest.Mock)
                .mockImplementationOnce(() => Promise.resolve(0))
                .mockRejectedValueOnce(new Error('PCL command failed'));
            await runPclCommand('pcl-1.0.1.jar', ['deploy']);
            expect(core.setFailed).toHaveBeenCalledWith('Failed to execute PCL command: PCL command failed');
        });
    });
});
