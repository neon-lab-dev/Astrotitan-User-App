/* eslint-disable react-native/no-inline-styles */

import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  StatusBar,
  Image,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SansText } from '../../../components/reusable/Text/SansText';
import { SatoshiText } from '../../../components/reusable/Text/SatoshiText';

import {
  useGetSingleKundliRequestQuery,
} from '../../../redux/features/kundliRequest/kundliRequestApi';

import ReusableButton from '../../../components/reusable/ReusableButton/ReusableButton';

import {
  getKundliTypeLabel,
} from './../../../components/KundliPage/AllKundliRequests/KundliRequestCard';

import AnimatedScreen from '../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../components/layout/ScreenWrapper';


const STATUS_COLORS: any = {
  completed: {
    bg: '#E8F5E9',
    text: '#2E7D32',
    dot: '#4CAF50',
  },

  accepted: {
    bg: '#E3F2FD',
    text: '#1565C0',
    dot: '#2196F3',
  },

  pending: {
    bg: '#FFF8E1',
    text: '#827717',
    dot: '#FFC107',
  },

  cancelled: {
    bg: '#FFEBEE',
    text: '#C62828',
    dot: '#F44336',
  },
};


const KundliRequestDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const insets = useSafeAreaInsets();

  const id = route.params?.id;

  const [refreshing, setRefreshing] = useState(false);


  const {
    data,
    refetch,
    isLoading,
  } = useGetSingleKundliRequestQuery(id);


  const request = data?.data || data;


  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await refetch();

    setRefreshing(false);
  }, [refetch]);


  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (isLoading) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>

          <View style={styles.loaderContainer}>
            <SansText style={styles.loadingText}>
              Loading...
            </SansText>
          </View>

        </ScreenWrapper>
      </AnimatedScreen>
    );
  }


  /*
   * ============================================================
   * REQUEST NOT FOUND
   * ============================================================
   */

  if (!request) {
    return (
      <AnimatedScreen>
        <ScreenWrapper>

          <View style={styles.center}>
            <SansText>
              Request not found.
            </SansText>
          </View>

        </ScreenWrapper>
      </AnimatedScreen>
    );
  }


  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const statusStyle =
    STATUS_COLORS[request?.status] ||
    STATUS_COLORS?.pending;


  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';


  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <AnimatedScreen>

      <ScreenWrapper>

        <View style={styles.mainContainer}>

          {/* =====================================================
              STATUS BAR
          ===================================================== */}

          <StatusBar
            barStyle="light-content"
            backgroundColor="#715700"
            translucent
          />


          {/* =====================================================
              HEADER
          ===================================================== */}

          <View
            style={[
              styles.header,
              {
                paddingTop: insets.top,
              },
            ]}
          >

            {/* NAVIGATION BAR */}

            <View style={styles.navBar}>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >

                <SansText style={styles.backIcon}>
                  ←
                </SansText>

                <SansText style={styles.backLabel}>
                  Back
                </SansText>

              </TouchableOpacity>


              {/* STATUS PILL */}

              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: statusStyle.bg,
                  },
                ]}
              >

                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: statusStyle.dot,
                    },
                  ]}
                />

                <SansText
                  style={[
                    styles.statusText,
                    {
                      color: statusStyle.text,
                    },
                  ]}
                >
                  {request.status?.toUpperCase()}
                </SansText>

              </View>

            </View>


            {/* HEADER TITLE */}

            <View style={styles.headerTitleArea}>

              <SatoshiText style={styles.headerId}>
                Request #{request._id?.slice(-8).toUpperCase()}
              </SatoshiText>


              <SansText style={styles.headerSub}>
                {request.requestType === 'generateKundli'
                  ? 'Detailed Kundli Generation'
                  : 'Expert Kundli Analysis'}
              </SansText>

            </View>

          </View>


          {/* =====================================================
              CONTENT
          ===================================================== */}

          <ScrollView
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

            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: Math.max(
                  insets.bottom,
                  40,
                ),
              },
            ]}
          >


            {/* =================================================
                SUMMARY METRICS
            ================================================= */}

            <View style={styles.metaRow}>

              <MetaItem
                label="Requested On"
                value={formatDate(request.createdAt)}
              />

              <MetaItem
                label="Kundli Type"
                value={getKundliTypeLabel(
                  request.kundliType,
                )}
              />

            </View>


            <View style={styles.lineDivider} />


            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}

            <SatoshiText style={styles.sectionHeading}>
              Personal Details
            </SatoshiText>


            <View style={styles.grid}>

              <GridItem
                label="Full Name"
                value={request.userName}
              />

              <GridItem
                label="Gender"
                value={request.userGender}
              />

              <GridItem
                label="Date of Birth"
                value={formatDate(
                  request.dateOfBirth,
                )}
              />

              <GridItem
                label="Time of Birth"
                value={request.timeOfBirth}
              />

              <GridItem
                label="Birth Place"
                value={request.placeOfBirth}
                span={2}
              />

            </View>


            <View style={styles.lineDivider} />


            {/* =================================================
                CONTACT DETAILS
            ================================================= */}

            <SatoshiText style={styles.sectionHeading}>
              Contact Details
            </SatoshiText>


            <View style={styles.grid}>

              <GridItem
                label="Phone Number"
                value={request.userPhoneNumber}
              />

            </View>


            {/* =================================================
                NOTES
            ================================================= */}

            {request.userNotes && (

              <View style={styles.notesContainer}>

                <SatoshiText style={styles.notesLabel}>
                  Concern
                </SatoshiText>

                <SansText style={styles.notesText}>
                  {request.userNotes}
                </SansText>

              </View>

            )}


            {/* =================================================
                ATTACHMENTS
            ================================================= */}

            {request.existingKundliFiles?.length > 0 && (

              <View style={styles.attachmentSection}>

                <SatoshiText style={styles.sectionHeading}>
                  Reference Documents
                </SatoshiText>


                {request.existingKundliFiles.map(
                  (url: string, i: number) => (

                    <TouchableOpacity
                      key={i}
                      style={styles.fileLink}
                      onPress={() =>
                        Linking.openURL(url)
                      }
                    >

                      <SansText
                        style={styles.fileLinkText}
                      >
                        View Document {i + 1} ↗
                      </SansText>

                    </TouchableOpacity>

                  ),
                )}

              </View>

            )}


            {/* =================================================
                ASSIGNED EXPERT
            ================================================= */}

            {request?.astrologerId && (

              <TouchableOpacity
                style={styles.expertSection}
                onPress={() =>
                  navigation.navigate(
                    'AstrologerProfile',
                    {
                      id: request?.astrologerId?._id,
                    },
                  )
                }
                activeOpacity={0.6}
              >

                <View style={styles.expertAvatar}>

                  {request?.astrologerId
                    ?.profilePicture ? (

                    <Image
                      source={{
                        uri:
                          request
                            ?.astrologerId
                            ?.profilePicture,
                      }}
                      style={
                        styles.expertAvatarImage
                      }
                    />

                  ) : (

                    <SansText
                      style={styles.avatarLetter}
                    >
                      {request
                        ?.astrologerId
                        ?.displayName
                        ?.charAt(0)
                        ?.toUpperCase() || 'A'}
                    </SansText>

                  )}

                </View>


                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <SansText
                    style={styles.expertLabel}
                  >
                    Consulting Specialist
                  </SansText>


                  <SatoshiText
                    style={styles.expertName}
                  >
                    {
                      request
                        ?.astrologerId
                        ?.displayName
                    }
                  </SatoshiText>

                </View>


                <SansText style={styles.arrow}>
                  ❯
                </SansText>

              </TouchableOpacity>

            )}


            {/* =================================================
                ACTION BUTTON
            ================================================= */}

            {request.status === 'completed' &&
              request.reportUrl && (

                <View
                  style={{
                    marginTop: 20,
                  }}
                >

                  <ReusableButton
                    title=" Download Completed Report"
                    variant="solid"
                    onPress={() =>
                      Linking.openURL(
                        request.reportUrl!,
                      )
                    }
                  />

                </View>

              )}


            {/* Bottom breathing room */}

            <View
              style={{
                height: Math.max(
                  insets.bottom,
                  40,
                ),
              }}
            />

          </ScrollView>

        </View>

      </ScreenWrapper>

    </AnimatedScreen>
  );
};


