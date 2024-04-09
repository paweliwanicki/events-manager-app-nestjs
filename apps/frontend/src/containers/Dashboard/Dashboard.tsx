import EventsList from '../../components/EventsList/EventsList';
import EventsNavigation from '../../components/EventsNavigation/EventsNavigation';
import classes from './Dashboard.module.scss';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { useState, useCallback, useEffect } from 'react';
import { Event } from '../../types/Event';
import AddEditEventModal from '../../components/AddEditEventModal/AddEditEventModal';
import { EventType, useEvents } from '../../contexts/eventsContext';
import RemoveEventModal from '../../components/EventsList/RemoveEventModal/RemoveEventModal';
import UserCurrentLocationMarker from '../../components/UserCurrentLocationMarker/UserCurrentLocationMarker';

type EventOnMapSelectionProps = {
  onEventSelect: (e: any) => void;
};

const EventOnMapSelection = ({ onEventSelect }: EventOnMapSelectionProps) => {
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());

      if ('id' in e) {
        onEventSelect(e.latlng);
      }
    },
  });
  return null;
};

const DisplayEventPosition = ({ map, location }) => {
  useEffect(() => {
    map && location && map.setView(location);
  }, [map, location]);

  return null;
};

const center = { lat: 51.11117431307491, lng: 17.0354175567627 }; // Wroclaw

const Dashboard = () => {
  const [map, setMap] = useState(null);
  const { events } = useEvents();
  const [showAddEditEventModal, setShowAddEditEventModal] =
    useState<boolean>(false);
  const [showRemoveEventModal, setShowRemoveEventModal] =
    useState<boolean>(false);

  const [addEditEventModalData, setaddEditEventModalData] = useState<Event>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [selectedTab, setSelectedTab] = useState<EventType>('MY');

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    const selectedEventElement = document.querySelector(
      `#event-li-${event.id}`
    );
    selectedEventElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    }); // this should be done on refs!
  }, []);

  const handleShowAddEditEventModal = useCallback(() => {
    setShowAddEditEventModal((isShowing) => !isShowing);
  }, []);

  const handleShowRemoveEventModal = useCallback(() => {
    setShowRemoveEventModal((isShowing) => !isShowing);
  }, []);

  const handleAddNewEvent = useCallback(() => {
    setaddEditEventModalData(undefined);
    handleShowAddEditEventModal();
  }, [handleShowAddEditEventModal]);

  const handleEditEvent = useCallback(() => {
    setaddEditEventModalData(selectedEvent);
    handleShowAddEditEventModal();
  }, [selectedEvent, handleShowAddEditEventModal]);

  const handleSelectTab = useCallback((event: EventType) => {
    setSelectedEvent(undefined);
    setSelectedTab(event);
  }, []);

  return (
    <div className={classes.dashboard}>
      <EventsNavigation
        onClickAddEvent={handleAddNewEvent}
        onChangeTab={handleSelectTab}
        selectedTab={selectedTab}
      />
      <div className={classes.content}>
        <EventsList
          onSelectEvent={handleSelectEvent}
          onEditEvent={handleEditEvent}
          onRemoveEvent={handleShowRemoveEventModal}
          data={events}
          selectedEvent={selectedEvent}
          selectedTab={selectedTab}
        />
        <div className={classes.mapContainer}>
          <MapContainer
            ref={setMap}
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {events.map((event: Event) => {
              const { lat, lng, address } = event.location;
              return (
                <Marker
                  key={`event-${event.id}-marker`}
                  position={[lat, lng]}
                  eventHandlers={{
                    click: () => {
                      handleSelectEvent(event);
                    },
                  }}
                >
                  <Popup className={classes.markerMapPopup}>
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <p>
                      <span>Date: </span>
                      <strong>
                        {new Date(event.date * 1000).toLocaleString()}
                      </strong>
                    </p>
                    <p>
                      <span>Address: </span>
                      <strong>{address}</strong>
                    </p>
                  </Popup>
                </Marker>
              );
            })}

            <UserCurrentLocationMarker />
            <DisplayEventPosition
              map={map}
              location={
                selectedEvent
                  ? [selectedEvent.location.lat, selectedEvent.location.lng]
                  : undefined
              }
            />
            <EventOnMapSelection onEventSelect={handleSelectEvent} />
          </MapContainer>
        </div>
      </div>
      <AddEditEventModal
        data={addEditEventModalData}
        isOpen={showAddEditEventModal}
        onClose={handleShowAddEditEventModal}
        selectedTab={selectedTab}
      />
      <RemoveEventModal
        onClose={handleShowRemoveEventModal}
        data={selectedEvent}
        isOpen={showRemoveEventModal}
        selectedTab={selectedTab}
      />
    </div>
  );
};

export default Dashboard;