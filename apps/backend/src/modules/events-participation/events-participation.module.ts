import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { EventsParticipationController } from './events-participation.controller';
import { EventsParticipationService } from './events-participation.service';
import { EventsModule } from '../events/events.module';
import { EventParticipation } from './event-participation.entity';

@Module({
  controllers: [EventsParticipationController],
  providers: [EventsParticipationService],
  imports: [
    TypeOrmModule.forFeature([EventParticipation]),
    AuthenticationModule,
    EventsModule,
  ],
  exports: [EventsParticipationService],
})
export class EventsParticipationModule {}
