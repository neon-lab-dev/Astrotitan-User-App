import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectableOptions from '../SelectableOptions/SelectableOptions';
import { SatoshiText } from '../Text/SatoshiText';

type SortOption = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onApply: (value: string) => void;
};

const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Top Rated', value: 'topRated' },
  { label: 'Most Experienced', value: 'mostExperienced' },
];

const SortBySection = ({ value, onApply }: Props) => {

  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (val: string) => {
    setSelectedValue(val);
    onApply(val);
  };

  return (
    <View style={styles.container}>
      <SatoshiText style={styles.title}>Sort by</SatoshiText>

      <SelectableOptions
        options={SORT_OPTIONS}
        value={selectedValue}
        onChange={handleSelect}
      />
    </View>
  );
};

export default SortBySection;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
    paddingBottom: 56,
  },

  title: {
    fontSize: 21,
    fontFamily: 'Satoshi-Bold',
  },
});