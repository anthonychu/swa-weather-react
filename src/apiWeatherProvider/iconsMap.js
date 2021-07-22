import svgIcons from './svgIcons';

const iconsMap = {
  '1': svgIcons.sunny,
  '2': svgIcons.sunny,
  '3': svgIcons.sunny,
  '4': svgIcons.sunny,
  '5': svgIcons.sunny,
  '6': svgIcons.cloudy,
  '7': svgIcons.cloudy,
  '8': svgIcons.cloudy,
  '11': svgIcons.fog,
  '12': svgIcons.showers,
  '13': svgIcons.showers,
  '14': svgIcons.showers,
  '15': svgIcons.thunderstorms,
  '16': svgIcons.thunderstorms,
  '17': svgIcons.thunderstorms,
  '18': svgIcons.rain,
  '19': svgIcons.snow,
  '20': svgIcons.snow,
  '21': svgIcons.snow,
  '22': svgIcons.snow,
  '23': svgIcons.snow,
  '24': svgIcons.sleet,
  '25': svgIcons.sleet,
  '26': svgIcons.sleet,
  '29': svgIcons.windySnow,
  '30': svgIcons.sunny,
  '31': svgIcons.snow,
  '32': svgIcons.stormyShowers,
};

export const getIcon = name => {
  if (iconsMap[name]) {
    return iconsMap[name];
  }
  return svgIcons.sunny;
};
