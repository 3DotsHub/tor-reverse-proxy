const Dockerode = require('dockerode');
import { Injectable } from '@nestjs/common';

@Injectable()
export class Docker extends Dockerode {
	constructor() {
		const socketPath: string = process.env.SOCKETPATH || '/var/run/docker.sock';
		super({ socketPath });
	}
}
