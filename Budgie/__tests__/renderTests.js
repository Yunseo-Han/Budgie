import React from 'react';
import renderer from 'react-test-renderer';
import {BudgetContainer, BudgetPreviewButton, BudgetListScreen} from '../screens/budgetListScreen';
import {BudgetScreen, Category, ModalAddCategory} from "../screens/budgetScreen" 

test('renders correctly', () => {
    const tree = renderer.create(<BudgetContainer/>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders correctly', () => {
    const tree = renderer.create(<BudgetPreviewButton/>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders correctly', () => {
    const tree = renderer.create(<BudgetListScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders correctly', () => {
    const tree = renderer.create(<BudgetScreen/>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders correctly', () => {
    const tree = renderer.create(<Category/>).toJSON();
    expect(tree).toMatchSnapshot();
});

test('renders correctly', () => {
    const tree = renderer.create(<ModalAddCategory/>).toJSON();
    expect(tree).toMatchSnapshot();
});