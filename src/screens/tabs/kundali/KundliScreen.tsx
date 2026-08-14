import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';
import { useGetMyKundliRequestsQuery } from '../../../redux/features/kundliRequest/kundliRequestApi';
import AllKundliRequests from '../../../components/KundliPage/AllKundliRequests/AllKundliRequests';
import RaiseKundliRequest from '../../../components/KundliPage/RaiseKundliRequest/RaiseKundliRequest';
import { SansText } from '../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';

const KundliScreen = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'new'>('requests');
  const { data, isLoading } = useGetMyKundliRequestsQuery({});

  const requests = data?.data?.data || [];

  if (isLoading) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>
          <AppHeader showBack={false}>
            <AuthTitle title="Kundli" />
          </AppHeader>
          <View style={styles.loaderContainer}>
            <SansText style={styles.loadingText}>Loading...</SansText>
          </View>
        </ScreenWrapper>
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader showBack={false}>
          <AuthTitle title="Kundli" />
        </AppHeader>

        {/* ✅ Full Width Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
            onPress={() => setActiveTab('requests')}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              <SatoshiText
                style={[
                  styles.tabText,
                  activeTab === 'requests' && styles.tabTextActive,
                ]}
              >
                My Requests
              </SatoshiText>
              {requests.length > 0 && (
                <View style={styles.badge}>
                  <SansText style={styles.badgeText}>
                    {requests.length}
                  </SansText>
                </View>
              )}
            </View>
            {activeTab === 'requests' && <View style={styles.underline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.tabActive]}
            onPress={() => setActiveTab('new')}
            activeOpacity={0.8}
          >
            <View style={styles.tabContent}>
              <SatoshiText
                style={[
                  styles.tabText,
                  activeTab === 'new' && styles.tabTextActive,
                ]}
              >
                + New Request
              </SatoshiText>
            </View>
            {activeTab === 'new' && <View style={styles.underline} />}
          </TouchableOpacity>
        </View>

        {/* ✅ Content */}
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {activeTab === 'requests' ? (
            requests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIcon}>
                  <SansText style={styles.emptyIconText}>🔮</SansText>
                </View>
                <SatoshiText style={styles.emptyTitle}>
                  No Kundli Requests Yet
                </SatoshiText>
                <SansText style={styles.emptySubtext}>
                  You haven't raised any kundli requests yet. Tap "New Request"
                  to get started.
                </SansText>
              </View>
            ) : (
              <AllKundliRequests />
            )
          ) : (
            <RaiseKundliRequest />
          )}
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    // No background color, just text color and underline
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 15,
    color: '#8E8E93',
    fontFamily: 'Satoshi-Medium',
  },
  tabTextActive: {
    color: '#D4AF37',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  badge: {
    marginTop: 4,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default KundliScreen;
