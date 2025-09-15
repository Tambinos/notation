// import React from 'react';
// import {render, fireEvent, RenderOptions, waitFor} from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import OverviewScreen from '../app/overview';
//
// // --- MOCKS ---
//
// // 1. Corrected the mock to use <View /> instead of <div />
// jest.mock('react-native/Libraries/Lists/SectionList', () => {
//     const React = require('react');
//     const { View } = require('react-native');
//
//     const MockSectionList = ({ sections, renderItem, keyExtractor }: any) => {
//         const renderSection = (section: any) =>
//             section.data.map((item: any, index: number) => (
//                 // Using a View with a key for each item
//                 <View key={keyExtractor(item, index)}>
//                     {renderItem({ item, section })}
//                 </View>
//             ));
//
//         return <View>{sections.flatMap(renderSection)}</View>;
//     };
//     return MockSectionList;
// });
//
// jest.mock('../utils/AsyncStorage', () => ({
//     getAllItems: jest.fn(),
//     removeItem: jest.fn(),
// }));
//
// jest.mock('expo-router', () => ({
//     useRouter: () => ({
//         push: jest.fn(),
//     }),
// }));
//
// // --- CUSTOM RENDER SETUP ---
//
// const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
//     return (
//         <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
//             <NavigationContainer>{children}</NavigationContainer>
//         </SafeAreaProvider>
//     );
// };
//
// const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
//     render(ui, { wrapper: AllTheProviders, ...options });
//
//
// describe('OverviewScreen Snapshots', () => {
//
//
//     it('should match the snapshot when a card is active', async () => {
//         // Arrange
//         const mockNotes = [
//             { id: '1', title: 'Test Note', owner: 'T', shared: false },
//         ];
//
//         const { getByText, findByTestId, toJSON } = customRender(
//             <OverviewScreen initialNotes={mockNotes} />
//         );
//
//
//         await waitFor(() => {
//             expect(findByTestId('loading')).toBeDefined();
//         });
//
//         // Act
//         fireEvent.press(getByText('Test Note'));
//
//         // Assert
//         await findByTestId('btn-delete-1');
//         expect(toJSON()).toMatchSnapshot();
//     });
// });