/*
 * ================================================================
 * META ITEM
 * ================================================================
 */

const MetaItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (

  <View>

    <SansText style={styles.metaLabel}>
      {label}
    </SansText>

    <SatoshiText style={styles.metaValue}>
      {value}
    </SatoshiText>

  </View>

);


/*
 * ================================================================
 * GRID ITEM
 * ================================================================
 */

const GridItem = ({
  label,
  value,
  span = 1,
}: {
  label: string;
  value?: string;
  span?: number;
}) => (

  <View
    style={[
      styles.gridItem,
      {
        width:
          span === 2
            ? '100%'
            : '48%',
      },
    ]}
  >

    <SansText style={styles.gridLabel}>
      {label}
    </SansText>


    <SatoshiText
      style={[
        styles.gridValue,
        label === 'Gender'
          ? {
              textTransform:
                'capitalize',
            }
          : {},
      ]}
    >
      {value || '—'}
    </SatoshiText>

  </View>

);


/*
 * ================================================================
 * STYLES
 * ================================================================
 */

const styles = StyleSheet.create({

  /*
   * MAIN CONTAINER
   */

  mainContainer: {
    flex: 1,
  },


  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  /*
   * HEADER
   */

  header: {
    backgroundColor: '#715700',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6D18B',
  },


  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },


  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -5,
  },


  backIcon: {
    fontSize: 22,
    color: '#ffff',
    marginRight: 5,
    marginBottom: 10,
  },


  backLabel: {
    fontSize: 16,
    color: '#ffff',
  },


  headerTitleArea: {
    marginTop: 15,
  },


  headerId: {
    fontSize: 18,
    color: '#ffff',
    fontWeight: '800',
  },


  headerSub: {
    fontSize: 14,
    color: '#c3c3c3',
    marginTop: 4,
  },


  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },


  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },


  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },


  /*
   * CONTENT
   */

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },


  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  metaLabel: {
    fontSize: 11,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },


  metaValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },


  lineDivider: {
    height: 1,
    backgroundColor: '#cbcbcb',
    marginVertical: 25,
  },


  sectionHeading: {
    fontSize: 12,
    color: '#D4AF37',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 18,
  },


  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },


  gridItem: {
    marginBottom: 18,
  },


  gridLabel: {
    fontSize: 12,
    color: '#6b6b6b',
    marginBottom: 2,
  },


  gridValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },


  /*
   * NOTES
   */

  notesContainer: {
    backgroundColor: '#FBFBFB',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },


  notesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8E8E93',
    marginBottom: 8,
    textTransform: 'uppercase',
  },


  notesText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },


  /*
   * ATTACHMENTS
   */

  attachmentSection: {
    marginTop: 10,
  },


  fileLink: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },


  fileLinkText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
  },


  /*
   * EXPERT
   */

  expertSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 20,
  },


  expertAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      'rgba(212, 175, 55, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },


  expertAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },


  avatarLetter: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    color: '#D4AF37',
  },


  expertLabel: {
    fontSize: 11,
    color: '#8E8E93',
  },


  expertName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },


  arrow: {
    color: '#CCC',
    fontSize: 12,
  },


  /*
   * PRIMARY BUTTON
   */

  primaryButton: {
    backgroundColor: '#1A1A1A',
    marginTop: 30,
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },


  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },


  /*
   * LOADING
   */

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },

});


export default KundliRequestDetails;