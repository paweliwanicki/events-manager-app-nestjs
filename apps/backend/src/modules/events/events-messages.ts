export const EVENTS_EXCEPTION_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'Event not found',
} as const;

export const EVENTS_EXCEPTION_PARTICIPATION_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'Event participation not found',
  ALREADY_PARTICIPATED: 'User already participated in this event',
  JOIN_EVENT: 'Successfully joined the event!',
  LEFT_EVENT: 'Successfully left the event!',
  ERROR_DURING_LEAVING_EVENT: 'An error occurred while leaving the event!',
  ERROR_DURING_JOINING_EVENT: 'An error occurred while joining the event!',
} as const;
