import { useCallback } from 'react';
import Button from '../common/Button/Button';
import classes from './EventsNavigation.module.scss';
import { EventType, useEvents } from '../../contexts/eventsContext';

type EventsNavigationProps = {
  selectedTab: EventType;
  onClickAddEvent: () => void;
  onChangeTab: (event: EventType) => void;
};

const EventsNavigation = ({
  selectedTab,
  onChangeTab,
  onClickAddEvent,
}: EventsNavigationProps) => {
  const { getEvents } = useEvents();

  const handleGetEventsByType = useCallback(
    (type: EventType) => {
      getEvents(type);
      onChangeTab(type);
    },
    [getEvents, onChangeTab]
  );

  return (
    <div className={classes.eventsNavigation}>
      <menu>
        <li>
          <strong>Events:</strong>
        </li>
        <li
          className={selectedTab === 'MY' ? classes.active : ''}
          onClick={() => handleGetEventsByType('MY')}
        >
          My
        </li>
        <li
          className={selectedTab === 'PUBLIC' ? classes.active : ''}
          onClick={() => handleGetEventsByType('PUBLIC')}
        >
          Public
        </li>
        <li
          className={selectedTab === 'PRIVATE' ? classes.active : ''}
          onClick={() => handleGetEventsByType('PRIVATE')}
        >
          Private
        </li>
        <li
          className={selectedTab === 'PARTICIPATION' ? classes.active : ''}
          onClick={() => handleGetEventsByType('PARTICIPATION')}
        >
          Participation
        </li>
      </menu>

      <Button variant="primary" onClick={onClickAddEvent}>
        Add Event
      </Button>
    </div>
  );
};

export default EventsNavigation;
