export const logoVariants = [
  ['L1', 'Paired orbit'], ['L2', 'Bond pulse'], ['L3', 'Electron exchange'], ['L4', 'Spin pair'], ['L5', 'Shared snap'],
  ['L6', 'Runtime handshake'], ['L7', 'Figure-eight pair'], ['L8', 'Density breathe'], ['L9', 'Version tick'], ['L10', 'Test pass'],
] as const;

export const heroVariants = [
  ['H1', 'Orbital field'], ['H2', 'Adoption pipeline'], ['H3', 'Runtime constellation'], ['H4', 'Package split'], ['H5', 'Duplicate collapse'],
  ['H6', 'Paired-spin lab'], ['H7', 'Test chamber'], ['H8', 'Version rails'], ['H9', 'Evidence stream'], ['H10', 'Interactive bond'],
] as const;

export const effectVariants = [
  ['F1', 'Scroll transfer'], ['F2', 'Active-route bond'], ['F3', 'Header-to-footer orbit'], ['F4', 'Runtime status rail'], ['F5', 'Reading-progress bond'],
  ['F6', 'Footer recombination'], ['F7', 'Activity ticker'], ['F8', 'Link magnetism'], ['F9', 'Release heartbeat'], ['F10', 'Paired page transition'],
] as const;

export const recommendedMotion = {
  enabled: true,
  ambientPaused: false,
  debug: false,
  logo: 'L7',
  homeHero: 'H2',
  runtimeHero: 'H3',
  applicationHero: 'H7',
  generalHero: 'H6',
  effects: ['F2', 'F7'],
} as const;

export const motionStorageKey = 'sharedpair.motion.v1';
