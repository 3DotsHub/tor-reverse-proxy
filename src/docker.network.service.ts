import { Injectable, Logger } from '@nestjs/common';
import { Docker } from './docker.client.service';

@Injectable()
export class DockerNetwork {
	constructor(private docker: Docker) {}

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
	async init(): Promise<boolean> {
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
	async start(): Promise<object> {
		return new Promise((resolve) => {
			// const item = this.docker.getNetwork(id);
			// item.inspect((error: any, inspect: any) => {
			// 	if (error) resolve(null);
			// 	else resolve(inspect);
			// });
		});
	}

	/**
	 *
	 * @returns EXECUTION STATE
	 * @returns true: successful execution
	 * @returns false: failed execution
	 */
	async stop(): Promise<object> {
		return new Promise((resolve) => {
			// const item = this.docker.getNetwork(id);
			// item.inspect((error: any, inspect: any) => {
			// 	if (error) resolve(null);
			// 	else resolve(inspect);
			// });
		});
	}
}
