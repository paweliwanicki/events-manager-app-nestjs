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

@Controller('events/participation')
export class EventsParticipationController {
  constructor(
    private eventsService: EventsService,
    private eventsParticipationService: EventsParticipationService,
  ) {}

  @Post('/:eventId')
  @UseGuards(JwtAuthGuard)
  async addEventParticipation(
    @Param('eventId') eventId: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOneById(eventId);
    const newParticipation = {
      user,
      event,
      createdAt: Math.floor(new Date().getTime() / 1000),
      createdBy: user.id,
    };

    return await this.eventsParticipationService.create(newParticipation);
  }

  @Get(':id')
  async findEventParticipation(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsParticipationService.findOneById(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Get()
  async findEventsParticipation(@CurrentUser() user: User) {
    return {
      data: await this.eventsParticipationService.findAll({ where: user }),
    };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async removeEvent(@Param('id') id: string) {
    return await this.eventsParticipationService.remove(parseInt(id));
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateEvent(
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
