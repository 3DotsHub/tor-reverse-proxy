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
			// Fetching all containers
			this.logger.log(`Scanning for valid containers... --namespace ${process.env.NAMESPACE || 'torreverseproxy'}`);
			const list: object[] = await this.dockerContainer.scan();
			const decodedList: HiddenServiceIdentifier[] = this.dockerContainer.decodeScanToHiddenServiceIdentifier(list);

			// Check if list is empty
			if (decodedList.length == 0) {
				this.logger.log('No valid containers found.');
				this.running = false;
				return;
			}

			// Check if list has not been updated
			if (JSON.stringify(this.prevDecodedList) == JSON.stringify(decodedList)) {
				const responseTorStatus = await this.torControl.isRunning();
				const responseTorRestart = !responseTorStatus && (await this.torControl.start());

				this.logger.log(`No updates. Entries: ${decodedList.length}`);
				this.logger.log(`Tor.running: ${responseTorStatus}, Tor.restart: ${responseTorRestart}`);

				this.running = false;
				return;
			}

			// log and update
			this.prevDecodedList = decodedList;
			this.logger.log(`Validated container list updated. Entries: ${decodedList.length}`);

			// Tor stop
			const responseTorStop = await this.torControl.stop();
			this.logger.log(`Tor.stopped: ${responseTorStop}`);

			// Write rules
			const responseTorWriteRules = await this.torControl.writeRules(decodedList);
			this.logger.log(`Tor.writeRules: ${responseTorWriteRules}`);

			// Tor start
			const responseTorStart = await this.torControl.start();
			this.logger.log(`Tor.started: ${responseTorStart}`);

			// finalize workflow
			this.running = false;
		} catch (error) {
			// finalize error
			this.logger.error(error);
			this.running = false;
		}
	}
}
