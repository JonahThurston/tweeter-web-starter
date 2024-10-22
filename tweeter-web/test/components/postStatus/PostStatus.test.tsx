import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("Post Status Component", () => {
  let mockUser = mock<User>();
  let mockUserInstance = instance(mockUser);

  let mockAuthToken = mock<AuthToken>();
  let mockAuthTokenInstance = instance(mockAuthToken);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text.", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "a");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements();

    await user.type(textField, "a");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const message: string = "Status message";

    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(textField, message);

    await user.click(postButton);

    verify(
      mockPresenter.submitPost(anything(), anything(), anything(), message)
    ).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  render(
    <>{!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}</>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const textField = screen.getByLabelText("postStatusTextArea");
  const postButton = screen.getByLabelText("postStatusButton");
  const clearButton = screen.getByLabelText("clearStatusButton");

  return { postButton, clearButton, textField, user };
};
