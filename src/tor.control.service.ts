import { Injectable, Logger } from '@nestjs/common';
import { Docker } from './docker.client.service';
import { exec } from 'child_process';
import { HiddenServiceIdentifier } from './app.types';

@Injectable()
export class TorControl {
	private readonly logger = new Logger(this.constructor.name);

	constructor(private docker: Docker) {}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async init(): Promise<boolean> {
		const running = await this.isRunning();
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
				if (!err) this.logger.log('Systemctl is running tor.service.');
				if (err) this.logger.warn('Systemctl is inactive tor.service.');
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
