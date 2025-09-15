import React from "react";
import renderer from "react-test-renderer";
import OverviewScreen from "../app/overview.tsx";

jest.mock("expo-router", () => ({
	useRouter: () => ({ push: jest.fn() }),
	useFocusEffect: (cb) => cb(), // trigger immediately
}));

jest.mock("expo-sharing", () => ({
	isAvailableAsync: jest.fn().mockResolvedValue(true),
	shareAsync: jest.fn(),
}));

jest.mock("../utils/AsyncStorage", () => ({
	getAllItems: jest.fn().mockResolvedValue({}),
	removeItem: jest.fn(),
}));

jest.mock("../app/tile-renderer", () => () => <></>);

describe("OverviewScreen Component", () => {
	it("renders correctly and matches snapshot", async () => {
		const tree = renderer.create(<OverviewScreen />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
