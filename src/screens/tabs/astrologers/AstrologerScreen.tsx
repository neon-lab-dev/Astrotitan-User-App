/* eslint-disable react-native/no-inline-styles */
import CancelIcon from '@/assets/icons/actions/cancel.svg';

import React, { useEffect, useState } from 'react';

import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useGetAllAstrologersQuery } from '../../../redux/features/astrologer/astrologerApi';
import BottomSheetService from '../../../redux/features/ui/GlobalSheet/BottomSheetService';
import SortBySection from '../../../components/reusable/BottomSheet/SortBy';
import FilterSection from '../../../components/reusable/BottomSheet/FilterSection';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { SansText } from '../../../components/reusable/Text/SansText';
import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';
import { AstrologerCard } from '../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCard';
import AstrologerCardSkeleton from '../../../components/tabs/astrologer/astrologer/AstrologerCard/AstrologerCardSkeleton';
import IconButton from '../../../components/reusable/IconButton/IconButton';
import ChatIcon from '@/assets/icons/actions/bubble-chat.svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../components/reusable/AppBar/AppBar';

type Filters = {
  specialization: string[];
  language: string[];
  ratings: string[];
};

// Sort options with labels
const SORT_OPTIONS: Record<string, string> = {
  relevance: 'Relevance',
  topRated: 'Top Rated',
  mostExperienced: 'Most Experienced',
};

const LIMIT = 10;

const AstrologerScreen = () => {
  const [skip, setSkip] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [sortValue, setSortValue] = useState('relevance');
  const [filters, setFilters] = useState<Filters>({
    specialization: [],
    language: [],
    ratings: [],
  });

  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  const { data, isLoading, isFetching, refetch } = useGetAllAstrologersQuery({
    skip,
    limit: LIMIT,
    areaOfPractice: filters.specialization.join(','),
    consultLanguages: filters.language.join(','),
    sortBy: sortValue,
  });

  const astrologers = data?.data?.astrologers || [];

  const meta = data?.data?.meta;
  const hasMore = meta?.hasMore;
  
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setSkip(0);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const onEndReached = () => {
    if (hasMore && !isFetching) {
      setSkip(prev => prev + LIMIT);
    }
  };

  // Get label for sort value
  const getSortLabel = (value: string): string => {
    return SORT_OPTIONS[value] || value;
  };

  const removeTag = (tag: string) => {
    const isSortTag = Object.values(SORT_OPTIONS).includes(tag);
    
    if (isSortTag) {
      setSortValue('relevance');
      return;
    }

    setFilters(prev => ({
      specialization: prev.specialization.filter(item => item !== tag),
      language: prev.language.filter(item => item !== tag),
      ratings: prev.ratings.filter(item => item !== tag),
    }));

    setSkip(0);
  };

  const allSelectedTags = [
    ...filters.specialization,
    ...filters.language,
    ...filters.ratings,
  ];

  // Display sort label instead of value
  const displayTags = sortValue !== 'relevance'
    ? [getSortLabel(sortValue), ...allSelectedTags]
    : allSelectedTags;

  useEffect(() => {
    setSkip(0);
  }, [filters, sortValue]);

  const onSortBy = () => {
    BottomSheetService.open(
      <SortBySection
        value={sortValue}
        onApply={val => {
          setSortValue(val);
          setSkip(0);
          BottomSheetService.close();
        }}
      />,
      {
        height: 430,
        hasGradient: true,
      },
    );
  };

  const onFilter = () => {
    BottomSheetService.open(
      <FilterSection
        value={filters}
        onChange={setFilters}
        onApply={finalFilters => {
          setFilters(finalFilters);
          setSkip(0);
          BottomSheetService.close();
        }}
        onClear={() => {
          setFilters({
            specialization: [],
            language: [],
            ratings: [],
          });
          setSkip(0);
        }}
      />,
      {
        height: 650,
        hasGradient: true,
      },
    );
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar
          title="Astrologers"
          children={
            <IconButton
              Icon={ChatIcon}
              iconColor="#0D0D0D"
              onPress={() => {
                navigation.navigate('SessionHistory');
              }}
            />
          }
        />

        <FlatList
          data={astrologers}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#816B22"
              colors={['#816B22']}
              progressBackgroundColor="#FBF7EB"
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View>
              {/* FILTERS */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <ReusableButton
                    title="Filter"
                    onPress={onFilter}
                    variant="solid"
                    width="100%"
                    iconName="FilterIcon"
                    iconPosition="left"
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <ReusableButton
                    title="Sort By"
                    onPress={onSortBy}
                    variant="ghost"
                    width="100%"
                    iconName="DashboardCircleIcon"
                    iconPosition="left"
                  />
                </View>
              </View>

              {/* TAGS */}
              <View style={styles.tagsRow}>
                {displayTags.map(tag => (
                  <View key={tag} style={styles.tag}>
                    <SansText>{tag}</SansText>
                    <CancelIcon
                      width={14}
                      height={14}
                      onPress={() => removeTag(tag)}
                    />
                  </View>
                ))}
              </View>

              {/* COUNT */}
              <View style={styles.countRow}>
                <View style={styles.dot} />
                <SansText>{meta?.filteredTotal} astrologers available</SansText>
              </View>
            </View>
          }
          renderItem={({ item }) => <AstrologerCard item={item} />}
          contentContainerStyle={{
            padding: 16,
            gap: 16,
            paddingBottom: 40,
          }}
          ListEmptyComponent={
            isLoading || isFetching ? (
              <View style={{ gap: 16 }}>
                {[1, 2, 3].map(item => (
                  <AstrologerCardSkeleton key={item} />
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', marginTop: 80 }}>
                <SansText>No astrologers found</SansText>
              </View>
            )
          }
          ListFooterComponent={
            isLoading || isFetching ? (
              <View style={{ gap: 16 }}>
                {[1, 2, 3].map(item => (
                  <AstrologerCardSkeleton key={item} />
                ))}
              </View>
            ) : null
          }
        />
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default AstrologerScreen;

const styles = StyleSheet.create({
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: 'green',
  },
});