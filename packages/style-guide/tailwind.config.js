const colors = require('./colors');

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    spacing: {
      0: '0px',
      2: '2px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      30: '30px',
      40: '40px',
      50: '50px',
    },
    lineHeight: {
      24: '24px',
      28: '28px',
      48: '48px',
    },
    fontSize: {
      24: ['24px', '32px'],
      20: ['20px', '28px'],
      18: ['18px', '28px'],
      16: ['16px', '24px'],
      14: ['14px', '22px'],
      12: ['12px', '20px'],
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
    },
    borderRadius: {
      2: '2px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
      12: '12px',
      none: '0px',
      full: '50%',
    },
    extend: {
      boxShadow: {
        header: "inset 0px -1px 0px #E2E8F0",
        'flow-header': "0px 8px 24px 4px rgba(148, 163, 184, 0.25)",
        'flow-aside': "1px 0px 0px #E2E8F0",
        'more-action': "0px 8px 24px rgba(148, 163, 184, 0.25)",
      },
      width: {
        24: '24px',
        28: '28px',
        32: '32px',
      },
      height: {
        24: '24px',
        28: '28px',
        32: '32px',
      },
    },
  },
};
