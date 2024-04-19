import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { DockerContainer } from './docker.container.service';
import { TorControl } from './tor.control.service';
import { HiddenServiceIdentifier } from './app.types';
import { DockerNetwork } from './docker.network.service';

@Injectable()
export class AppWorkflow {
	private readonly logger = new Logger(this.constructor.name);
	private initing: boolean = true;
	private running: boolean = true;
	private counter: number = 0;
	private prevDecodedList: HiddenServiceIdentifier[] = [];

	constructor(
		private readonly dockerContainer: DockerContainer,
		private readonly dockerNetwork: DockerNetwork,
		private readonly torControl: TorControl
	) {
		this.workflow();
	}

	async init() {
		await this.torControl.init();
		await this.dockerNetwork.init();

		this.initing = false;
		this.running = false;
	}

	@Interval(parseInt(process.env.INTERVAL) || 5000)
	async workflow() {
		if (this.initing) await this.init();
		if (this.running) return;
		this.running = true;
		this.counter += 1;

		try {
			// Fetching all containers...
			this.logger.log(`Scanning for valid containers... --namespace ${process.env.NAMESPACE || '<undefined>'}`);
			const list: object[] = await this.dockerContainer.scan();
			const decodedList: HiddenServiceIdentifier[] = this.dockerContainer.decodeScanToHiddenServiceIdentifier(list);

			// Check if list has not been updated
			if (JSON.stringify(this.prevDecodedList) == JSON.stringify(decodedList)) {
				this.logger.log(`Validated container list NOT updated. Entries: ${decodedList.length}`);
				this.running = false;
				return;
			} else {
				this.logger.log(`Validated container list updated. Entries: ${decodedList.length}`);
				this.prevDecodedList = decodedList;
			}

			// Write rules
			const responseTorWriteRules = await this.torControl.writeRules(decodedList);

			// Tor start
			const responseTorStart = await this.torControl.start();

			// finalize workflow
			this.running = false;
		} catch (error) {
			// finalize error
			this.logger.error(error);
			this.running = false;
		}
	}
}
