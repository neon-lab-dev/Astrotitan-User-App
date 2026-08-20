/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import FeatureCardSkeleton from '../../tabs/home/home/FeatureCard/FeatureCardSkeleton';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import BlogCard from './BlogCard';

type TBlogInsightsProps = {
  isLoading: boolean;
  data: any;
};

const BlogInsights: React.FC<TBlogInsightsProps> = ({ isLoading, data }) => {
  const navigation = useNavigation<NavigationProp>();

  // Show only first 3 blogs
  const displayData = data?.slice(0, 3) || [];

  const handleSeeMore = () => {
    navigation.navigate('BlogScreen');
  };

  return (
    <View
      style={{
        gap: 12,
        paddingHorizontal: 16,
      }}
    >
      <ContentSection title="Blog Insights">
        <SansText>
          Short reads to help you understand ongoing planetary themes.
        </SansText>
      </ContentSection>

      {isLoading ? (
        <FlatList
          data={[1, 2]}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 16,
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 12,
              }}
            />
          )}
          renderItem={() => <FeatureCardSkeleton />}
        />
      ) : displayData?.length > 0 ? (
        <>
          {displayData.map((blog: any) => (
            <BlogCard
              key={blog._id}
              title={blog?.title || 'Untitled Blog'}
              image={{
                uri: blog?.thumbnail,
              }}
              ctaText="Read Article"
              height={194}
              onPress={() =>
                navigation.navigate('ArticleScreen', { id: blog?._id })
              }
            />
          ))}

          {/* See More Button */}
          <TouchableOpacity
            style={{
              marginTop: 8,
              alignItems: 'center',
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: '#D4AF37',
              borderRadius: 12,
              backgroundColor: 'rgba(212, 175, 55, 0.05)',
            }}
            onPress={handleSeeMore}
            activeOpacity={0.7}
          >
            <SatoshiText
              style={{
                color: '#D4AF37',
                fontSize: 14,
                fontFamily: 'Satoshi-Medium',
              }}
            >
              See More Blogs →
            </SatoshiText>
          </TouchableOpacity>
        </>
      ) : (
        <SansText>No blogs available</SansText>
      )}
    </View>
  );
};

export default BlogInsights;