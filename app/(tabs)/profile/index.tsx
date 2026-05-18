// Clean, reusable React Native Expo components based on your UI
// Assumes you already have SatoshiText and SansText components

import ArrowRoundedIcon from '@/assets/icons/actions/arrow-down-round.svg';
import AuthTitle from "@/components/auth/AuthTitle";
import AnimatedScreen from '@/components/layout/AnimatedScreen';
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import DeleteAccountSection from '@/components/reusable/BottomSheet/DeleteAccountSection';
import LogoutSection from '@/components/reusable/BottomSheet/LogoutSection';
import { IconName, ICONS } from '@/components/reusable/Icons';
import ReusableButton from '@/components/reusable/ReusableButton/ReusableButton';
import SectionTitle from "@/components/reusable/SectionTitle/SectionTitle";
import { SansText } from "@/components/reusable/Text/SansText";
import { SatoshiText } from '@/components/reusable/Text/SatoshiText';
import { useLazyGetMeQuery } from '@/redux/features/auth/authApi';
import { clearAuth, updateUser } from '@/redux/features/auth/authSlice';
import BottomSheetService from '@/redux/features/ui/GlobalSheet/BottomSheetService';
import { RootState } from "@/redux/store";
import { Image } from "expo-image";
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { RefreshControl } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch()
  const [getMe] =
    useLazyGetMeQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const [refreshing, setRefreshing] = useState(false);
  const resetAuth = async () => {
    await SecureStore.deleteItemAsync("ACCESS_TOKEN");
    await SecureStore.deleteItemAsync("USER");
    await SecureStore.deleteItemAsync("IS_PROFILE_COMPLETE");
    dispatch(clearAuth());
    router.replace("/(auth)/login");


  };

  const fetchLatestUser =
    async () => {
      try {
        const meRes =
          await getMe({}).unwrap();

        const finalUser =
          meRes.data;

        /* SAVE USER */

        await SecureStore.setItemAsync(
          "USER",
          JSON.stringify(finalUser),
        );

        /* UPDATE REDUX */

        dispatch(
          updateUser(finalUser)
        );

        console.log(
          "UPDATED USER:",
          finalUser,
        );
      } catch (error) {
        console.log(
          "GET ME ERROR:",
          error,
        );
      }
    };

  const onPressLogout = () => {
    BottomSheetService.open(
      <LogoutSection onCancel={BottomSheetService.close} onLogout={() => {
        resetAuth()
        BottomSheetService.close()
      }} />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };
  const onPressDelete = () => {
    BottomSheetService.open(
      <DeleteAccountSection onCancel={BottomSheetService.close} onLogout={() => { }} />,
      {
        height: 400,
        hasGradient: true,
      }
    );
  };

  const onRefresh =
    useCallback(async () => {
      if (refreshing) return;

      try {
        setRefreshing(true);

        await Promise.all([
          fetchLatestUser(),
        ]);
      } catch (error) {
        console.log(
          "REFRESH ERROR:",
          error,
        );
      } finally {
        setRefreshing(false);
      }
    }, [refreshing]);


  useFocusEffect(
    React.useCallback(() => {
      fetchLatestUser();
    }, [])
  );

  return (
    <AnimatedScreen>
      <ScreenWrapper>

        <AppHeader showBack={false} >
          <AuthTitle title="Profile">
            <SansText style={{ fontSize: 18 }}>
              Manage your personal details & preferences.
            </SansText>
          </AuthTitle>
        </AppHeader>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#816B22"
            colors={["#816B22"]}
            progressBackgroundColor="#FBF7EB"
          />
        } style={{ flex: 1, paddingBottom: 0 }}>
          <View style={{ paddingHorizontal: 16, gap: 24, paddingVertical: 24 }}>
            <View style={styles.profileCard}>
              {/* PROFILE IMAGE */}
              <Image
                source={
                  user?.profile
                    ?.profilePicture
                    ? {
                      uri: user.profile
                        .profilePicture,
                    }
                    : require("@/assets/images/dummy/experts/expert1.png")
                }
                style={styles.avatar}
                contentFit="cover"
              />

              {/* PROFILE INFO */}
              <View style={styles.profileLeft}>
                <View
                  style={{
                    gap: 8,
                    width: "70%",
                  }}
                >
                  <SatoshiText
                    style={styles.name}
                    numberOfLines={1}
                  >
                    {user?.profile
                      ?.fullName ||
                      "User"}
                  </SatoshiText>

                  <SansText
                    style={styles.desc}
                    numberOfLines={2}
                  >
                    {/* {user?.account
                      ?.email ||
                      "No email found"} */}
                    content info, user details
                  </SansText>
                </View>

                {/* ARROW */}
                <TouchableOpacity
                  onPress={() => { router.push("/(tabs)/profile/personal-information") }}
                  style={{
                    backgroundColor:
                      "#F5F5F5",

                    padding: 12,

                    borderRadius: 40,

                    transform: [
                      {
                        rotate: "-90deg",
                      },
                    ],
                  }}
                >
                  <ArrowRoundedIcon color="#0D0D0D" />
                </TouchableOpacity>
              </View>
            </View>

            {/* PERSONAL */}
            <View> <SectionTitle titleFontSize={18} title="Personal"></SectionTitle>
              <View style={styles.card}>
                <ProfileItem title="Birth Details" icon="CalenderIcon" onPress={() => { router.push("/(tabs)/profile/(birth-details)/birth-details") }} />
                <ProfileItem title="Orders" icon="PackageIcon" onPress={() => { router.push("/(tabs)/remedies/(orders)/orders") }} />
                <ProfileItem title="Session History" icon="NoteIcon" onPress={() => { router.push("/(tabs)/astrologers/(chat)/chat-history") }} />
                <ProfileItem title="Saved Addresses" icon="LocationIcon" onPress={() => { router.push("/(tabs)/profile/address/address") }} />
              </View></View>

            <View><SectionTitle titleFontSize={18} title="General"></SectionTitle>
              <View style={styles.card}>
                <ProfileItem title="Subscription Status" icon="TransactionIcon" onPress={() => { router.push("/(tabs)/profile/subscription/subscription") }} />
                <ProfileItem title="Raise a query" icon="HelpIcon" onPress={() => { router.push("/(tabs)/profile/(query)/queries") }} />
                <ProfileItem title="Privacy" icon="SecurityIcon" onPress={() => { router.push("/privacy-policy") }} />
                <ProfileItem title="Logout" icon="LogoutIcon" onPress={onPressLogout} />
              </View></View>
            {/* GENERAL */}ba
            <ReusableButton onPress={onPressDelete} variant='error' title='Delete'>

            </ReusableButton>

          </View>


          {/* DELETE */}

        </ScrollView></ScreenWrapper></AnimatedScreen>
  );
};
export default Profile;

const ProfileItem = ({ title, icon, onPress }: { title: string; icon: IconName, onPress?: () => void; }) => {
  const IconComponent = ICONS[icon];

  return (
    <TouchableOpacity onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <IconComponent width={24} height={24} />
        <SansText style={styles.rowText}>{title}</SansText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8DFC9",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },

  profileCard: {
    backgroundColor: "#0D0D0D",
    borderRadius: 24,
    padding: 24, gap: 24,
  },

  profileLeft: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderColor: "#FBF7EB",
    borderWidth: 1
  },

  name: {
    color: "#F5F5F5",
    fontSize: 18,
    fontFamily: "SatoshiBold",
    lineHeight: 26,
  },

  desc: {
    color: "#F5F5F5",
    fontSize: 18,
    lineHeight: 26,
  },


  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    marginTop: 12
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    fontSize: 18,
    color: "#0D0D0D"
  },

  deleteBtn: {
    backgroundColor: "#C0392B",
    padding: 14,
    borderRadius: 24,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});