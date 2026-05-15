import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SansText } from "../Text/SansText";
import { SatoshiText } from "../Text/SatoshiText";

const ContentSection = ({
  title,
  titleFontSize,
  titleColor,
  descriptionColor,
  children,
  sectionStyle
}: {
  title: string;
  titleFontSize?: number;
  titleColor?:string;
  descriptionColor?:string;
  children?: React.ReactNode;
  sectionStyle?: ViewStyle;
}) => {
  return (
    <View style={sectionStyle}>
      <SatoshiText style={[styles.title, { fontSize: titleFontSize || 18, } ,{ color: titleColor || "#0D0D0D" }]}>{title}</SatoshiText>

      {children && <SansText style={[styles.subtitle ,{ color: descriptionColor || "#0D0D0D" }]}>{children}</SansText>}
    </View>
  );
};

export default ContentSection;

const styles = StyleSheet.create({
  title: {

    fontFamily: "SatoshiBold",
    letterSpacing: -0.32,
    lineHeight:26
  },

  subtitle: {
    fontSize: 18,
    marginTop: 8,
    lineHeight: 26,
  },
});
