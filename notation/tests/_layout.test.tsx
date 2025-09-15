import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react-native";
import Layout from "../app/_layout";
import * as DocumentPicker from "expo-document-picker";
import {Alert} from "react-native";

jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
    Slot: () => null,
}));

jest.mock("expo-document-picker", () => ({
    getDocumentAsync: jest.fn(),
}));

declare global {
    var fetch: jest.Mock;
    var setItem: jest.Mock;
}

global.fetch = jest.fn();
jest.spyOn(Alert, "alert");
global.setItem = jest.fn();

describe("handleImport via Layout (integration)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("positive: imports valid JSON and navigates", async () => {
        const fakeJson = { title: "Test Note" };

        (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
            canceled: false,
            assets: [{ uri: "file://test.json" }],
        });

        (fetch as jest.Mock).mockResolvedValueOnce({
            text: () => Promise.resolve(JSON.stringify(fakeJson)),
        });

        const { getByRole } = render(<Layout />);
        const uploadBtn = getByRole("button");

        fireEvent.press(uploadBtn);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Success",
                "The JSON file was imported successfully!"
            );
            expect(require("expo-router").router.push).toHaveBeenCalledWith("/");
            expect(global.setItem).toHaveBeenCalledTimes(1);
        });
    });

    it("negative: shows error when picker rejects", async () => {
        (DocumentPicker.getDocumentAsync as jest.Mock).mockRejectedValueOnce(
            new Error("fail")
        );

        const { getByRole } = render(<Layout />);
        const uploadBtn = getByRole("button");

        fireEvent.press(uploadBtn);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Error",
                "An error occurred while trying to import the file."
            );
            expect(require("expo-router").router.push).not.toHaveBeenCalled();
        });
    });
});
