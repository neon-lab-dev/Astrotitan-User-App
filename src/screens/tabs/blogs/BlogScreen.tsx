/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useGetBlogsQuery } from '../../../redux/features/blog/blogApi';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import { useCallback, useState } from 'react';
import FeatureCardSkeleton from '../../../components/tabs/home/home/FeatureCard/FeatureCardSkeleton';
import BlogCard from '../../../components/HomePage/BlogInsights/BlogCard';
import { SansText } from '../../../components/reusable/Text/SansText';
import { NavigationProp } from '../../../components/shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../components/reusable/AppBar/AppBar';

// Sample categories - Replace with your actual categories from API
const BLOG_CATEGORIES = [
  // New categories
  { id: 'All', label: 'All' },
  { id: 'astrology', label: 'Astrology' },
  { id: 'horoscope', label: 'Horoscope' },
  { id: 'kundli', label: 'Kundli' },
  { id: 'remedies', label: 'Remedies' },
  { id: 'planets', label: 'Planets' },
  { id: 'zodiac', label: 'Zodiac' },
  { id: 'mantras', label: 'Mantras' },

  // Existing ones
  { id: 'wealth-finance', label: 'Wealth & Finance' },
  { id: 'education', label: 'Education' },
  { id: 'marriage', label: 'Marriage' },
  { id: 'health-wellness', label: 'Health & Wellness' },
  { id: 'career-growth', label: 'Career Growth' },
  { id: 'love-relationship', label: 'Love & Relationship' },

  // Astrology Categories
  { id: 'vedic-astrology', label: 'Vedic Astrology' },
  { id: 'birth-chart-analysis', label: 'Birth Chart Analysis' },
  { id: 'kundli-matching', label: 'Kundli Matching' },
  { id: 'remedies-rituals', label: 'Remedies & Rituals' },
  { id: 'gemstone-recommendations', label: 'Gemstone Recommendations' },
  { id: 'muhurat-auspicious-timing', label: 'Muhurat & Auspicious Timing' },
  { id: 'planetary-transits', label: 'Planetary Transits' },
  { id: 'dosha-analysis', label: 'Dosha Analysis' },
  { id: 'karma-past-life', label: 'Karma & Past Life' },
  { id: 'spiritual-growth', label: 'Spiritual Growth' },
  { id: 'meditation-mindfulness', label: 'Meditation & Mindfulness' },
  { id: 'feng-shui-vastu', label: 'Feng Shui & Vastu' },
  { id: 'dream-interpretation', label: 'Dream Interpretation' },
  { id: 'tarot-reading', label: 'Tarot Reading' },
  { id: 'numerology', label: 'Numerology' },
  { id: 'palmistry', label: 'Palmistry' },
  { id: 'gemology', label: 'Gemology' },
  { id: 'children-parenting', label: 'Children & Parenting' },
  { id: 'property-real-estate', label: 'Property & Real Estate' },
  { id: 'business-entrepreneurship', label: 'Business & Entrepreneurship' },
  { id: 'travel-foreign-settlements', label: 'Travel & Foreign Settlements' },
  { id: 'legal-astrology', label: 'Legal Astrology' },
  { id: 'astro-psychology', label: 'Astro Psychology' },
];

const BlogScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data, isLoading, refetch, isFetching } = useGetBlogsQuery(
    {
      skip: 0,
      limit: 50,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );
  const blogs = data?.data?.data || [];

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    try {
      setRefreshing(true);
      await Promise.all([refetch().unwrap()]);
    } catch (error) {
      console.log('REFRESH ERROR:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppBar title="Blogs and Articles" />
        <ScrollView
          style={styles.container}
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
          contentContainerStyle={styles.scrollContent}
        >

          {/* Scrollable Category Tabs */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {BLOG_CATEGORIES.map(category => {
                const isSelected = selectedCategory === category.id;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryTab,
                      isSelected && styles.categoryTabActive,
                    ]}
                    onPress={() => handleCategorySelect(category.id)}
                    activeOpacity={0.7}
                  >
                    <SansText
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {category.label}
                    </SansText>
                    {isSelected && <View style={styles.categoryUnderline} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Blog List */}
          <View
            style={{
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
          >
            {isLoading || isFetching ? (
              <FlatList
                data={[1, 2, 3]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 10,
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
            ) : blogs?.length > 0 ? (
              blogs?.map((blog: any) => (
                <BlogCard
                  key={blog._id}
                  title={blog?.title || 'Untitled Blog'}
                  category={blog?.category}
                  blogType={blog?.blogType}
                  thumbnail={{
                    uri: blog?.thumbnail,
                  }}
                  onPress={() =>
                    navigation.navigate('ArticleScreen', { id: blog?._id })
                  }
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <SansText style={styles.emptyText}>No blogs available</SansText>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default BlogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  categoryContainer: {
    paddingVertical: 4,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 4,
    position: 'relative',
  },
  categoryTabActive: {
    // No background, just text color and underline
  },
  categoryText: {
    fontSize: 14,
    color: '#565658',
    fontFamily: 'Satoshi-Medium',
  },
  categoryTextActive: {
    color: '#D4AF37',
    fontFamily: 'Satoshi-Bold',
  },
  categoryUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2.5,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
