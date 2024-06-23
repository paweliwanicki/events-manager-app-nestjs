import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { UpdateEventDto } from '../dtos/update-event.dto';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../../authentication/guards/jwt-auth.guard';
import { FiltersEventDto } from '../dtos/filters-event.dto';
import { NewEventDto } from '../dtos/new-event.dto';
import { EVENTS_EXCEPTION_MESSAGES, EVENTS_MESSAGES } from '../events-messages';
import { ResponseStatus } from 'src/enums/ResponseStatus';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  async addEvent(@Body() body: NewEventDto, @CurrentUser() user: User) {
    const newEvent = {
      ...body,
      createdAt: Math.floor(new Date().getTime() / 1000),
      createdBy: user.id,
    };

    const event = await this.eventsService.create(newEvent);
    return event;
  }

  @Get('/event/:id')
  async findEvent(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOneById(id);
    if (!event) {
      throw new Error(EVENTS_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return event;
  }

  @Post('/archive')
  async findArchivedEvents(@Body() filters: FiltersEventDto) {
    filters.archived = true;
    return await this.eventsService.findAll(filters);
  }

  @Post('/archive/:id')
  async archiveEvent(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.findOneById(id);
    event.archived = true;
    const updatedEvent = await this.eventsService.update(id, event);
    return updatedEvent.archived;
  }

  @Get('/public')
  async findEvents(
    @Body() filters: FiltersEventDto,
    @CurrentUser() user: User,
  ) {
    filters.isPrivate = false;
    filters.user = user;
    return { data: await this.eventsService.findAll(filters) };
  }

  @Get('/private')
  async findpPrivateEvents(
    @Body() filters: FiltersEventDto,
    @CurrentUser() user: User,
  ) {
    filters.isPrivate = true;
    filters.user = user;
    return { data: await this.eventsService.findAll(filters) };
  }

  @Get('/my')
  async findMyEvents(@CurrentUser() user: User) {
    return { data: await this.eventsService.findByUserId(user.id) };
  }

  @Get('/myArchive')
  async findMyArchivedEvents(
    @Body() filters: FiltersEventDto,
    @CurrentUser() user: User,
  ) {
    filters.createdBy = user.id;
    filters.archived = true;
    return await this.eventsService.findAll(filters);
  }

  @Delete('/:id')
  async removeEvent(@Param('id') id: string) {
    await this.eventsService.remove(parseInt(id));
    return {
      status: ResponseStatus.SUCCESS,
      message: EVENTS_MESSAGES.REMOVED_SUCCESS,
    };
  }

  @Patch('/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const updEvent = {
      ...body,
      modifiedAt: Math.floor(new Date().getTime() / 1000),
      modifiedBy: user.id,
    };
    await this.eventsService.update(id, updEvent);

    return {
      status: ResponseStatus.SUCCESS,
      message: EVENTS_MESSAGES.UPDATED_SUCCESS,
    };
  }
}
