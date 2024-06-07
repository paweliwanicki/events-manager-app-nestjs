import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { EVENTS_EXCEPTION_MESSAGES } from '../events-messages';
import { EventParticipation } from '../entities/event-participation.entity';

@Injectable()
export class EventsParticipationService {
  constructor(
    @InjectRepository(EventParticipation)
    private eventParticipationRepository: Repository<EventParticipation>,
  ) {}

  async create(event: Partial<EventParticipation>) {
    const newEvent = this.eventParticipationRepository.create(event);
    return await this.eventParticipationRepository.save(newEvent);
  }

  async findOneByWhere(where: FindOneOptions<EventParticipation>) {
    return await this.eventParticipationRepository.findOne({
      ...where,
      relations: { user: true, event: true },
    });
  }

  async findOneById(id: number) {
    if (!id) return null;
    return await this.eventParticipationRepository.findOne({
      where: { id: id },
      relations: { user: true, event: true },
    });
  }

  async findByUserId(createdBy: number) {
    return this.eventParticipationRepository.find({
      where: { createdBy },
      relations: { user: true, event: true },
    });
  }

  async findAll(where: FindOneOptions<EventParticipation>) {
    const results = await this.eventParticipationRepository.find({
      relations: { user: true, event: true },
      ...where,
    });

    return results;
  }

  async update(id: number, attrs: Partial<EventParticipation>) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(
        EVENTS_EXCEPTION_MESSAGES.EVENT_PARTICIPATION_NOT_FOUND,
      );
    }
    Object.assign(event, attrs);
    return this.eventParticipationRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(
        EVENTS_EXCEPTION_MESSAGES.EVENT_PARTICIPATION_NOT_FOUND,
      );
    }
    return this.eventParticipationRepository.remove(event);
  }
}
