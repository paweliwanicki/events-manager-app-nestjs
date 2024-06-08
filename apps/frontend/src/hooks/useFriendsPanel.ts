import { useCallback, useState } from "react";
import { useApi } from "./useApi";
import { HttpMethod } from "../enums/HttpMethods";
import { useSnackBar } from "../contexts/snackBarContext";
import { ResponseStatus } from "../enums/ResponseStatus";

export type FriendshipUser = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Friendship = {
  friendshipId: number;
  user: FriendshipUser;
};

type FriendsPanelResponse = {
  message: string;
  status: ResponseStatus;
  data: {
    friends: Friendship[];
    availableUsersToInvite: FriendshipUser[];
    requestsSent: Friendship[];
    requestsReceived: Friendship[];
  };
};

type FriendsPanel = {
  friendsList: Friendship[];
  receivedFriendsRequests: Friendship[];
  sentFriendRequests: Friendship[];
  availableUsersToInvite: FriendshipUser[];
  isFetching: boolean;
  addFriend: (friendId: number) => Promise<boolean>;
  removeFriend: (id: number) => Promise<boolean>;
  acceptFriendRequest: (id: number) => Promise<boolean>;
  removeFriendRequest: (id: number) => Promise<boolean>;
  getFriendsList: () => Promise<void>;
};

export const useFriendsPanel = (): FriendsPanel => {
  const { fetch, isFetching } = useApi();
  const { handleShowSnackBar } = useSnackBar();
  const [friendsList, setFriendsList] = useState<Friendship[]>([]);
  const [sentFriendRequests, setSendedFriendsRequests] = useState<Friendship[]>(
    []
  );
  const [receivedFriendsRequests, setReceivedFriendsRequests] = useState<
    Friendship[]
  >([]);
  const [availableUsersToInvite, setAvailableUsersToInvite] = useState<
    FriendshipUser[]
  >([]);

  const getFriendsList = useCallback(async () => {
    const [response] = await fetch<FriendsPanelResponse>(HttpMethod.GET, {
      path: "/api/user/friendship",
    });

    if (response.status === ResponseStatus.SUCCESS && response.data) {
      const {
        requestsReceived,
        requestsSent,
        availableUsersToInvite,
        friends,
      } = response.data;
      setFriendsList(friends);
      setReceivedFriendsRequests(requestsReceived);
      setSendedFriendsRequests(requestsSent);
      setAvailableUsersToInvite(availableUsersToInvite);
    }
  }, [fetch]);

  const addFriend = useCallback(
    async (friendId: number) => {
      const [response] = await fetch<FriendsPanelResponse>(HttpMethod.POST, {
        path: `/api/user/friendship?friendId=${friendId}`,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        getFriendsList();
        handleShowSnackBar(
          "The invitation was sent successfully!",
          ResponseStatus.SUCCESS
        );
        return true;
      }
      handleShowSnackBar(
        "There was an error when sending the invitation!",
        ResponseStatus.ERROR
      );
      return false;
    },
    [fetch, getFriendsList, handleShowSnackBar]
  );

  const removeFriend = useCallback(
    async (id: number) => {
      const [response] = await fetch<FriendsPanelResponse>(HttpMethod.DELETE, {
        path: `/api/user/friendship/${id}`,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        getFriendsList();
        handleShowSnackBar(
          "Friend was removed successfuly!",
          ResponseStatus.SUCCESS
        );
        return true;
      }
      handleShowSnackBar(
        "Error occured during removing a friend!",
        ResponseStatus.ERROR
      );
      return false;
    },

    [fetch, getFriendsList, handleShowSnackBar]
  );

  const acceptFriendRequest = useCallback(
    async (id: number) => {
      const [response] = await fetch<FriendsPanelResponse>(HttpMethod.POST, {
        path: `/api/user/friendship/invitation?friendshipId=${id}&isAccepted=true`,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        getFriendsList();
        handleShowSnackBar(
          "Friend was added successfuly!",
          ResponseStatus.SUCCESS
        );
        return true;
      }
      handleShowSnackBar(
        "Error occured during adding a friend!",
        ResponseStatus.ERROR
      );
      return false;
    },

    [fetch, getFriendsList, handleShowSnackBar]
  );

  const removeFriendRequest = useCallback(
    async (id: number) => {
      const [response] = await fetch<FriendsPanelResponse>(HttpMethod.DELETE, {
        path: `/api/user/friendship/${id}`,
      });

      if (response.status === ResponseStatus.SUCCESS) {
        getFriendsList();
        handleShowSnackBar(
          "The invitation has been declined",
          ResponseStatus.SUCCESS
        );
        return true;
      }
      handleShowSnackBar(
        "There was an error while declining the invitation!",
        ResponseStatus.ERROR
      );
      return false;
    },

    [fetch, getFriendsList, handleShowSnackBar]
  );

  return {
    friendsList,
    sentFriendRequests,
    receivedFriendsRequests,
    availableUsersToInvite,
    isFetching,
    addFriend,
    removeFriend,
    removeFriendRequest,
    acceptFriendRequest,
    getFriendsList,
  };
};
