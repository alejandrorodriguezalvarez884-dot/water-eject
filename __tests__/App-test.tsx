import { Vibration } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import App from '../App';
import { PROGRAM_SOURCES } from '../src/programs';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'en' }] }));

// Jest stubs every asset require() as the same value; give each program its own source.
jest.mock('../src/programs', () => ({
  ...jest.requireActual('../src/programs'),
  PROGRAM_SOURCES: { tone: 'tone', pulse: 'pulse', sweep: 'sweep', shake: 'shake', wideSweep: 'wideSweep' },
}));

type MockPlayer = { play: jest.Mock; pause: jest.Mock; seekTo: jest.Mock };

jest.mock('expo-audio', () => {
  const players = new Map<unknown, MockPlayer>();
  return {
    __players: players,
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    useAudioPlayer: (source: unknown) => {
      if (!players.has(source)) {
        players.set(source, { play: jest.fn(), pause: jest.fn(), seekTo: jest.fn(() => Promise.resolve()) });
      }
      return players.get(source);
    },
    useAudioPlayerStatus: () => ({ error: null }),
  };
});

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(() => Promise.resolve()),
  deactivateKeepAwake: jest.fn(() => Promise.resolve()),
}));

const players: Map<unknown, MockPlayer> = jest.requireMock('expo-audio').__players;
const playerFor = (program: keyof typeof PROGRAM_SOURCES) => players.get(PROGRAM_SOURCES[program])!;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});
  jest.spyOn(Vibration, 'cancel').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const startButton = () => screen.getByRole('button', { name: 'Start' });

test('shows the water mode ready to start', async () => {
  await render(<App />);
  expect(screen.getByText('Speaker Cleaner')).toBeOnTheScreen();
  expect(screen.getByText('Tap the button to start')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: /Water/, selected: true })).toBeOnTheScreen();
  expect(screen.getByText(/Steady, low 165 Hz tone/)).toBeOnTheScreen();
  expect(screen.getByText('Turn the volume all the way up.')).toBeOnTheScreen();
});

test('a full run plays the tone for 30 seconds, vibrates and then shows Done', async () => {
  await render(<App />);
  await fireEvent.press(startButton());

  expect(playerFor('tone').seekTo).toHaveBeenCalledWith(0);
  expect(playerFor('tone').play).toHaveBeenCalled();
  expect(screen.getByText('Ejecting water…')).toBeOnTheScreen();
  expect(screen.getByText('30')).toBeOnTheScreen();
  expect(Vibration.vibrate).toHaveBeenCalled();
  // Mode and program can't change mid-run.
  expect(screen.getByRole('button', { name: /Dust/ })).toBeDisabled();

  await act(async () => {
    jest.advanceTimersByTime(10_000);
  });
  expect(screen.getByText('20')).toBeOnTheScreen();

  await act(async () => {
    jest.advanceTimersByTime(21_000);
  });
  expect(playerFor('tone').pause).toHaveBeenCalled();
  expect(screen.getByText('Done! If it still sounds muffled, run it again.')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: /Dust/ })).toBeEnabled();
});

test('tapping the button again stops the sound', async () => {
  await render(<App />);
  await fireEvent.press(startButton());
  await act(async () => {
    jest.advanceTimersByTime(3_000);
  });
  await fireEvent.press(screen.getByRole('button', { name: 'Tap to stop' }));

  expect(playerFor('tone').pause).toHaveBeenCalled();
  expect(screen.getByText('Tap the button to start')).toBeOnTheScreen();
  expect(startButton()).toBeOnTheScreen();
});

test('dust mode offers its own programs and plays the selected one', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByRole('button', { name: /Dust/ }));

  expect(screen.getByRole('button', { name: 'Shake', selected: true })).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Pulses' })).not.toBeOnTheScreen();
  expect(screen.getByText(/soft, dry brush/)).toBeOnTheScreen();

  await fireEvent.press(screen.getByRole('button', { name: 'Wide sweep' }));
  expect(screen.getByText(/Sweeps 60 to 1500 Hz/)).toBeOnTheScreen();

  await fireEvent.press(startButton());
  expect(playerFor('wideSweep').play).toHaveBeenCalled();
  expect(playerFor('tone').play).not.toHaveBeenCalled();
  expect(screen.getByText('Shaking dust loose…')).toBeOnTheScreen();
});

test('the vibration switch turns vibration off for the next run', async () => {
  await render(<App />);
  const toggle = screen.getByRole('switch', { name: 'Vibration on' });
  expect(toggle).toBeChecked();

  await fireEvent.press(toggle);
  expect(screen.getByRole('switch', { name: 'Vibration off' })).not.toBeChecked();

  await fireEvent.press(startButton());
  expect(Vibration.vibrate).not.toHaveBeenCalled();
});
