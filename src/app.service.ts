import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Docker } from './docker/services/docker.client.service';
import { DockerHelper } from './docker/services/docker.helper.service';

const HiddenServiceKeywords = ['HIDDENSERVICE_PROFILE', 'HIDDENSERVICE_PORT'];
type HiddenServiceIdentifier = {
	hostname: string;
	profile: string;
	port: number;
};

@Injectable()
export class AppService {
	private readonly logger = new Logger(this.constructor.name);
	private running: boolean = false;

	constructor(private readonly dockerHelper: DockerHelper) {
		this.workflow();
	}

	@Interval(10 * 1000)
	async workflow() {
		if (this.running) return;
		this.running = true;

		// Fetching all containers...
		this.logger.log('Fetching all containers...');
		const containers = await this.dockerHelper.listContainers();

		// do for each container
		for (let i = 0; i < containers.length; i++) {
			const inspect = await this.dockerHelper.inspectContainer(containers.at(i)['Id']);
			const env: String[] = inspect['Config']['Env'];

			// collect env
			const envKeys = [];
			const envVals = [];
			for (let j = 0; j < env.length; j++) {
				const [key, value] = env.at(j).split('=');
				envKeys.push(key);
				envVals.push(value);
			}

			// verifiy keywords
			const verifyHiddenServiceKeywords = envKeys.includes(HiddenServiceKeywords.at(0));
			if (!verifyHiddenServiceKeywords) continue;

			// get names
			const names: string[] = containers.at(i)['Names'];

			console.log(inspect);
		}

		this.running = false;
	}
}
