import React, { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl } from 'react-native';
import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';
import AppHeader from '../../../components/reusable/AppHeader/AppHeader';
import AuthTitle from '../../../components/auth/AuthTitle';
import { useGetMyKundliRequestsQuery } from '../../../redux/features/kundliRequest/kundliRequestApi';
import AllKundliRequests from '../../../components/KundliPage/AllKundliRequests/AllKundliRequests';
import RaiseKundliRequest from '../../../components/KundliPage/RaiseKundliRequest/RaiseKundliRequest';
import { SansText } from '../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';
import { ICONS } from '../../../assets/svg';
import AppBar from '../../../components/reusable/AppBar/AppBar';
import Tabs from '../../../components/reusable/Tabs/Tabs';

const KundliScreen = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'new'>('new');
  const { data, isLoading, refetch } = useGetMyKundliRequestsQuery({});

  const requests = data?.data?.data || [];

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

  const IconComponent = ICONS.EmptyFile;

  const tabs = [
    {
      key: 'new',
      label: 'New Request',
      icon: <ICONS.AddIcon width={20} height={20} />,
    },
    {
      key: 'requests',
      label: 'My Requests',
      icon: <ICONS.File width={20} height={20} />,
      badge: requests.length > 0 ? requests.length : undefined,
    },
  ];

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
          <AppBar title="Kundli" />

          {/* Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={key => setActiveTab(key as 'requests' | 'new')}
          />

          {/* Content */}
          <View style={styles.contentContainer}>
            {activeTab === 'requests' ? (
              requests.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    <IconComponent width={50} height={50} />
                  </View>

                  <SatoshiText style={styles.emptyTitle}>
                    No Kundli Requests Yet
                  </SatoshiText>

                  <SansText style={styles.emptySubtext}>
                    You haven't raised any kundli requests yet. Tap "New
                    Request" to get started.
                  </SansText>
                </View>
              ) : (
                <AllKundliRequests />
              )
            ) : (
              <RaiseKundliRequest setActiveTab={setActiveTab} />
            )}
          </View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#ffffff',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  badge: {
    marginTop: 4,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    backgroundColor: '#D4AF37',
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
