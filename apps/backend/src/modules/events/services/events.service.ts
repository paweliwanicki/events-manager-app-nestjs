import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../entities/event.entity';
import { ILike, Repository } from 'typeorm';
import { EVENTS_EXCEPTION_MESSAGES } from '../events-messages';
import { FiltersEventDto } from '../dtos/filters-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
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
    const { participatedUsers, ...where } = filters;

    if (where.name) {
      where.name = ILike(`%${where.name}%`);
    }

    const results = await this.eventRepository.find({
      where,
      relations: { participatedUsers },
      order: {
        createdAt: 'DESC',
      },
    });
    return results;
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
    return this.eventRepository.remove(event);
  }
}
