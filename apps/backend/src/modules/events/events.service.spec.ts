import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from '../dictionaries/contract/contract.entity';
import { Company } from '../dictionaries/company/company.entity';
import { NotFoundException } from '@nestjs/common';
import { OFFER_EXCEPTION_MESSAGES } from './event-exception.messages';
import { ILike } from 'typeorm';

describe('EventsService', () => {
  let service: EventsService;

  const mockContractEntity: Contract = {
    id: 1,
    name: 'TestContract',
    createdAt: Date.now(),
    createdBy: 1,
    modifiedBy: null,
    modifiedAt: null,
    event: null,
    logInsert: null,
    logUpdate: null,
    logRemove: null,
  };

  const mockCompanyEntity: Company = {
    id: 1,
    name: 'TestCompany',
    logoFileName: 'logoFileName',
    createdAt: Date.now(),
    createdBy: 1,
    modifiedBy: null,
    modifiedAt: null,
    event: null,
    logInsert: null,
    logUpdate: null,
    logRemove: null,
  };

  const newEvent = {
    title: 'New',
    description: 'Description',
    location: 'Wroclaw',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: true,
    createdAt: Date.now(),
    createdBy: 1,
  };

  const offer1 = {
    id: 1,
    title: 'offer1',
    description: 'Description',
    location: 'Wroclaw',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: true,
    createdAt: Date.now(),
    createdBy: 1,
  };
  const offer2 = {
    id: 2,
    title: 'offer2',
    description: 'Description2',
    location: 'Warszawa',
    contract: mockContractEntity,
    company: mockCompanyEntity,
    unremovable: false,
    createdAt: Date.now(),
    createdBy: 1,
  };

  const offerEntities = [offer1, offer2];

  const mockEventRepository = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      createdAt: Date.now(),
    })),
    save: jest.fn().mockImplementation((event) =>
      Promise.resolve({
        id: Date.now(),
        ...event,
      }),
    ),
    update: jest.fn().mockImplementation((id, attr) => ({
      id,
      ...attr,
      updatedAt: Date.now(),
      updatedBy: 1,
    })),
    remove: jest.fn().mockImplementation((event) => event),
    findOne: jest.fn().mockImplementation(({ where: filters }) => {
      const result = offerEntities.find((event) => {
        for (const key in filters) {
          if (event[key] !== filters[key]) {
            return false;
          }
        }
        return event;
      });

      return result;
    }),
    findAndCount: jest.fn().mockImplementation((filters) => {
      const results = offerEntities.filter((event) => {
        for (const key in filters) {
          if (event[key] !== filters[key]) {
            return false;
          }
        }
        return event;
      });
      return [results.length, results];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new event record and save in repository', async () => {
    expect(await service.create(newEvent)).toEqual({
      id: expect.any(Number),
      ...newEvent,
      createdAt: expect.any(Number),
    });
  });

  it('should find one event by id', async () => {
    const id = 1;
    expect(await service.findOneById(id)).toEqual(offer1);
  });

  it('should update the event', async () => {
    const updEvent = {
      title: 'UpdatedTitle',
    };
    expect(await service.update(1, updEvent)).toEqual({
      id: expect.any(Number),
      ...newEvent,
      ...updEvent,
      createdAt: expect.any(Number),
    });
  });

  it('should remove the event', async () => {
    await expect(async () => {
      await service.remove(1);
    }).rejects.toThrow(
      new NotFoundException(OFFER_EXCEPTION_MESSAGES.UNREMOVABLE),
    );

    offer1.unremovable = false;
    expect(await service.remove(1)).toEqual(offer1);
  });

  it('should find all event by title', async () => {
    const filters = {
      title: ILike('%New%'),
    };

    expect(await service.findAll(filters)).toEqual([0, []]);
  });
});
