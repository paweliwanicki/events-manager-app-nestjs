import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { OFFER_EXCEPTION_MESSAGES } from './event-exception.messages';
import { EventParticipation } from './event-participation.entity';

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

  async findOneById(id: number) {
    if (!id) return null;
    return await this.eventParticipationRepository.findOne({
      where: { id: id },
      relations: { user: true, event: true },
    });
  }

  async findByUserId(createdBy: number) {
    return this.eventParticipationRepository.find({ where: { createdBy } });
  }

  async findAll(where: any) {
    const results = await this.eventParticipationRepository.find({
      relations: { user: true, event: true },
      ...where,
    });
    return results;
  }

  async update(id: number, attrs: Partial<EventParticipation>) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    Object.assign(event, attrs);
    return this.eventParticipationRepository.save(event);
  }

  async remove(id: number) {
    const event = await this.findOneById(id);
    if (!event) {
      throw new NotFoundException(OFFER_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return this.eventParticipationRepository.remove(event);
  }
}
