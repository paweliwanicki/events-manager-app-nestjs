import { useCallback, useState } from 'react';
import { ResponseStatus, useApi } from './useApi';
import { HttpMethod } from '../enums/HttpMethods';
import { useSnackBar } from '../contexts/snackBarContext';
import { User } from '../types/User';

export type Friendship = {
  friendshipId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export type FriendShipData = Partial<User> & {
  friendshipId: number;
};

type FriendsPanelResponse = {
  message: string;
  status: ResponseStatus;
  data: {
    friends: Friendship[];
    sentFriendRequests: Friendship[];
    receivedFriendRequests: Friendship[];
    otherUsers: Partial<User>[];
  };
};

type FriendsPanel = {
  friendsList: FriendShipData[];
  receivedFriendsRequests: FriendShipData[];
  sentFriendRequests: FriendShipData[];
  otherUsers: Partial<User>[];
  isFetching: boolean;
  addFriend: (email: string) => Promise<boolean>;
  removeFriend: (id: number) => Promise<boolean>;
  acceptFriendRequest: (id: number) => Promise<boolean>;
  removeFriendRequest: (id: number) => Promise<boolean>;
  getFriendsList: () => Promise<void>;
};

const getFriendshipData = (data: Friendship[]) => {
  return data.map(({ friendshipId, user }: Friendship) => {
    const { email, firstName, lastName } = user;
    return {
      id: friendshipId,
      friendshipId,
      email,
      firstName,
      lastName,
    };
  });
};

export const useFriendsPanel = (): FriendsPanel => {
  const { fetchWithJwt, isFetching } = useApi();
  const { handleShowSnackBar } = useSnackBar();
  const [friendsList, setFriendsList] = useState<FriendShipData[]>([]);
  const [sentFriendRequests, setSendedFriendsRequests] = useState<
    FriendShipData[]
  >([]);
  const [receivedFriendsRequests, setReceivedFriendsRequests] = useState<
    FriendShipData[]
  >([]);
  const [otherUsers, setOtherUsers] = useState<Partial<User>[]>([]);

  const getFriendsList = useCallback(async () => {
    const [response] = await fetchWithJwt<FriendsPanelResponse>(
      HttpMethod.GET,
      {
        path: '/api/users/userPanel',
      }
    );

    if (response.status === 'Success' && response.data) {
      const {
        receivedFriendRequests,
        sentFriendRequests,
        otherUsers,
        friends,
      } = response.data;
      setFriendsList(getFriendshipData(friends));
      setReceivedFriendsRequests(getFriendshipData(receivedFriendRequests));
      setSendedFriendsRequests(getFriendshipData(sentFriendRequests));
      setOtherUsers(otherUsers);
    }
  }, [fetchWithJwt]);

  const addFriend = useCallback(
    async (friendId: string) => {
      const [response] = await fetchWithJwt<FriendsPanelResponse>(
        HttpMethod.POST,
        {
          path: `/api/friendship?friendId=${friendId}`,
        }
      );

      if (response.status === 'Success') {
        getFriendsList();
        handleShowSnackBar('The invitation was sent successfully!', 'success');
        return true;
      }
      handleShowSnackBar(
        'There was an error when sending the invitation!',
        'error'
      );
      return false;
    },
    [fetchWithJwt, getFriendsList, handleShowSnackBar]
  );

  const removeFriend = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<FriendsPanelResponse>(
        HttpMethod.DELETE,
        {
          path: `/api/friendship/${id}`,
        }
      );

      if (response.status === 'Success') {
        getFriendsList();
        handleShowSnackBar('Friend was removed successfuly!', 'success');
        return true;
      }
      handleShowSnackBar('Error occured during removing a friend!', 'error');
      return false;
    },

    [fetchWithJwt, getFriendsList, handleShowSnackBar]
  );

  const acceptFriendRequest = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<FriendsPanelResponse>(
        HttpMethod.POST,
        {
          path: `/api/friendship/invitation?friendshipId=${id}&isAccepted=true`,
        }
      );

      if (response.status === 'Success') {
        getFriendsList();
        handleShowSnackBar('Friend was removed successfuly!', 'success');
        return true;
      }
      handleShowSnackBar('Error occured during removing a friend!', 'error');
      return false;
    },

    [fetchWithJwt, getFriendsList, handleShowSnackBar]
  );

  const removeFriendRequest = useCallback(
    async (id: number) => {
      const [response] = await fetchWithJwt<FriendsPanelResponse>(
        HttpMethod.DELETE,
        {
          path: `/api/friendship/${id}`,
        }
      );

      if (response.status === 'Success') {
        getFriendsList();
        handleShowSnackBar('The invitation has been declined', 'success');
        return true;
      }
      handleShowSnackBar(
        'There was an error while declining the invitation!',
        'error'
      );
      return false;
    },

    [fetchWithJwt, getFriendsList, handleShowSnackBar]
  );

  return {
    friendsList,
    sentFriendRequests,
    receivedFriendsRequests,
    otherUsers,
    isFetching,
    addFriend,
    removeFriend,
    removeFriendRequest,
    acceptFriendRequest,
    getFriendsList,
  };
};
