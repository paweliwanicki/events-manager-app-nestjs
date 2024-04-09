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
  user_id: number;
};
