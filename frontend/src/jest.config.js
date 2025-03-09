// jest.config.js
module.exports = {
    // Other configuration options...
    moduleNameMapper: {
      // Mock CSS imports
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      // Mock image imports
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
      // Mock for problematic modules like lucide-react
      '^lucide-react$': '<rootDir>/__mocks__/lucideMock.js',
      '^flowbite-react$': '<rootDir>/__mocks__/flowbiteMock.js'
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    transformIgnorePatterns: [
      // Fix for node_modules that use ES modules
      'node_modules/(?!(lucide-react|flowbite-react)/)'
    ],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js']
  };
  
  // __mocks__/lucideMock.js
  module.exports = {
    Search: () => 'Search Icon'
    // Add other icons as needed
  };
  
  // __mocks__/flowbiteMock.js
  module.exports = {
    TextInput: () => 'TextInput Component'
    // Add other components as needed
  };
  
  // __mocks__/fileMock.js
  module.exports = 'test-file-stub';
  
  // setupTests.js
  import '@testing-library/jest-dom';