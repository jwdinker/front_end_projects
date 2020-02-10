const colors = {
  base: '#00a1ff',
  white: '#ffffff',
  black: '#364046',
  gray: ['#f8f9f9', '#ebedef', '#dce1e4', '#ccd3d7', '#bbc5ca', '#a8b4bb', '#93a2aa', '#798b96', '#5d6e77', '#364046'],
  blue: ['#e3f4ff', '#c4e9ff', '#a1dcff', '#78cdff', '#45baff', '#00a1ff', '#0091e6', '#007fca', '#0069a7', '#004c78'],
  indigo: [
    '#e9ecff',
    '#d1d7ff',
    '#b4beff',
    '#92a1ff',
    '#6479ff',
    '#0022ff',
    '#001ee6',
    '#001ac9',
    '#0016a6',
    '#000f76',
  ],
  violet: [
    '#f1eaff',
    '#e2d2ff',
    '#d1b7ff',
    '#bc95ff',
    '#9f68ff',
    '#5e00ff',
    '#5500e6',
    '#4a00ca',
    '#3d00a7',
    '#2c0078',
  ],
  fuschia: [
    '#fceaff',
    '#f9d3ff',
    '#f5b8ff',
    '#f197ff',
    '#eb6bff',
    '#dd00ff',
    '#c800e6',
    '#b000cb',
    '#9200a9',
    '#6a007a',
  ],
  pink: ['#ffeaf7', '#ffd4ef', '#ffb9e5', '#ff99d9', '#ff6dc9', '#ff00a1', '#e70091', '#cb0080', '#a9006a', '#7b004d'],
  red: ['#ffebed', '#ffd4da', '#ffbac3', '#ff9ba8', '#ff6f83', '#ff0022', '#e7001e', '#cb001b', '#a90016', '#7b0010'],
  orange: [
    '#ffeee4',
    '#ffdbc7',
    '#ffc6a5',
    '#ffad7d',
    '#ff8d4b',
    '#ff5e00',
    '#e65400',
    '#ca4a00',
    '#a73d00',
    '#782c00',
  ],
  yellow: [
    '#fffadf',
    '#fff6bd',
    '#fff197',
    '#ffeb6b',
    '#ffe43a',
    '#ffdd00',
    '#e6c800',
    '#cbb000',
    '#a99200',
    '#7a6a00',
  ],
  lime: ['#f4ffe3', '#e9ffc5', '#ddffa2', '#ceff7a', '#bbff47', '#a1ff00', '#91e700', '#80cb00', '#6aa900', '#4d7b00'],
  green: ['#ecffe9', '#d7ffd1', '#beffb5', '#a1ff92', '#79ff64', '#22ff00', '#1ee700', '#1bcb00', '#16a900', '#107b00'],
  teal: ['#e9fff1', '#d2ffe2', '#b6ffd1', '#95ffbc', '#67ff9f', '#00ff5e', '#00e755', '#00cb4a', '#00a93e', '#007b2d'],
  cyan: ['#eafffc', '#d3fff9', '#b8fff5', '#97fff1', '#6affeb', '#00ffdd', '#00e7c8', '#00cbb0', '#00a992', '#007b6b'],
};

const fontWeights = {
  black: 900,
  heavy: 800,
  bold: 700,
  semiBold: 600,
  medium: 500,
  regular: 400,
  thin: 300,
  light: 200,
  ultraLight: 100,
};

// 12 14 16 18 20 22
const fontSizes = ['10px', '12px', '13px', '14px', '16px', '18px', '20px', '22px', '24px', '28px', '30px', '34px'];

// const fontSizes = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.375rem'];

const shadows = ['0 4px 6px 0 rgba(0,0,0,0.06)'];

const paddings = ['5px', '10px', '15px', '20px', '25px', '30px', '35px', '40px', '45px'];

const margins = ['5px', '10px', '15px', '20px', '25px', '30px'];

const radii = ['50%', '4px', '6px', '8px', '10px', '12px', '14px'];

const boxShadows = ['0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)'];

//                     xs        s         m       l         xl        xxl
const breakpoints = ['480px', '576px', '768px', '992px', '1200px', '1600px'];

export default {
  fontWeights,
  fontSizes,
  colors,
  shadows,
  radii,
  breakpoints,
  paddings,
  margins,
};
