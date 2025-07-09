import {expectType, expectError} from 'tsd';
import scrollspy, {ScrollspyOptions, ScrollspyEvent} from '../src';

// Test constructor with selector only
expectType<scrollspy>(new scrollspy('#nav'));

// Test constructor with options
expectType<scrollspy>(
    new scrollspy('#nav', {
        offset: 50,
        nested: true,
        events: false
    })
);

// Test ScrollspyOptions interface
const options: ScrollspyOptions = {
    nav: '#navigation',
    content: '[data-spy]',
    nested: true,
    nestedClass: 'parent-active',
    offset: 100,
    reflow: true,
    events: false
};

expectType<scrollspy>(new scrollspy('#nav', options));

// Test optional properties
const partialOptions: ScrollspyOptions = {
    offset: 25
};

expectType<scrollspy>(new scrollspy('#nav', partialOptions));

// Test invalid options should error
expectError(new scrollspy('#nav', {
    offset: 'invalid', // should be number
}));

expectError(new scrollspy('#nav', {
    nested: 'true', // should be boolean
}));

// Test public methods
const spy = new scrollspy('#nav');

expectType<void>(spy.init());
expectType<void>(spy.getContents());
expectType<void>(spy.detect());
expectType<Array<{ content: Element; offset: number }>>(spy.getPositions());
expectType<number>(spy.getOffsetTop(document.createElement('div')));
expectType<number>(spy.getViewportPosition());

const positions = [{content: document.createElement('div'), offset: 100}];
expectType<Element[]>(spy.getCurrentActive(positions, 150));

expectType<boolean>(spy.isNewActive([]));
expectType<void>(spy.deactivateAll());
expectType<void>(spy.activate([]));
expectType<Element | null>(spy.getNavItem(document.createElement('div')));
expectType<void>(spy.addNestedNavigation(document.createElement('li')));
expectType<void>(spy.emitEvent('activate', document.createElement('div'), document.createElement('a')));
expectType<void>(spy.setupListeners());
expectType<void>(spy.setup());
expectType<void>(spy.destroy());

// Test method parameters
expectError(spy.getOffsetTop('invalid')); // should be Element
expectError(spy.getCurrentActive('invalid', 100)); // first param should be array
expectError(spy.getCurrentActive(positions, 'invalid')); // second param should be number

// Test ScrollspyEvent interface
const eventHandler = (event: CustomEvent<ScrollspyEvent>) => {
    expectType<Element>(event.detail.target);
    expectType<Element>(event.detail.content);
    expectType<Element>(event.detail.nav);
};

// Test global event types
document.addEventListener('gumshoeactivate', eventHandler);

// Test that invalid event names error
expectError(
    document.addEventListener('gumshoeactivate', (event: CustomEvent<string>) => {
        // Should require ScrollspyEvent detail type
    })
);

// Test constructor parameter types
expectError(new scrollspy(123)); // selector should be string
expectError(new scrollspy()); // selector is required

// Test that all interface properties are optional
const emptyOptions: ScrollspyOptions = {};
expectType<scrollspy>(new scrollspy('#nav', emptyOptions));