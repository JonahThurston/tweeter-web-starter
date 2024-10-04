import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./userInfoHook";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();

  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    presenter.navigateToUser(event, authToken!, currentUser!);
  };

  const listener: UserNavigationView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  return {
    navigateToUser: navigateToUser,
  };
};

export default useUserNavigation;
