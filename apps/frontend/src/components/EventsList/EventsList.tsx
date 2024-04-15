import { useCallback, useMemo } from 'react';
import { Event } from '../../types/Event';
import classes from './EventsList.module.scss';
import ContextMenu, {
  ContextMenuOption,
} from '../common/ContextMenu/ContextMenu';
import { useUser } from '../../contexts/userContext';
import { EventType, useEvents } from '../../contexts/eventsContext';
import { useSnackBar } from '../../contexts/snackBarContext';
import { ResponseStatus } from '../../enums/ResponseStatus';

type EventsListProps = {
  data: Event[];
  selectedEvent: Event | undefined;
  selectedTab: EventType;
  onSelectEvent: (event: Event) => void;
  onRemoveEvent: () => void;
  onEditEvent: () => void;
};

const EventsList = ({
  data,
  selectedEvent,
  selectedTab,
  onSelectEvent,
  onEditEvent,
  onRemoveEvent,
}: EventsListProps) => {
  const { handleShowSnackBar } = useSnackBar();
  const { user } = useUser();
  const {
    participatedEvents,
    joinEvent,
    leaveEvent,
    getEvents,
    getParticipatedEvents,
  } = useEvents();

  const handleEventOnClick = useCallback(
    (event: Event) => {
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  const handleEditEvent = useCallback(() => {
    onEditEvent();
  }, [onEditEvent]);

  const handleRemoveEvent = useCallback(() => {
    onRemoveEvent();
  }, [onRemoveEvent]);

  const handleJoinEvent = useCallback(
    async (id: number) => {
      const response = await joinEvent(id);
      if (response) {
        if (response.status !== ResponseStatus.SUCCESS) {
          handleShowSnackBar(
            'Error during joining to the event! Please try again.',
            'error'
          );
          return false;
        }

        handleShowSnackBar('Successfully join the event!', 'success');
        await getParticipatedEvents();
        getEvents(selectedTab);
        return true;
      }
      handleShowSnackBar(
        'Error during joining to the event! Please try again.',
        'error'
      );
      return false;
    },
    [
      joinEvent,
      handleShowSnackBar,
      getEvents,
      getParticipatedEvents,
      selectedTab,
    ]
  );

  const handleLeaveEvent = useCallback(
    async (id: number) => {
      const response = await leaveEvent(id);
      if (response) {
        if (response.status !== ResponseStatus.SUCCESS) {
          handleShowSnackBar(
            'Error during leaving event! Please try again.',
            'error'
          );
          return false;
        }
        handleShowSnackBar('Successfully leave the event!', 'success');
        await getParticipatedEvents();
        getEvents(selectedTab);
        return true;
      }
      handleShowSnackBar(
        'Error during leaving event! Please try again.',
        'error'
      );
      return false;
    },
    [
      leaveEvent,
      handleShowSnackBar,
      getEvents,
      getParticipatedEvents,
      selectedTab,
    ]
  );

  const EVENT_MENU_OPTIONS: ContextMenuOption[] = useMemo(
    () => [
      {
        label: 'Edit',
        action: () => handleEditEvent(),
      },
      {
        label: 'Remove',
        action: () => handleRemoveEvent(),
      },
    ],
    [handleEditEvent, handleRemoveEvent]
  );

  return (
    <div className={classes.eventsListContainer}>
      <ul>
        {!data.length ? (
          <p>No events found!</p>
        ) : (
          data.map((event: Event) => {
            const alreadyParticipate = participatedEvents.find(
              (participatedEvent: Event) => participatedEvent.id === event.id
            );

            const showParticipateBtn = user && selectedTab !== 'MY';
            const showSettingsBtn = user && selectedTab === 'MY';
            return (
              <li
                id={`event-li-${event.id}`}
                key={`event-list-${event.id}`}
                onClick={() => handleEventOnClick(event)}
                className={
                  selectedEvent && selectedEvent.id === event.id
                    ? classes.selected
                    : ''
                }
              >
                {showSettingsBtn && (
                  <ContextMenu
                    classNames={classes.eventContextMenu}
                    options={EVENT_MENU_OPTIONS}
                    id={`event-${event.id}-menu`}
                    iconId="icon-settings"
                    width={24}
                    height={24}
                  />
                )}
                {showParticipateBtn && (
                  <button
                    onClick={() =>
                      !alreadyParticipate
                        ? handleJoinEvent(event.id)
                        : handleLeaveEvent(event.id)
                    }
                    className={classes.btnJoinEvent}
                  >
                    {!alreadyParticipate ? 'Join' : 'Leave'}
                  </button>
                )}
                <h4>{event.name}</h4>
                <p className={classes.description}>{event.description}</p>
                <div className={classes.eventTimeAndPlace}>
                  <p>
                    <span>Date: </span>
                    <strong>
                      {new Date(event.date * 1000).toLocaleString()}
                    </strong>
                  </p>
                  <p>
                    <span>Address: </span>
                    <strong>{event.location.address}</strong>
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default EventsList;
