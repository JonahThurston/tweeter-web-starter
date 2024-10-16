import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import React from "react";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (newUrl: string) => void;
  setImageBytes: (bytesToSet: Uint8Array) => void;
  setImageFileExtension: (extenstionToSet: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public registerOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string,
    imageBytes: Uint8Array,
    rememberMe: boolean
  ) {
    const requiredFields = [
      firstName,
      lastName,
      alias,
      password,
      imageUrl,
      imageFileExtension,
    ];
    this.onEnterFunction(
      event,
      requiredFields,
      this.getSubmissionFunction(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      ),
      rememberMe,
      undefined
    );
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      this.doSubmit(
        this.getSubmissionFunction(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
        rememberMe,
        undefined
      );
    }, "register user");
    //FINALLY
    this._isLoading = false;
  }

  private getSubmissionFunction(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string
  ) {
    return async () => {
      return this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );
    };
  }

  public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
