import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Delete,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsParticipationService } from './events-participation.service';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { EventsService } from '../events/events.service';
import { ResponseStatus } from 'src/enums/ResponseStatus';

@UseGuards(JwtAuthGuard)
@Controller('events/participation')
export class EventsParticipationController {
  constructor(
    private eventsService: EventsService,
    private eventsParticipationService: EventsParticipationService,
  ) {}

  @Get()
  async findEventsParticipations(@CurrentUser() user: User) {
    const participatedEvents =
      await this.eventsParticipationService.findByUserId(user.id);

    return {
      data: participatedEvents.flatMap(({ event, id }) => ({
        ...event,
        participationId: id,
      })),
    };
  }

  @Post('/:eventId')
  async addEventParticipation(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    console.log(user);
    const event = await this.eventsService.findOneById(eventId);
    const alreadyParticipated =
      await this.eventsParticipationService.findOneByWhere({
        where: { user, event },
      });

    if (alreadyParticipated) {
      throw new Error('Already participated!');
    }
    const newParticipation = {
      user,
      event,
      createdAt: Math.floor(new Date().getTime() / 1000),
      createdBy: user.id,
    };

    await this.eventsParticipationService.create(newParticipation);
    return {
      message: 'Successfully joined the event!',
      status: ResponseStatus.SUCCESS,
    };
  }

  @Get(':id')
  async findEventParticipation(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsParticipationService.findOneById(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Delete(':id')
  async removeEventParticipation(@Param('id', ParseIntPipe) id: number) {
    await this.eventsParticipationService.remove(id);

    return {
      message: 'Successfully left the event!',
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
