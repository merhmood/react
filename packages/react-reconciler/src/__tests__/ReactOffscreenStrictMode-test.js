let React;
let Offscreen;
let ReactNoop;
let act;
let log;

describe('ReactOffscreenStrictMode', () => {
  beforeEach(() => {
    jest.resetModules();
    log = [];

    React = require('react');
    Offscreen = React.unstable_Offscreen;
    ReactNoop = require('react-noop-renderer');
    act = require('jest-react').act;
  });

  function Component({label}) {
    React.useEffect(() => {
      log.push(`${label}: useEffect mount`);
      return () => log.push(`${label}: useEffect unmount`);
    });

    React.useLayoutEffect(() => {
      log.push(`${label}: useLayoutEffect mount`);
      return () => log.push(`${label}: useLayoutEffect unmount`);
    });

    log.push(`${label}: render`);

    return <span>label</span>;
  }

  // @gate __DEV__ && enableStrictEffects && enableOffscreen
  it('should trigger strict effects when offscreen is visible', () => {
    act(() => {
      ReactNoop.render(
        <Offscreen mode="visible">
          <Component label="A" />
        </Offscreen>,
      );
    });

    if (__DEV__) {
      expect(log).toEqual([
        'A: render',
        'A: render',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
        'A: useLayoutEffect unmount',
        'A: useEffect unmount',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
      ]);
    } else {
      expect(log).toEqual([
        'A: render',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
      ]);
    }
  });

  // @gate __DEV__ && enableStrictEffects
  it('should not trigger strict effects when offscreen is hidden', () => {
    act(() => {
      ReactNoop.render(
        <Offscreen mode="hidden">
          <Component label="A" />
        </Offscreen>,
      );
    });

    if (__DEV__) {
      expect(log).toEqual(['A: render', 'A: render']);
    } else {
      expect(log).toEqual(['A: render']);
    }

    log = [];

    act(() => {
      ReactNoop.render(
        <Offscreen mode="visible">
          <Component label="A" />
        </Offscreen>,
      );
    });

    if (__DEV__) {
      expect(log).toEqual([
        'A: render',
        'A: render',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
        'A: useLayoutEffect unmount',
        'A: useEffect unmount',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
      ]);
    } else {
      expect(log).toEqual([
        'A: render',
        'A: useLayoutEffect mount',
        'A: useEffect mount',
      ]);
    }
  });
});
