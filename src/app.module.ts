// MO
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DockerModule } from './docker/docker.module';

// APP
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [ScheduleModule.forRoot(), DockerModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
