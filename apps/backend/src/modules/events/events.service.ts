import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { ILike, Repository } from 'typeorm';
import { OFFER_EXCEPTION_MESSAGES } from './event-exception.messages';

import { FiltersEventDto } from './dtos/filters-event.dto';

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
      relations: { participations: true },
    });
  }

  async findByUserId(createdBy: number) {
    return this.eventRepository.find({ where: { createdBy } });
  }

  async findAll(filters: Partial<FiltersEventDto>) {
    const { activePage, itemsPerPage, ...where } = filters;

    if (where.name) {
      where.name = ILike(`%${where.name}%`);
    }

    const results = await this.eventRepository.find({
      where,
      relations: { participations: true },
      order: {
        createdAt: 'DESC',
      },
      take: itemsPerPage ?? 12,
      skip:
        itemsPerPage && activePage > 1 ? itemsPerPage * (activePage - 1) : 0,
    });
    return results;
  }

  async update(id: number, attrs: Partial<Event>) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(event, attrs);
    return this.eventRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return this.eventRepository.remove(event);
  }
}
