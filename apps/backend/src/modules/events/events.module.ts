import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventParticipation } from './entities/event-participation.entity';
import { EventsParticipationService } from './services/events-participation.service';
import { EventsParticipationController } from './controllers/events-participation.controller';

@Module({
  controllers: [EventsController, EventsParticipationController],
  providers: [EventsService, EventsParticipationService],
  imports: [TypeOrmModule.forFeature([Event, EventParticipation])],
  exports: [EventsService],
})
export class EventsModule {}
