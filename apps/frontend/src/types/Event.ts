import { User } from './User';

export type Event = {
  id: number;
  name: string;
  date: number;
  description: string;
  location: {
    lng: number;
    lat: number;
    address: string;
  };
  isPrivate: boolean;
  createdBy: number;
  createdAt: number;
  archived: boolean;
  participationId?: number;
};

export type EventParticipation = {
  user: User;
  event: Event;
};
