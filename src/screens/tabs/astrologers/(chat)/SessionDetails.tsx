import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  RefreshControl,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatDate } from '../../../../utils/validators/dateValidators';
import { SatoshiText } from '../../../../components/reusable/Text/SatoshiText';
import { SansText } from '../../../../components/reusable/Text/SansText';
import { useGetSingleConsultationBookingsQuery } from '../../../../redux/features/consultation/consultationApi';
import { useDispatch } from 'react-redux';
import { setSelectedConsultation } from '../../../../redux/features/consultation/consultationChatSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import AnimatedScreen from '../../../../components/layout/AnimatedScreen';
import ScreenWrapper from '../../../../components/layout/ScreenWrapper';
import AppBar from '../../../../components/reusable/AppBar/AppBar';
import NoteIcon from '@/assets/icons/navigation/note.svg';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#D4AF37';
    case 'scheduled':
      return '#2196F3';
    case 'ended':
      return '#4CAF50';
    default:
      return '#8E8E93';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'scheduled':
      return 'Scheduled';
    case 'ended':
      return 'Completed';
    default:
      return status || 'Unknown';
  }
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SessionDetails = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const id = route.params?.id;

  const { data, refetch, isLoading, isFetching, isError } =
    useGetSingleConsultationBookingsQuery(id);
  const item = data?.data || {};

  // Extract data
  const astrologer = item?.astrologer || {};
  const meeting = item?.meeting || {};
  const slotData = item?.slotId || {};
  const bookedSlot = item?.bookedSlot || {};

  const isCall = item?.method === 'call';
  const isScheduled = item?.status === 'scheduled';
  const isChat = item?.method === 'chat';

  // Get meeting date from slotId, and time from bookedSlotId
  const meetingDate = slotData?.date;
  const startTime = bookedSlot?.startTime || '';
  const endTime = bookedSlot?.endTime || '';

  // Format meeting date
  const formattedMeetingDate = meetingDate
    ? formatDate(meetingDate)
    : 'Not scheduled';

  const handleJoinSession = () => {
    if (meeting?.link) {
      Linking.openURL(meeting.link);
    }
  };

  const handleChatNow = (booking: any) => {
      const participant = booking.astrologer;
      const currentParticipantId = booking.user;
  
      dispatch(
        setSelectedConsultation({
          consultationId: booking._id,
          currentParticipantId,
          participant: {
            _id: participant?.accountId,
            name: participant?.displayName,
            firstName: participant?.firstName,
            lastName: participant?.lastName,
            profilePicture: participant?.profilePicture || "",
            accountId:participant?.accountId,
            role: "astrologer",
          },
        })
      );
  
      navigation.navigate("AstrologerChatScreen", {
        id: booking._id,
        profilePicture: participant?.profilePicture,
        name: participant?.displayName,
        consultationFor: booking.consultationFor,
      });
    };

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

  if (isLoading || isFetching) {
    return (
      <View style={styles.emptyContainer}>
        <NoteIcon height={124} width={124} />
        <SansText style={styles.emptyText}>Please wait...</SansText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.emptyContainer}>
        <NoteIcon height={124} width={124} />
        <SansText style={styles.emptyText}>No sessions yet</SansText>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <View style={styles.container}>
          {/* Header */}
          <AppBar title="Session Details" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#816B22"
                colors={['#816B22']}
                progressBackgroundColor="#FBF7EB"
              />
            }
          >
            {/* Astrologer Profile Card */}
            <View style={styles.profileCard}>
              <Image
                source={{ uri: astrologer?.profilePicture }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <SatoshiText style={styles.astrologerName}>
                  {astrologer?.displayName || 'Astrologer'}
                </SatoshiText>
                <SansText style={styles.astrologerSpecialty}>
                  {astrologer?.experience} Years Experience
                </SansText>
              </View>
            </View>

            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <View
                style={[styles.statusBadge, { backgroundColor: '#ffffff' }]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item?.status) },
                  ]}
                />
                <SansText
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item?.status) },
                  ]}
                >
                  {getStatusLabel(item?.status)}
                </SansText>
              </View>
            </View>

            {/* Session Details */}
            <View style={styles.section}>
              <SatoshiText style={styles.sectionTitle}>
                Session Details
              </SatoshiText>

              <View style={styles.detailItem}>
                <SansText style={styles.detailLabel}>Purpose</SansText>
                <SansText style={styles.detailValue}>
                  {item?.consultationFor || 'N/A'}
                </SansText>
              </View>

              <View style={styles.detailItem}>
                <SansText style={styles.detailLabel}>Type</SansText>
                <SansText style={styles.detailValue}>
                  {item?.method === 'call' ? 'Call' : 'Chat'}
                </SansText>
              </View>

              {isCall && (
                <>
                  <View style={styles.detailItem}>
                    <SansText style={styles.detailLabel}>Date</SansText>
                    <SansText style={styles.detailValue}>
                      {formattedMeetingDate}
                    </SansText>
                  </View>

                  {startTime && endTime && (
                    <View style={styles.detailItem}>
                      <SansText style={styles.detailLabel}>Time</SansText>
                      <SansText style={styles.detailValue}>
                        {startTime} - {endTime}
                      </SansText>
                    </View>
                  )}

                  {meeting?.link && (
                    <View style={styles.detailItem}>
                      <SansText style={styles.detailLabel}>
                        Meeting Link
                      </SansText>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(meeting.link)}
                      >
                        <SansText style={styles.linkText}>
                          {meeting.link}
                        </SansText>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              {item?.requestMessage && (
                <View style={styles.requestMessageContainer}>
                  <SansText style={styles.requestMessageLabel}>
                    Request Message
                  </SansText>
                  <SansText style={styles.requestMessage}>
                    {item.requestMessage}
                  </SansText>
                </View>
              )}
            </View>

            {/* Recommendations */}
            {item?.recommendations && (
              <View style={styles.section}>
                <SatoshiText style={styles.sectionTitle}>
                  Recommendations
                </SatoshiText>
                <View style={styles.recommendationsContainer}>
                  <SansText style={styles.recommendationsText}>
                    {item.recommendations}
                  </SansText>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {isCall && isScheduled && meeting?.link && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handleJoinSession}
                >
                  <SatoshiText style={styles.joinButtonText}>
                    Join Session
                  </SatoshiText>
                </TouchableOpacity>
              )}

              {isChat && (
                <TouchableOpacity
                  style={styles.chatButton}
                  onPress={() => handleChatNow(item)}
                >
                  <SatoshiText style={styles.chatButtonText}>
                    Chat Now
                  </SatoshiText>
                </TouchableOpacity>
              )}

              {isCall && !isScheduled && (
                <View style={styles.notScheduledContainer}>
                  <SansText style={styles.notScheduledText}>
                    This session is not scheduled yet
                  </SansText>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  astrologerName: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 2,
  },
  astrologerSpecialty: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Satoshi-Medium',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Satoshi-Bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 13,
    color: '#1a1a2e',
    fontFamily: 'Satoshi-Medium',
  },
  linkText: {
    fontSize: 12,
    color: '#D4AF37',
    textDecorationLine: 'underline',
  },
  requestMessageContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  requestMessageLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  requestMessage: {
    fontSize: 13,
    color: '#1a1a2e',
    lineHeight: 18,
  },
  recommendationsContainer: {
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  recommendationsText: {
    fontSize: 13,
    color: '#1a1a2e',
    lineHeight: 18,
  },
  actionContainer: {
    marginTop: 8,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  chatButtonText: {
    fontSize: 16,
    fontFamily: 'Satoshi-Bold',
    color: '#FFFFFF',
  },
  notScheduledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  notScheduledText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Satoshi-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default SessionDetails;
