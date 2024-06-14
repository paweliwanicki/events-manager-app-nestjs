import { useCallback, useEffect, useRef } from 'react';
import { Event } from '../../../types/Event';
import classes from './EventsListItem.module.scss';
import ContextMenu, {
  ContextMenuOption,
} from '../../common/ContextMenu/ContextMenu';

type EventsListItemProps = {
  event: Event;
  menuOptions: ContextMenuOption[];
  showSettingsBtn: boolean;
  participation?: Event;
  selectedEvent?: Event;
  onSelectEvent: (
    event: Event,
    listItemRef: React.RefObject<HTMLLIElement>
  ) => void;
  onJoinEvent: (eventId: number) => void;
  onLeaveEvent: (participationId: number) => void;
};

const EventsListItem = ({
  event,
  selectedEvent,
  showSettingsBtn,
  menuOptions,
  participation,
  onSelectEvent,
  onJoinEvent,
  onLeaveEvent,
}: EventsListItemProps) => {
  const listItemRef = useRef<HTMLLIElement>(null);

  const handleEventOnClick = useCallback(
    (event: Event) => {
      onSelectEvent(event, listItemRef);
    },
    [onSelectEvent]
  );

  const handleJoinEvent = useCallback(
    async (id: number) => {
      onJoinEvent(id);
    },
    [onJoinEvent]
  );

  const handleLeaveEvent = useCallback(
    async (id: number) => {
      onLeaveEvent(id);
    },
    [onLeaveEvent]
  );

  useEffect(() => {
    event.listItemRef = listItemRef;
  }, [event]);

  return (
    <li
      id={`event-li-${event.id}`}
      ref={listItemRef}
      onClick={() => handleEventOnClick(event)}
      className={`${classes.eventListItem} ${
        selectedEvent?.id === event.id ? classes.selected : ''
      }`}
    >
      {showSettingsBtn ? (
        <ContextMenu
          classNames={classes.eventContextMenu}
          options={menuOptions}
          id={`event-${event.id}-menu`}
          iconId="icon-settings"
          width={24}
          height={24}
        />
      ) : (
        <button
          onClick={() =>
            participation
              ? handleLeaveEvent(participation.id)
              : handleJoinEvent(event.id)
          }
          className={`${classes.btnJoinEvent} ${
            participation ? classes.leave : classes.join
          }`}
        >
          {participation ? 'Leave' : 'Join'}
        </button>
      )}
      <h4>{event.name}</h4>
      <p className={classes.description}>{event.description}</p>
      <div className={classes.eventTimeAndPlace}>
        <p>
          <span>Date: </span>
          <strong>{new Date(event.date * 1000).toLocaleString()}</strong>
        </p>
        <p>
          <span>Address: </span>
          <strong>{event.location.address}</strong>
        </p>
      </div>
    </li>
  );
};

export default EventsListItem;
