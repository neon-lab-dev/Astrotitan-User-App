/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import AnimatedScreen from '../../layout/AnimatedScreen';
import ScreenWrapper from '../../layout/ScreenWrapper';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import SkeletonLoader from '../../reusable/SkeletonLoader/SkeletonLoade';
import RemedyCardSkeleton from '../../tabs/ecommerce/ecommerce/RemedyCard/RemedyCardSkeleton';

const ProductDetailsPageSkeleton = () => {
  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* IMAGE */}

            <View style={styles.skeletonImageContainer}>
              <SkeletonLoader
                width={Dimensions.get('window').width - 32}
                height={380}
                borderRadius={12}
                array={[1]}
              />
            </View>

            {/* INDICATORS */}

            <View style={styles.indicatorContainer}>
              {[1, 2, 3].map(item => (
                <SkeletonLoader
                  key={item}
                  width={10}
                  height={10}
                  borderRadius={999}
                  array={[1]}
                />
              ))}
            </View>

            {/* CONTENT */}

            <View style={styles.contentContainer}>
              {/* TITLE */}

              <SkeletonLoader
                width="72%"
                height={28}
                borderRadius={8}
                array={[1]}
              />

              {/* DESCRIPTION */}

              <View
                style={{
                  marginTop: 12,
                  gap: 10,
                }}
              >
                <SkeletonLoader
                  width="100%"
                  height={14}
                  borderRadius={6}
                  array={[1]}
                />

                <SkeletonLoader
                  width="92%"
                  height={14}
                  borderRadius={6}
                  array={[1]}
                />

                <SkeletonLoader
                  width="74%"
                  height={14}
                  borderRadius={6}
                  array={[1]}
                />
              </View>

              {/* PRICE */}

              <View style={styles.priceRow}>
                <View
                  style={{
                    gap: 10,
                  }}
                >
                  <SkeletonLoader
                    width={120}
                    height={28}
                    borderRadius={8}
                    array={[1]}
                  />

                  <SkeletonLoader
                    width={160}
                    height={14}
                    borderRadius={6}
                    array={[1]}
                  />
                </View>

                <SkeletonLoader
                  width={70}
                  height={40}
                  borderRadius={12}
                  array={[1]}
                />
              </View>

              {/* BIG DESCRIPTION */}

              <View
                style={{
                  marginTop: 18,
                  gap: 10,
                }}
              >
                {[1, 2, 3, 4].map(item => (
                  <SkeletonLoader
                    key={item}
                    width={item === 4 ? '68%' : '100%'}
                    height={16}
                    borderRadius={6}
                    array={[1]}
                  />
                ))}
              </View>

              {/* DIVIDER */}

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* WHO SECTION */}

              <SkeletonLoader
                width="58%"
                height={24}
                borderRadius={8}
                array={[1]}
              />

              <View
                style={{
                  marginTop: 18,
                  gap: 14,
                }}
              >
                {[1, 2, 3].map(item => (
                  <View
                    key={item}
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                    }}
                  >
                    <SkeletonLoader
                      width={8}
                      height={8}
                      borderRadius={999}
                      array={[1]}
                    />

                    <SkeletonLoader
                      width="88%"
                      height={14}
                      borderRadius={6}
                      array={[1]}
                    />
                  </View>
                ))}
              </View>

              {/* DIVIDER */}

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* HOW SECTION */}

              <SkeletonLoader
                width="42%"
                height={24}
                borderRadius={8}
                array={[1]}
              />

              <View
                style={{
                  marginTop: 18,
                  gap: 14,
                }}
              >
                {[1, 2, 3].map(item => (
                  <View
                    key={item}
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                    }}
                  >
                    <SkeletonLoader
                      width={8}
                      height={8}
                      borderRadius={999}
                      array={[1]}
                    />

                    <SkeletonLoader
                      width="82%"
                      height={14}
                      borderRadius={6}
                      array={[1]}
                    />
                  </View>
                ))}
              </View>

              {/* DIVIDER */}

              <View
                style={{
                  backgroundColor: '#E6D18B',
                  height: 1,
                  marginVertical: 24,
                }}
              />

              {/* FEATURES */}

              <View style={styles.featureRow}>
                {[1, 2, 3].map(item => (
                  <View key={item} style={styles.featureCard}>
                    <SkeletonLoader
                      width={36}
                      height={36}
                      borderRadius={999}
                      array={[1]}
                    />

                    <View
                      style={{
                        marginTop: 12,
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <SkeletonLoader
                        width={70}
                        height={12}
                        borderRadius={6}
                        array={[1]}
                      />

                      <SkeletonLoader
                        width={54}
                        height={12}
                        borderRadius={6}
                        array={[1]}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* RELATED */}

              <View style={styles.reviewSection}>
                <SkeletonLoader
                  width="42%"
                  height={26}
                  borderRadius={8}
                  array={[1]}
                />

                <View
                  style={{
                    marginTop: 12,
                    gap: 8,
                  }}
                >
                  <SkeletonLoader
                    width="100%"
                    height={14}
                    borderRadius={6}
                    array={[1]}
                  />

                  <SkeletonLoader
                    width="72%"
                    height={14}
                    borderRadius={6}
                    array={[1]}
                  />
                </View>

                <View
                  style={{
                    marginTop: 24,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    rowGap: 16,
                  }}
                >
                  {[1, 2].map(item => (
                    <RemedyCardSkeleton key={item} />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* BUTTONS */}
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default ProductDetailsPageSkeleton;

const styles = StyleSheet.create({
  indicatorContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E6D18B',
  },

  activeIndicator: {
    width: 12,
    height: 12,
    backgroundColor: '#D4AF37',
  },
  skeletonImageContainer: {
    width: Dimensions.get('window').width - 32,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#FBF7EB',
    borderRadius: 12,
    marginHorizontal: 'auto',
    overflow: 'hidden',
  },
  reviewSection: {
    marginTop: 34,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 20,
    paddingVertical: 22,
    backgroundColor: '#FBF7EB',
  },

  featureCard: {
    flex: 1,
    alignItems: 'center',
  },

  priceRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
});
