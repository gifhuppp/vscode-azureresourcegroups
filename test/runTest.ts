/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runTests } from '@vscode/test-electron';
import * as cp from 'child_process';
import * as path from 'path';

async function main(): Promise<void> {
    try {
        const vscodeExecutablePath = await downloadAndUnzipVSCode();
        const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

        cp.spawnSync(
            cli,
            [
                ...args,
                '--install-extension', 'ms-vscode.azure-account',
            ],
            {
                encoding: 'utf-8',
                stdio: 'inherit'
            });

        const repoRoot: string = path.resolve(__dirname, '..', '..');
        await runTests({
            vscodeExecutablePath,
            extensionDevelopmentPath: repoRoot,
            launchArgs: [
                path.resolve(repoRoot, 'test', 'test.code-workspace'),
                '--disable-workspace-trust'
            ],
            extensionTestsPath: path.resolve(repoRoot, 'dist', 'test', 'index'),
            extensionTestsEnv: {
                DEBUGTELEMETRY: 'v',
            }
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

void main();
