/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import GemCardSkeleton from '../../tabs/home/home/GemCard/GemCardSkeleton';
import GemCard from '../../tabs/home/home/GemCard/GemCard';

type TRecommendedRemediesProps = {
  isLoading: boolean;
  data: any;
};

const RecommendedRemedies: React.FC<TRecommendedRemediesProps> = ({
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
          <ContentSection title="Recommended Remedies">
            <SansText>
              Spiritual tools recommended based on planetary alignment and
              energies.
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
              marginTop: 34,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 12,
                }}
              />
            )}
            renderItem={() => <GemCardSkeleton />}
          />
        ) : (
          <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 30,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: 12,
                }}
              />
            )}
            renderItem={({ item }) => (
              <GemCard
                title={item.title}
                description={item.description}
                variant={item.type === 'product' ? 'product' : 'pooja'}
                id={item.id}
                image={item.image}
              />
            )}
          />
        )}
      </View>
    )
  );
};

export default RecommendedRemedies;
