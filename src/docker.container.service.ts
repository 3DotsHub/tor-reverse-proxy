import { Injectable, Logger } from '@nestjs/common';
import { Docker } from './docker.client.service';
import { HiddenServiceKeywords, HiddenServiceIdentifier } from './app.types';

@Injectable()
export class DockerContainer {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private docker: Docker) {}

	async list(): Promise<[]> {
		return new Promise((resolve) => {
			this.docker.listContainers((error: any, list: []) => {
				if (error) resolve([]);
				else resolve(list);
			});
		});
	}

	async inspect(id: string): Promise<object> {
		return new Promise((resolve) => {
			const container = this.docker.getContainer(id);
			container.inspect((error: any, inspect: any) => {
				if (error) resolve(null);
				else resolve(inspect);
			});
		});
	}

	async scan(): Promise<object[]> {
		const containers = await this.list();
		const verifiedContainers: object[] = [];

		// do for each container
		for (let i = 0; i < containers.length; i++) {
			const inspect = await this.inspect(containers.at(i)['Id']);
			const env = this.decodeEnvKeyPairArray(inspect['Config']['Env']);

			// verifiy profile keyword
			if (!env[HiddenServiceKeywords.profile]) continue;

			// verify namespace keyword, if available
			const processNamespace: string = process.env.NAMESPACE || 'torreverseproxy';
			if (processNamespace && env[HiddenServiceKeywords.namespace] != processNamespace) continue;

			// push
			verifiedContainers.push(inspect);
		}

		// finalize
		return verifiedContainers;
	}

	decodeEnvKeyPairArray(envRaw: string[]): object {
		const env = {};
		for (let j = 0; j < envRaw.length; j++) {
			const [key, value] = envRaw.at(j).split('=');
			env[key] = value;
		}
		return env;
	}

	decodeScanToHiddenServiceIdentifier(list: object[]): HiddenServiceIdentifier[] {
		const decoded: HiddenServiceIdentifier[] = [];
		for (let item of list) {
			const env = this.decodeEnvKeyPairArray(item['Config']['Env']);
			const net = item['NetworkSettings']['Networks'][env[HiddenServiceKeywords.namespace]];
			const hn = item['Config']['Hostname'];

			if (!net) {
				this.logger.warn('Not in overlay network');
				continue;
			}

			decoded.push({
				hostname: hn,
				ipaddress: item['NetworkSettings']['Networks'][env[HiddenServiceKeywords.namespace]]['IPAddress'],
				profile: env[HiddenServiceKeywords.profile] || hn,
				namespace: env[HiddenServiceKeywords.namespace],
				port: parseInt(env[HiddenServiceKeywords.port]) || 80,
			});
		}
		return decoded;
	}
}
