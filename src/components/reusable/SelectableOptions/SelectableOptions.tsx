import TickIcon from '@/assets/icons/visual/tick.svg'; // ✅ FIX import
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SansText } from '../Text/SansText';

type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
};

type Props = {
  options: Option[];
  value: string | string[];
  onChange: (val: any) => void;
  multiple?: boolean;
};

const SelectableOptions: React.FC<Props> = ({
  options,
  value,
  onChange,
  multiple = false,
}) => {

  const isSelected = (val: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const handlePress = (val: string) => {
    if (multiple) {
      if (!Array.isArray(value)) return;

      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <ScrollView   showsVerticalScrollIndicator={false}>
      <View style={{ gap: 12 }}>
        {options.map((item) => {
          const selected = isSelected(item.value);
          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => handlePress(item.value)}
              style={[
                styles.card,
                selected && !multiple && styles.singleSelectedCard,
                selected && multiple && styles.multiSelectedCard,
              ]}
            >
              <View style={styles.left}>
                {Icon && <Icon width={20} height={20} />}
                <SansText style={styles.text}>{item.label}</SansText>
              </View>

              {multiple && (
                <View
                  style={[
                    styles.circle,
                    selected && styles.selectedCircle,
                  ]}
                >
                  {selected && (
                    <TickIcon width={12} height={12} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default SelectableOptions;

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#EDDEAD",
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  singleSelectedCard: {
    borderColor: '#D4AF37',
  },
  multiSelectedCard: {
    backgroundColor: '#D4AF37',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    color: '#111',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',   // ✅ center tick
    justifyContent: 'center', // ✅ center tick
  },
  selectedCircle: {
    backgroundColor: '#E9F7EB',
    borderColor: "#E9F7EB",
  },
});