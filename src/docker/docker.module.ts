import { Module } from '@nestjs/common';
import { Docker } from './services/docker.client.service';
import { DockerHelper } from './services/docker.helper.service';

@Module({
	providers: [Docker, DockerHelper],
	exports: [Docker, DockerHelper],
	controllers: [],
})
export class DockerModule {}
