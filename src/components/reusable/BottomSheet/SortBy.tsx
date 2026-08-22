import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SelectableOptions from '../SelectableOptions/SelectableOptions';
import { SansText } from '../Text/SansText';
import { SatoshiText } from '../Text/SatoshiText';

type Props = {
  value: string;
  onApply: (value: string) => void;
};

const SortBySection = ({ value, onApply }: Props) => {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <View style={styles.container}>
      <SatoshiText style={styles.title}>Sort by</SatoshiText>

      <SelectableOptions
        options={[
          { label: 'Top Rated', value: 'topRated' },
          { label: 'Most Experienced', value: 'mostExperienced' },
          { label: 'Relevance', value: 'relevance' },
        ]}
        value={selectedValue}
        onChange={(val: string) => {
          setSelectedValue(val);
          onApply(val);
        }}
      />

      <SansText style={styles.footer}>
        Sorting won't affect availability
      </SansText>
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

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
});