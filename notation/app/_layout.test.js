import React from "react";
import renderer from "react-test-renderer";
import Layout from "../app/_layout"; // adjust path if needed

// Mock external dependencies
jest.mock("expo-router", () => ({
    router: { push: jest.fn() },
    Slot: () => <></>,
}));

jest.mock("expo-document-picker", () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
    alert: jest.fn(),
}));

jest.mock("../utils/AsyncStorage", () => ({
    setItem: jest.fn(),
}));

describe("Layout Component", () => {
    it("renders correctly and matches the snapshot", () => {
        const tree = renderer.create(<Layout />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
