// components/reusable/Tabs/Tabs.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SatoshiText } from '../Text/SatoshiText';

type TabItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
};

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <View style={[styles.tabContainer]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              {tab.icon && <View style={styles.iconWrapper}>{tab.icon}</View>}
              <SatoshiText
                style={[styles.tabText, isActive && styles.tabTextActive]}
              >
                {tab.label}
              </SatoshiText>
            </View>
            {isActive && <View style={[styles.underline]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#c4c092',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {},
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    color: '#1a1a2e',
    // fontFamily: 'Satoshi-Semibold',
  },
  tabTextActive: {
    color: '#6c5300',
    fontFamily: 'Satoshi-Bold',
  },
  underline: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
});
