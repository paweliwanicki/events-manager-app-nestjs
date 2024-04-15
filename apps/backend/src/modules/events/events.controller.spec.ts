import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CanActivate } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEventsService = {
    findOneById: jest.fn((id) => {
      const event = {
        id: +id,
        title: 'Test',
        description: 'Test',
        location: 'Test',
      };
      return event;
    }),
    findAll: jest.fn((filters) => {
      const events = [
        {
          id: 1,
          title: 'Test1',
          description: 'Test1',
          location: 'Test1',
        },
        {
          id: 2,
          title: 'Test2',
          description: 'Test2',
          location: 'Test2',
        },
        {
          id: 3,
          title: 'Test3',
          description: 'Test3',
          location: 'Test3',
        },
      ];
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create: jest.fn((event) => {
      return {
        id: Date.now(),
        ...event,
      };
    }),
    update: jest.fn((id, { ...details }) => {
      return {
        id,
        ...details,
      };
    }),
    remove: jest.fn((id) => {
      const event = {
        id: +id,
        title: 'Test',
        description: 'Test',
        location: 'Test',
      };
      return event;
    }),
  };

  const mockJwtAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [EventsService, JwtAuthGuard],
    })
      .overrideProvider(EventsService)
      .useValue(mockEventsService)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
