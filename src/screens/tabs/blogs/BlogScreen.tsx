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
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';
import { useCallback, useState } from 'react';
import FeatureCardSkeleton from '../../../components/tabs/home/home/FeatureCard/FeatureCardSkeleton';
import BlogCard from '../../../components/HomePage/BlogInsights/BlogCard';
import { SansText } from '../../../components/reusable/Text/SansText';
import { NavigationProp } from '../../../components/shared/AppHeader/AppHeader';
import { useNavigation } from '@react-navigation/native';

// Sample categories - Replace with your actual categories from API
const BLOG_CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Astrology', label: 'Astrology' },
  { id: 'Horoscope', label: 'Horoscope' },
  { id: 'Kundli', label: 'Kundli' },
  { id: 'Remedies', label: 'Remedies' },
  { id: 'Planets', label: 'Planets' },
  { id: 'Zodiac', label: 'Zodiac' },
  { id: 'Mantras', label: 'Mantras' },
];

const BlogScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
          <AppHeader showBack={false}>
            <AuthTitle titleFontSize={17} title="Blogs and Articles" />
          </AppHeader>

          {/* Scrollable Category Tabs */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {BLOG_CATEGORIES.map((category) => {
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
            ) : blogs?.length > 0 ? (
              blogs?.map((blog: any) => (
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