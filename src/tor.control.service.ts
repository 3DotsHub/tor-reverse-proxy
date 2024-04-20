import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { HiddenServiceIdentifier } from './app.types';
import { writeFileSync } from 'fs';
@Injectable()
export class TorControl {
	private readonly logger = new Logger(this.constructor.name);
	constructor() {}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async init(): Promise<boolean> {
		// get current state
		const running = await this.isRunning();
		// log state
		this.logger.log(`Tor service running: ${running}`);
		// default stop at init
		if (running) return this.stop();
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async isRunning(): Promise<boolean> {
		return new Promise((resolve) => {
			const cmd = 'service tor status';
			exec(cmd, (err, stdout, stderr) => {
				resolve(stdout != 'tor is not running ... failed!\n');
			});
		});
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async start(): Promise<boolean> {
		return new Promise((resolve) => {
			const cmd = 'service tor start';
			exec(cmd, (err, stdout, stderr) => {
				if (!err) this.logger.log('Tor service started.');
				if (err) this.logger.error('Tor service failed to start.');
				resolve(err == null);
			});
		});
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async stop(): Promise<boolean> {
		return new Promise((resolve) => {
			const cmd = 'killall tor';
			exec(cmd, (err, stdout, stderr) => {
				if (!err) this.logger.log('Tor service stopped.');
				if (err) this.logger.error('Tor service failed to stop.');
				resolve(err == null);
			});
		});
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async writeRules(rules: HiddenServiceIdentifier[]): Promise<boolean> {
		const pathToTorrc: string = '/etc/tor/torrc';
		let exportToFile: string = '';

		return new Promise((resolve) => {
			try {
				for (let rule of rules) {
					this.logger.log(`Applying rule in behalf of ${rule.hostname} for ${rule.profile} at ${rule.ipaddress}:${rule.port}`);

					exportToFile += `##### HiddenService for ${rule.profile} #####\n`;
					exportToFile += `HiddenServiceDir /var/lib/tor/${rule.profile}/\n`;
					exportToFile += `HiddenServicePort 80 ${rule.ipaddress}:${rule.port}\n`;
					exportToFile += `\n`;
				}

				writeFileSync(pathToTorrc, exportToFile);

				this.logger.log(`Writing rules successful.`);
				resolve(true);
			} catch (error) {
				this.logger.error('Writing rules failed.');
				resolve(false);
			}
		});
	}
}
