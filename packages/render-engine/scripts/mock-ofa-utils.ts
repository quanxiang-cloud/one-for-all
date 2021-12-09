const mockError = jest.fn();
const mockLog = jest.fn();
const mockWarn = jest.fn();
const mockVerbose = jest.fn();

jest.mock('@ofa/utils', () => {
  return {
    logger: {
      error: mockError,
      log: mockLog,
      warn: mockWarn,
      verbose: mockVerbose,
    },
  };
});

afterEach(() => {
  mockError.mockClear();
  mockLog.mockClear();
  mockWarn.mockClear();
  mockVerbose.mockClear();
});
