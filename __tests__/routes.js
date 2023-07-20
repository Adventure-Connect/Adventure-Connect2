import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

jest.mock("axios");

describe("api/login route", () => {
  it("if username and password are correct, it redirects to /userProfiles", async () => {
    const requestData = {
      username: "testuser",
      password: "testpassword",
    };

    axios.post("/api/login");

    // Simulate user interaction by filling the form and submitting it

    //todo: restructure to match frontend structure
    const usernameInput = getByLabelText("Username");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Submit");

    fireEvent.change(usernameInput, { target: { value: "testytesttest" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Wait for the redirection and backend request to complete
    await waitFor(() => {
      expect(history.location.pathname).toBe("/userProfiles");
      expect(axios.post).toHaveBeenCalledWith("/api/login", {
        username: "testuser",
        password: "testpassword",
      });
    });
  });
  it("if the username is correct, it redirects to the home page", async () => {});
  it("if the username doesn't exist in the database, it redirects to the home page", async () => {});
});
