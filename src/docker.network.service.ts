import { Injectable, Logger } from '@nestjs/common';
import { Docker } from './docker.client.service';

@Injectable()
export class DockerNetwork {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private docker: Docker) {}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async init(): Promise<boolean> {
		// const running = await this.isRunning();
		// if (running) return this.stop();
		return true;
	}

	async list(): Promise<[]> {
		return new Promise((resolve) => {
			this.docker.listNetworks((error: any, list: []) => {
				if (error) resolve([]);
				else resolve(list);
			});
		});
	}

	async inspect(id: string): Promise<object> {
		return new Promise((resolve) => {
			const item = this.docker.getNetwork(id);
			item.inspect((error: any, inspect: any) => {
				if (error) resolve(null);
				else resolve(inspect);
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
			// const item = this.docker.getNetwork(id);
			// item.inspect((error: any, inspect: any) => {
			// 	if (error) resolve(null);
			// 	else resolve(inspect);
			// });
			resolve(true);
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
			// const item = this.docker.getNetwork(id);
			// item.inspect((error: any, inspect: any) => {
			// 	if (error) resolve(null);
			// 	else resolve(inspect);
			// });
			resolve(true);
		});
	}
}
