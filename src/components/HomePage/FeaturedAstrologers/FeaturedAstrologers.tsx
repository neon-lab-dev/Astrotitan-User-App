/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { FlatList, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import ExpertCardSkeleton from '../../tabs/home/home/ExpertCard/ExpertCardSkeleton';
import ExpertCard from '../../tabs/home/home/ExpertCard/ExpertCard';

type TFeaturedAstrologersProps = {
  isLoading: boolean;
  data: any;
};
const FeaturedAstrologers: React.FC<TFeaturedAstrologersProps> = ({
  isLoading,
  data,
}) => {
  return (
    !isLoading &&
    data?.length !== 0 && (
      <View style={{ gap: 12 }}>
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <ContentSection title="Featured Astrologers">
            <SansText>
              Verified experts who help interpret charts and planetary periods.
            </SansText>
          </ContentSection>
        </View>

        {isLoading ? (
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 12,
                }}
              />
            )}
            renderItem={() => <ExpertCardSkeleton />}
          />
        ) : (
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item._id}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 12,
                }}
              />
            )}
            renderItem={({ item }) => (
              <ExpertCard
                _id={item._id}
                name={
                  item?.displayName ||
                  `${item?.firstName || ''} ${item?.lastName || ''}`
                }
                experience={item?.experience || '0'}
                description={item?.bio || 'Experienced astrologer'}
                tags={item?.areaOfPractice || []}
                rating={item?.rating || 4.5}
                image={{
                  uri: item?.profilePicture,
                }}
              />
            )}
          />
        )}
      </View>
    )
  );
};

export default FeaturedAstrologers;
