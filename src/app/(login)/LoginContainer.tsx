"use client";

import { useState } from "react";
import { authenticate } from "@/src/utils/auth/authenticate";
import retrieveUser from "@/src/app/actions/user/retrieveUser";
import saveUser from "@/src/app/actions/user/saveUser";

export default function LoginContainer() {
  type LoginState = "username" | "login" | "signup";
  const [loginState, setLoginState] = useState<LoginState>("username");

  const [username, setUsername] = useState("");

  // if (
  //     !window?.PublicKeyCredential !== undefined &&
  //     typeof window.PublicKeyCredential === "function"
  // ) {
  //   return Promise.resolve(false);
  // }
  //
  // const globalPublicKeyCredential =
  //     window.PublicKeyCredential as unknown as PublicKeyCredentialOverride;
  //
  // if (globalPublicKeyCredential.isConditionalMediationAvailable === undefined) {
  //   return Promise.resolve(false);
  // }
  //
  // if (!(await globalPublicKeyCredential.isConditionalMediationAvailable())) {
  //   return false;
  // }
  //
  // // call authenticate
  // console.log("Woah we have conditional mediation");
  // return true;

  const onButtonClicked = async () => {
    // FIXME: check if username exists or not
    console.log(`Username: ${username}`);

    if (username == "") {
      console.warn("Must enter a username");
      return;
    }

    switch (loginState) {
      case "username":
        const userExists = await retrieveUser(username);
        if (userExists != null) {
          setLoginState("login");
          return;
        }

        setLoginState("signup");
        return;

      case "login":
        await authenticate();
        return;

      case "signup":
        await saveUser(username);
        return;
    }
  };

  const onPasskeyClicked = async () => {
    await authenticate();
  };

  const getButtonText = (loginState: LoginState) => {
    switch (loginState) {
      case "username":
        return "Continue";
      case "login":
        return "Login";
      case "signup":
        return "Create Account";
    }
  };

  return (
    <div>
      <div className=" flex justify-center items-center">
        <div className="w-2/5 bg-gray-200 p-16 rounded-2xl">
          <h3 className="mb-6">Sign in or sign up</h3>

          <div className="mb-4">
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              type="text"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
              autoComplete="username webauthn"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="enter some fake username"
              required
              autoFocus
            />
          </div>

          {loginState != "username" && (
            <div className="mb-3">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
              <input
                type="text"
                id="password"
                autoComplete="username webauthn"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="enter some fake password"
                required
                autoFocus
              />
            </div>
          )}

          <button
            className="my-4 w-full"
            onClick={() => {
              void (async () => {
                onButtonClicked();
              })();
            }}
          >
            {getButtonText(loginState)}
          </button>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>

          <button
            onClick={() => {
              void onPasskeyClicked();
            }}
            className="my-4 w-full bg-transparent text-black border-2 border-black"
          >
            Sign in with Passkey
          </button>
        </div>
      </div>
    </div>
  );
}
