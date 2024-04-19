// MO
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

// APP
import { AppWorkflow } from './app.service';
import { Docker } from './docker.client.service';
import { DockerContainer } from './docker.container.service';
import { DockerNetwork } from './docker.network.service';
import { TorControl } from './tor.control.service';

@Module({
	imports: [ScheduleModule.forRoot()],
	providers: [AppWorkflow, Docker, DockerContainer, DockerNetwork, TorControl],
})
export class AppModule {}
