import { createContext, useContext } from 'react';
import type { Event } from '../types/Event';
import { GenericEventsResponse } from '../providers/EventsProvider';

export type EventType = 'PUBLIC' | 'PRIVATE' | 'MY' | 'PARTICIPATION';

type EventsContextType = {
  isFetching: boolean;
  events: Event[];
  participatedEvents: Event[];
  getEvents: (type: EventType) => Promise<boolean> | undefined;
  getParticipatedEvents: () => Promise<boolean> | undefined;
  removeEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
  joinEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
  leaveEvent: (id: number) => Promise<GenericEventsResponse> | undefined;
};

export const EventsContext = createContext<EventsContextType>({
  isFetching: false,
  events: [],
  participatedEvents: [],
  getEvents: () => undefined,
  getParticipatedEvents: () => undefined,
  removeEvent: () => undefined,
  joinEvent: () => undefined,
  leaveEvent: () => undefined,
});

export const useEvents = () => useContext(EventsContext);
