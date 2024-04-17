import { Injectable, Logger } from '@nestjs/common';
import { Docker } from './docker.client.service';

@Injectable()
export class DockerHelper {
	constructor(private docker: Docker) {}

	async listContainers(): Promise<[]> {
		return new Promise((resolve) => {
			this.docker.listContainers((error: any, list: []) => {
				if (error) resolve([]);
				else resolve(list);
			});
		});
	}

	async inspectContainer(id: string): Promise<object> {
		return new Promise((resolve) => {
			const container = this.docker.getContainer(id);
			container.inspect((error: any, inspect: any) => {
				if (error) resolve(null);
				else resolve(inspect);
			});
		});
	}
}
