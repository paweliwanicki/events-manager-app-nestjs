import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/user.entity';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { EventsService } from '../services/events.service';
import { ResponseStatus } from 'src/enums/ResponseStatus';
import { EventsParticipationService } from '../services/events-participation.service';
import { EVENTS_PARTICIPATION_MESSAGES } from '../events-messages';

@UseGuards(JwtAuthGuard)
@Controller('events/participation')
export class EventsParticipationController {
  constructor(
    private eventsParticipationService: EventsParticipationService,
    private eventsService: EventsService,
  ) {}

  @Get()
  async findParticipatedEvents(@CurrentUser() user: User) {
    const eventsParticipations = await this.eventsParticipationService.findAll({
      where: { user },
    });
    const data = eventsParticipations.flatMap(({ id, event }) => ({
      participationId: id,
      ...event,
    }));
    return {
      data,
    };
  }

  @Post('/:eventId')
  async addEventParticipation(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOneById(eventId);
    const alreadyParticipated =
      await this.eventsParticipationService.findOneByWhere({
        where: { user, event },
      });

    if (alreadyParticipated) {
      throw new Error(EVENTS_PARTICIPATION_MESSAGES.ALREADY_PARTICIPATED);
    }
    const newParticipation = {
      user,
      event,
      createdAt: Math.floor(new Date().getTime() / 1000),
      createdBy: user.id,
    };

    const { event: participatedEvent } =
      await this.eventsParticipationService.create(newParticipation);
    if (!participatedEvent) {
      throw new Error(EVENTS_PARTICIPATION_MESSAGES.ERROR_DURING_JOINING_EVENT);
    }
    return {
      message: EVENTS_PARTICIPATION_MESSAGES.JOIN_EVENT,
      status: ResponseStatus.SUCCESS,
    };
  }

  @Delete(':id')
  async removeEventParticipation(@Param('id', ParseIntPipe) id: number) {
    const { event: participatedEvent } =
      await this.eventsParticipationService.remove(id);
    if (!participatedEvent) {
      throw new Error(EVENTS_PARTICIPATION_MESSAGES.ERROR_DURING_LEAVING_EVENT);
    }
    return {
      message: EVENTS_PARTICIPATION_MESSAGES.LEFT_EVENT,
      status: ResponseStatus.SUCCESS,
    };
  }

  @Patch()
  async updateEventParticipation(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOneById(eventId);
    const updEvent = {
      event,
      user,
      modifiedAt: Math.floor(new Date().getTime() / 1000),
      modifiedBy: user.id,
    };
    return await this.eventsParticipationService.update(eventId, updEvent);
  }
}
