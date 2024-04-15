import { ReactNode, useCallback, useState, useMemo } from 'react';
import { useApi } from './useApi';
import { HttpMethod } from '../enums/HttpMethods';
import { useSnackBar } from '../contexts/snackBarContext';
import { ResponseStatus } from '../enums/ResponseStatus';
import { Event } from '../types/Event';

type InputError = 'EMPTY';
type LocationMapError = 'NOT_SELECTED';
type NewEventFormInput = 'NAME' | 'DESCRIPTION' | 'EVENT_DATE' | 'LOCATION';

export type EventLocation = {
  lat: number;
  lng: number;
  address?: string;
};

export type AddEditRemoveEventResponse = {
  message: string;
  status: ResponseStatus;
};

type AddEditEventForm = {
  message: ReactNode;
  errors: {
    nameError: string | undefined;
    dateError: string | undefined;
    descriptionError: string | undefined;
    locationError: string | undefined;
  };
  isValidated: {
    nameIsValidated: boolean;
    dateIsValidated: boolean;
    descriptionIsValidated: boolean;
    locationIsValidated: boolean;
  };
  isFetching: boolean;
  clearMessage: () => void;
  clearValidationAndError: (input?: NewEventFormInput) => void;
  validateForm: (
    name: string,
    date: number,
    description: string,
    location?: EventLocation
  ) => boolean;
  handleAddUpdateEvent: (
    name: string,
    date: number,
    description: string,
    location: EventLocation,
    isPrivate: boolean,
    id?: number
  ) => Promise<boolean>;
  handleGetAddressDetails: (location: EventLocation) => Promise<unknown>; // fix that any!
};

const INPUT_ERRORS_MESSAGES: Record<InputError, string> = {
  EMPTY: 'Can not be empty!',
} as const;

const LOCATION_ERROR_MESSAGE: Record<LocationMapError, string> = {
  NOT_SELECTED: 'Select your event location!',
} as const;

export const useNewEventModal = (): AddEditEventForm => {
  const { fetch, isFetching } = useApi();
  const { handleShowSnackBar } = useSnackBar();

  const [message, setMessage] = useState<ReactNode>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [dateError, setDateError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const [locationError, setLocationError] = useState<string | undefined>();

  const [nameIsValidated, setNameIsValidated] = useState<boolean>(false);
  const [dateIsValidated, setDateIsValidated] = useState<boolean>(false);
  const [descriptionIsValidated, setDescriptionIsValidated] =
    useState<boolean>(false);
  const [locationIsValidated, setLocationIsValidated] =
    useState<boolean>(false);

  const handleGetAddressDetails = useCallback(
    async (location: EventLocation) => {
      const { lng, lat } = location;
      const response = await fetch<EventLocation>(HttpMethod.GET, {
        path: `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=dde5b9dfbec541c0bf8d0e42676e1e27`,
      });
      return response;
    },
    [fetch]
  );

  const handleAddUpdateEvent = useCallback(
    async (
      name: string,
      date: number,
      description: string,
      location: EventLocation,
      isPrivate: boolean,
      id?: number
    ) => {
      const httpMethod = id ? HttpMethod.PATCH : HttpMethod.POST;
      const path = id ? `/api/events/${id}` : '/api/events';

      const status = await fetch<Event>(httpMethod, {
        path,
        payload: JSON.stringify({
          name,
          date,
          description,
          location,
          isPrivate,
        }),
      })
        .then((response) => {
          const [data] = response;
          if (!data.id) {
            handleShowSnackBar('Error has occured! Please try again.', 'error');
            return false;
          }
          handleShowSnackBar('Event saved successfully!', 'success');
          return true;
        })
        .catch(() => {
          handleShowSnackBar('Error has occured! Please try again.', 'error');
          return false;
        });
      return status;
    },
    [fetch, handleShowSnackBar]
  );

  const validateForm = useCallback(
    (
      name: string,
      date: number,
      description: string,
      location?: EventLocation
    ) => {
      let isValid = true;

      if (name === '') {
        setNameError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (!date) {
        setDateError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (description === '') {
        setDescriptionError(INPUT_ERRORS_MESSAGES.EMPTY);
        isValid = false;
      }

      if (!location || !('lat' in location && 'lng' in location)) {
        setLocationError(LOCATION_ERROR_MESSAGE.NOT_SELECTED);
        isValid = false;
      }

      setNameIsValidated(true);
      setDateIsValidated(true);
      setDescriptionIsValidated(true);
      setLocationIsValidated(true);

      return isValid;
    },
    []
  );

  const clearMessage = useCallback(() => {
    setMessage(undefined);
  }, []);

  const clearErrors = useCallback(() => {
    setNameError(undefined);
    setDateError(undefined);
    setDescriptionError(undefined);
    setLocationError(undefined);
  }, []);

  const clearValidation = useCallback(() => {
    setNameIsValidated(false);
    setDateIsValidated(false);
    setDescriptionIsValidated(false);
    setLocationIsValidated(false);
  }, []);

  const validationCleaners: Record<NewEventFormInput | 'ALL', () => void> =
    useMemo(() => {
      return {
        NAME: () => {
          setNameError(undefined);
          setNameIsValidated(false);
        },
        EVENT_DATE: () => {
          setDateError(undefined);
          setDateIsValidated(false);
        },
        DESCRIPTION: () => {
          setDescriptionError(undefined);
          setDescriptionIsValidated(false);
        },
        LOCATION: () => {
          setLocationError(undefined);
          setLocationIsValidated(false);
        },
        ALL: () => {
          clearValidation();
          clearErrors();
        },
      };
    }, [clearErrors, clearValidation]);

  const clearValidationAndError = useCallback(
    (input?: NewEventFormInput) => {
      validationCleaners[input ?? 'ALL']();
    },
    [validationCleaners]
  );

  return {
    message,
    isFetching,
    errors: {
      nameError,
      dateError,
      descriptionError,
      locationError,
    },
    isValidated: {
      nameIsValidated,
      dateIsValidated,
      descriptionIsValidated,
      locationIsValidated,
    },
    clearMessage,
    clearValidationAndError,
    validateForm,
    handleAddUpdateEvent,
    handleGetAddressDetails,
  };
};
