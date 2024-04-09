import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { HttpMethod } from '../enums/HttpMethods';
import { ResponseStatus, useApi } from '../hooks/useApi';
import { EventType, EventsContext } from '../contexts/eventsContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner/LoadingSpinner';
import { Event } from '../types/Event';
import { useUser } from '../contexts/userContext';

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
  const { fetchWithJwt, isFetching } = useApi();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [participatedEvents, setParticipatedEvents] = useState<Event[]>([]);

  const getEvents = useCallback(
    async (type: EventType) => {
      setEvents([]);
      const [response] = await fetchWithJwt<GetEventsResponse>(HttpMethod.GET, {
        path:
          type !== 'MY' ? `/api/events/${type.toLowerCase()}` : '/api/events',
      });

      if (response.status === 'Success') {
        if (type === 'PARTICIPATION') setParticipatedEvents(response.data);
        setEvents(response.data);
        return true;
      }
      return false;
    },
    [fetchWithJwt]
  );

  const getParticipatedEvents = useCallback(async () => {
    const [response] = await fetchWithJwt<GetEventsResponse>(HttpMethod.GET, {
      path: `/api/events/participation`,
    });

    if (response.status === 'Success') {
      setParticipatedEvents(response.data);
      return true;
    } else {
      setEvents([]);
    }
    return false;
  }, [fetchWithJwt]);

  const removeEvent = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<GenericEventsResponse>(
        HttpMethod.DELETE,
        {
          path: `/api/events/${id}`,
        }
      );
      return response;
    },
    [fetchWithJwt]
  );

  const joinEvent = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<GenericEventsResponse>(
        HttpMethod.POST,
        {
          path: `/api/events/assign/${id}`,
        }
      );
      return response;
    },
    [fetchWithJwt]
  );

  const leaveEvent = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<GenericEventsResponse>(
        HttpMethod.DELETE,
        {
          path: `/api/events/disAssign/${id}`,
        }
      );
      return response;
    },
    [fetchWithJwt]
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
      {isFetching && <LoadingSpinner message="Fetching events" />}
      <>{children}</>
    </EventsContext.Provider>
  );
};
