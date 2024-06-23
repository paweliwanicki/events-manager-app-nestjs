import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { Repository } from 'typeorm';
import { EVENTS_EXCEPTION_MESSAGES } from '../events-messages';
import { FiltersEventDto } from '../dtos/filters-event.dto';
import { EventsParticipationService } from './events-participation.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private eventsParticipationService: EventsParticipationService,
  ) {}

  async create(event: Partial<Event>) {
    const newEvent = this.eventRepository.create(event);
    return await this.eventRepository.save(newEvent);
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.eventRepository.findOne({
      where: { id },
      relations: { participatedUsers: true },
    });
  }

  async findByUserId(createdBy: number) {
    return this.eventRepository.find({ where: { createdBy } });
  }

  async findAll(filters: Partial<FiltersEventDto>) {
    const { user: currentUser, ...where } = filters;

    const queryBuilder = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.participatedUsers', 'participation')
      .leftJoinAndSelect('participation.user', 'user');

    if (where.name) {
      queryBuilder.andWhere('event.name ILIKE :name', {
        name: `%${where.name}%`,
      });
    }

    queryBuilder.orderBy('event.createdAt', 'DESC');
    const results = await queryBuilder.getMany();
    const data = results.map((event) => {
      const participation = event.participatedUsers.find(
        (participation) => participation.user.id === currentUser.id,
      );
      return { ...event, participationId: participation?.id };
    });
    return data;
  }

  async update(id: number, attrs: Partial<Event>) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(EVENTS_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(event, attrs);
    return this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(EVENTS_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    await this.eventsParticipationService.removeAllForEvent(event);
    return this.eventRepository.remove(event);
  }
}
