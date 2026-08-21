import { Image, StyleSheet, View } from 'react-native';
import { SatoshiText } from '../../reusable/Text/SatoshiText';
import { SansText } from '../../reusable/Text/SansText';
import ReusableButton from '../../reusable/ReusableButton/ReusableButton';

const ChatHeader = ({
  consultationFor,
  profilePicture,
  name,
  handleEndSession,
  endSessionLading,
}: any) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileSection}>
        <Image src={profilePicture} style={styles.avatar} />

        <View>
          <SatoshiText style={styles.name}> {name || 'N/A'}</SatoshiText>
          <SansText style={styles.subtitle}>
            {consultationFor || 'N/A'}
          </SansText>
        </View>
      </View>

      <ReusableButton
        loading={endSessionLading}
        width={110}
        height={40}
        textSize={12}
        paddingHorizontal={0}
        title="End Session"
        onPress={() => {
          handleEndSession();
        }}
      />
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 28,
    backgroundColor: '#C37B3D',
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    color: '#222',
  },

  subtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    marginLeft: 5,
  },

  endButton: {
    backgroundColor: '#D2AF2C',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  endText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 12,
  },
});
