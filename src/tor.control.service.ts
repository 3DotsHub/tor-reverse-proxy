import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { HiddenServiceIdentifier } from './app.types';

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
		// display state
		if (running) this.logger.log('Systemctl state <running> for tor.service.');
		else this.logger.log('Systemctl state <inactive> for tor.service.');
		// default stop at init
		if (running) return this.stop();
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async isRunning() {
		return new Promise((resolve) => {
			const cmd = 'systemctl status tor.service';
			exec(cmd, (err, stdout, stderr) => {
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
	async start(): Promise<boolean> {
		return new Promise((resolve) => {
			const cmd = 'systemctl start tor.service';
			exec(cmd, (err, stdout, stderr) => {
				if (!err) this.logger.log('Systemctl started tor.service.');
				if (err) this.logger.error('Systemctl failed to start tor.service.');
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
			const cmd = 'systemctl stop tor.service';
			exec(cmd, (err, stdout, stderr) => {
				if (!err) this.logger.log('Systemctl stopped tor.service.');
				if (err) this.logger.error('Systemctl failed to stop tor.service.');
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
		return new Promise((resolve) => {
			try {
				// this.logger.log(rules);
				this.logger.log(`Writing rules successful.`);
				resolve(true);
			} catch (error) {
				this.logger.error('Writing rules failed.');
				resolve(false);
			}
			// const cmd = 'systemctl status tor.service';
			// exec(cmd, (err, stdout, stderr) => {
			// 	resolve(err == null);
			// });
		});
	}
}
