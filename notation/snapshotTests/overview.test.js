import React from "react";
import { render } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OverviewScreen from "../app/overview.tsx";

jest.mock("expo-router", () => {
	const React = require("react");
	return {
		useRouter: () => ({ push: jest.fn() }),
		useFocusEffect: (cb) => {
			React.useEffect(cb, []); // run after render
		},
	};
});

jest.mock("expo-sharing", () => ({
	isAvailableAsync: jest.fn().mockResolvedValue(true),
	shareAsync: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
	File: class {
		constructor(_path, filename) {
			this.uri = `file:///${filename}`;
		}
		write = jest.fn();
	},
	Paths: { cache: "/cache" },
}));

jest.mock("../utils/AsyncStorage", () => ({
	getAllItems: jest.fn().mockResolvedValue({}),
	removeItem: jest.fn(),
}));

jest.mock("../app/tile-renderer.tsx", () => {
	const { View } = require("react-native");
	return function MockTileRenderer() {
		return <View testID="mock-tile-renderer" />;
	};
});

describe("OverviewScreen", () => {
	it("renders correctly and matches snapshot", async () => {
		const tree = render(
			<SafeAreaProvider>
			<OverviewScreen />
			</SafeAreaProvider>
		).toJSON();

		expect(tree).toMatchSnapshot();
	});
});

