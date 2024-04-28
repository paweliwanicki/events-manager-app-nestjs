import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { HttpMethod } from '../enums/HttpMethods';
import { useApi } from '../hooks/useApi';
import { EventType, EventsContext } from '../contexts/eventsContext';
import { Event } from '../types/Event';
import { useUser } from '../contexts/userContext';
import { ResponseStatus } from '../enums/ResponseStatus';

export type GenericEventsResponse = {
  message: string;
  status: ResponseStatus;
};

export type GetEventsResponse = GenericEventsResponse & {
  data: Event[];
};

type EventsProviderProps = {
  children: ReactNode;
};

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const { fetch, isFetching } = useApi();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [participatedEvents, setParticipatedEvents] = useState<Event[]>([]);

  const getEvents = useCallback(
    async (type: EventType) => {
      setEvents([]);
      const [{ data }] = await fetch<GetEventsResponse>(HttpMethod.GET, {
        path: `/api/events/${type.toLowerCase()}`,
      });

      if (!data) {
        return false;
      }
      if (type === 'PARTICIPATION') {
        setParticipatedEvents(data);
      }
      setEvents(data);
      return true;
    },
    [fetch]
  );

  const getParticipatedEvents = useCallback(async () => {
    const [{ data }] = await fetch<GetEventsResponse>(HttpMethod.GET, {
      path: `/api/events/participation`,
    });

    if (!data) {
      setParticipatedEvents([]);
      return false;
    }
    setParticipatedEvents(data);
    return true;
  }, [fetch]);

  const removeEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.DELETE, {
        path: `/api/events/${id}`,
      });
      return response;
    },
    [fetch]
  );

  const joinEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.POST, {
        path: `/api/events/participation/${id}`,
      });
      return response;
    },
    [fetch]
  );

  const leaveEvent = useCallback(
    async (id: number) => {
      const [response] = await fetch<GenericEventsResponse>(HttpMethod.DELETE, {
        path: `/api/events/participation/${id}`,
      });
      return response;
    },
    [fetch]
  );

  useEffect(() => {
    if (user) {
      getEvents('MY');
      getParticipatedEvents();
    }
  }, [user, getEvents, getParticipatedEvents]);

  const contextValue = useMemo(
    () => ({
      isFetching,
      events,
      participatedEvents,
      getEvents,
      getParticipatedEvents,
      removeEvent,
      joinEvent,
      leaveEvent,
    }),
    [
      isFetching,
      events,
      participatedEvents,
      getEvents,
      getParticipatedEvents,
      joinEvent,
      leaveEvent,
      removeEvent,
    ]
  );

  return (
    <EventsContext.Provider value={contextValue}>
      <>{children}</>
    </EventsContext.Provider>
  );
};
