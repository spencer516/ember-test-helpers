import getElement from './-get-element';
import fireEvent from './fire-event';
import { __focus__ } from './focus';
import settled from '../settled';
import isFocusable from './-is-focusable';
import { nextTickPromise } from '../-utils';
import isFormControl from './-is-form-control';
import Target from './-target';

/**
  @private
  @param {Element} element the element to click on
  @param {Object} options the options to be merged into the mouse events
*/
export function __click__(element: Element | Document, options: MouseEventInit): void {
  fireEvent(element, 'mousedown', options);

  if (isFocusable(element)) {
    __focus__(element);
  }

  fireEvent(element, 'mouseup', options);
  fireEvent(element, 'click', options);
}

/**
  Clicks on the specified target.

  Sends a number of events intending to simulate a "real" user clicking on an
  element.

  For non-focusable elements the following events are triggered (in order):

  - `mousedown`
  - `mouseup`
  - `click`

  For focusable (e.g. form control) elements the following events are triggered
  (in order):

  - `mousedown`
  - `focus`
  - `focusin`
  - `mouseup`
  - `click`

  The exact listing of events that are triggered may change over time as needed
  to continue to emulate how actual browsers handle clicking a given element.

  Use the `options` hash to change the parameters of the MouseEvents.

  @public
  @param {string|Element} target the element or selector to click on
  @param {Object} options the options to be merged into the mouse events
  @return {Promise<void>} resolves when settled
*/
export default function click(target: Target, options: MouseEventInit = {}): Promise<void> {
  return nextTickPromise().then(() => {
    if (!target) {
      throw new Error('Must pass an element or selector to `click`.');
    }

    let element = getElement(target);
    if (!element) {
      throw new Error(`Element not found when calling \`click('${target}')\`.`);
    }

    let isDisabledFormControl = isFormControl(element) && element.disabled;

    if (!isDisabledFormControl) {
      __click__(element, options);
    }

    return settled();
  });
}
