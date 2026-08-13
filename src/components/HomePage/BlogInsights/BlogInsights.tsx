/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { FlatList, View } from 'react-native';
import ContentSection from '../../reusable/ContentSectoin/ContentSection';
import { SansText } from '../../reusable/Text/SansText';
import FeatureCardSkeleton from '../../tabs/home/home/FeatureCard/FeatureCardSkeleton';
import { NavigationProp } from '../../shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import BlogCard from './BlogCard';

type TBlogInsightsProps = {
  isLoading: boolean;
  data: any;
};

const BlogInsights: React.FC<TBlogInsightsProps> = ({ isLoading, data }) => {
  const navigation = useNavigation<NavigationProp>();

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
      ) : data?.length > 0 ? (
        data?.map((blog: any) => (
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
        ))
      ) : (
        <SansText>No blogs available</SansText>
      )}
    </View>
  );
};

export default BlogInsights;
