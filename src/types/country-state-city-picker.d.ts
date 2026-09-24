// country-state-city-picker.d.ts
declare module 'country-state-city-picker' {
  import { ComponentType } from 'react';

  interface CountryStateCityPickerProps {
    updateLocation?: (location: any) => void;
    defaultCountry?: string;
    cityPlaceholder?: string;
    countryPlaceholder?: string;
    statePlaceholder?: string;
    [key: string]: any;
  }

  const CountryStateCityPicker: ComponentType<CountryStateCityPickerProps>;
  export default CountryStateCityPicker;
}