#!/usr/bin/env node
import { Command, Option } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { runCaptureCommand } from './commands/capture.js';
const program = new Command();
program
    .name('vrt')
    .description('Local-first Storybook visual capture tool')
    .version(pkg.version || '0.0.0');
program
    .command('capture')
    .description('Capture screenshots for all Storybook stories')
    .option('-u, --url <url>', 'Storybook base URL', 'http://localhost:6006')
    .option('-o, --out <dir>', 'Output directory', './.vrt')
    .option('-c, --concurrency <number>', 'Concurrent pages', (value) => Number(value), 4)
    .option('-t, --timeout <ms>', 'Navigation timeout in ms', (value) => Number(value), 30000)
    .option('-v, --viewport <size>', 'Viewport size WIDTHxHEIGHT', '1280x720')
    .option('-w, --wait <ms>', 'Extra wait after load', (value) => Number(value), 200)
    .addOption(new Option('--headful').default(false).conflicts('headless'))
    .option('--full-page', 'Capture full page screenshot', false)
    .option('--include <pattern...>', 'Only storyIds containing these substrings')
    .option('--exclude <pattern...>', 'Exclude storyIds containing these substrings')
    .option('--build-id <id>', 'Override build id')
    .action(async (opts) => {
    const { exitCode } = await runCaptureCommand(opts);
    if (exitCode !== 0) {
        process.exitCode = exitCode;
    }
});
program.parseAsync(process.argv);
