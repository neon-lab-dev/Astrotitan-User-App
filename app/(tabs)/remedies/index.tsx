import CartIcon from "@/assets/icons/navigation/cart.svg";
import AnimatedScreen from "@/components/layout/AnimatedScreen";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import AppHeader from "@/components/reusable/AppHeader/AppHeader";
import ContentSection from "@/components/reusable/ContentSectoin/ContentSection";
import IconButton from "@/components/reusable/IconButton/IconButton";
import { ICONS } from "@/components/reusable/Icons";
import SectionTitle from "@/components/reusable/SectionTitle/SectionTitle";
import { SansText } from "@/components/reusable/Text/SansText";
import ECommerceFeatureCard from "@/components/tabs/ecommerce/ecommerce/ECommerceFeatureCard/ECommerceFeatureCard";
import IntentCard from "@/components/tabs/ecommerce/ecommerce/IntentCard/IntentCard";
import ProductCard from "@/components/tabs/ecommerce/ecommerce/ProductCard/ProductCard";
import { PRODUCTS } from "@/data/dummy/products";
import { INTENTS } from "@/data/intents";
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

const Remedies = () => {
  const { width } = Dimensions.get("window");

  const [activeTab, setActiveTab] = useState("store");
  const [containerWidth, setContainerWidth] = useState(0);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  const tabs = [
    { key: "store", label: "Store", icon: "StoreIcon" },
    { key: "pooja", label: "Pooja", icon: "firePitInactive" },
  ];

  const TAB_WIDTH = containerWidth / tabs.length;

  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleTabPress = (index: number, key: string) => {
    // fade animation
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(key);

    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "store":
        return <StoreContent />;
      case "pooja":
        return <PoojaContent />;
      default:
        return null;
    }
  };

  return (<AnimatedScreen>
    <ScreenWrapper>
      <AppHeader showBack={false}>
        <SectionTitle title="Remedies">
          <IconButton
            Icon={CartIcon}
            iconColor="#0D0D0D"
            update={true}
            updateCount={cartCount}
            onPress={() => {
              router.push("/(tabs)/remedies/(ecommerce)/cart");
            }}
          />
        </SectionTitle>

        {/* Tabs */}
        <View
          style={styles.tabsContainer}
          onLayout={(e) =>
            setContainerWidth(e.nativeEvent.layout.width)
          }
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;
            const Icon = ICONS[tab.icon];

            return (
              <Pressable
                key={tab.key}
                style={styles.tabItem}
                onPress={() => handleTabPress(index, tab.key)}
              >
                <Icon width={22} height={22} />

                <SansText
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </SansText>
              </Pressable>
            );
          })}

          {/* Sliding Indicator */}
          <Animated.View
            style={[
              styles.animatedIndicator,
              {
                width: TAB_WIDTH,
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
      </AppHeader>

      {/* Content */}
      <ScrollView>
        <Animated.View style={{ flex: 1, opacity }}>
          {renderContent()}
        </Animated.View>
      </ScrollView>

    </ScreenWrapper></AnimatedScreen>
  );
};

export default Remedies;

const mapProduct = (item: any) => ({
  id: item._id,
  title: item.name,
  description: item.description,
  price: `₹ ${item.discountedPrice}`,
  image: item.imageUrls?.[0] || "",
});

const StoreContent = () => {
  return (
    <View>
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <ECommerceFeatureCard image={require("@/assets/images/consmos1.png")} title="Find What Actually Works for You" description="Get remedy suggestions based on your birth chart and current planetary phase." ctaText="Start Analysis" />
      </View>
      <View style={{ gap: 24, marginTop: 24 }}>

        <View >
          <ContentSection title={"Explore remedies by intents"} titleFontSize={24} sectionStyle={{ paddingHorizontal: 16 }}>

          </ContentSection>
          <FlatList
            data={INTENTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 12 }}
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
            renderItem={({ item }) => (
              <IntentCard
                title={item.title}
                description={item.description}
                icon={item.icon}
              />

            )}
          />
        </View>
        <View >
          <ContentSection title={"Aligned with aries"} titleFontSize={24} sectionStyle={{ paddingHorizontal: 16 }}>
            <SansText>Curated based on your sign and current transits.</SansText>
          </ContentSection>
          <FlatList
            data={PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 12 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => {
              const product = mapProduct(item);

              return (
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price.replace("₹ ", ""))}
                  image={product.image}
                />
              );
            }}
          />
        </View>
        <View >
          <ContentSection title={"Expert recommended"} titleFontSize={24} sectionStyle={{ paddingHorizontal: 16 }}>
            <SansText>Selected by our astrologers for this week’s planetary shifts.</SansText>
          </ContentSection>
          <FlatList
            data={PRODUCTS} // your API response array
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 12 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => {
              const product = mapProduct(item);

              return (
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price.replace("₹ ", ""))}
                  image={product.image}
                />
              );
            }}
          />
        </View>
        <View >
          <ContentSection title={"Chosen by the aries community"} titleFontSize={24} sectionStyle={{ paddingHorizontal: 16 }}>
            <SansText>Consistently selected and highly rated.</SansText>
          </ContentSection>
          <FlatList
            data={PRODUCTS} // your API response array
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 12 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => {
              const product = mapProduct(item);

              return (
                <ProductCard
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={Number(product.price.replace("₹ ", ""))}
                  image={product.image}
                />
              );
            }}
          />
        </View>

      </View>
    </View>
  );
};

const PoojaContent = () => {
  return (
    <View>
      {/* HERO */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}
      >
        <ECommerceFeatureCard
          image={require("@/assets/images/consmos1.png")}
          title="Book Poojas Aligned With Your Energy"
          description="Discover rituals and spiritual practices based on your planetary positions and life intentions."
          ctaText="Explore Poojas"
        />
      </View>

      <View
        style={{
          gap: 24,
          marginTop: 24,
        }}
      >
        <View>
          <ContentSection
            title={
              "Choose poojas by intention"
            }
            titleFontSize={24}
            sectionStyle={{
              paddingHorizontal: 16,
            }}
          />

          <FlatList
            data={INTENTS}
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            keyExtractor={(item) =>
              item.id
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 12,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ width: 6 }}
              />
            )}
            renderItem={({ item }) => (
              <IntentCard
                title={item.title}
                description={
                  item.description
                }
                icon={item.icon}
              />
            )}
          />
        </View>
        <View>
          <ContentSection
            title={"Recommended for aries"}
            titleFontSize={24}
            sectionStyle={{
              paddingHorizontal: 16,
            }}
          >
            <SansText>
              Spiritual rituals aligned
              with your zodiac energy.
            </SansText>
          </ContentSection>

          <FlatList
            data={PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            keyExtractor={(item) =>
              item._id
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 12,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ width: 12 }}
              />
            )}
            renderItem={({ item }) => {
              const product =
                mapProduct(item);

              return (
                <ProductCard
                  variant="pooja"
                  id={product.id}
                  title={`${product.title
                    } Pooja`}
                  description="Performed by verified pandits with proper rituals and guidance."
                  price={Number(
                    product.price.replace(
                      "₹ ",
                      ""
                    )
                  )}
                  image={
                    product.image
                  }
                />
              );
            }}
          />
        </View>

        <View>
          <ContentSection
            title={"Trending this week"}
            titleFontSize={24}
            sectionStyle={{
              paddingHorizontal: 16,
            }}
          >
            <SansText>
              Most booked rituals during
              current planetary transitions.
            </SansText>
          </ContentSection>

          <FlatList
            data={PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            keyExtractor={(item) =>
              item._id
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 12,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ width: 12 }}
              />
            )}
            renderItem={({ item }) => {
              const product =
                mapProduct(item);

              return (
                <ProductCard
                  variant="pooja"
                  id={product.id}
                  title={`${product.title
                    } Ritual`}
                  description="Book online poojas and receive blessings, guidance, and ritual completion updates."
                  price={Number(
                    product.price.replace(
                      "₹ ",
                      ""
                    )
                  )}
                  image={
                    product.image
                  }
                />
              );
            }}
          />
        </View>

        <View>
          <ContentSection
            title={
              "Popular in your community"
            }
            titleFontSize={24}
            sectionStyle={{
              paddingHorizontal: 16,
            }}
          >
            <SansText>
              Frequently booked by users
              with similar astrological
              profiles.
            </SansText>
          </ContentSection>

          <FlatList
            data={PRODUCTS}
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            keyExtractor={(item) =>
              item._id
            }
            contentContainerStyle={{
              paddingHorizontal: 16,
              marginTop: 12,
              paddingBottom: 32,
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ width: 12 }}
              />
            )}
            renderItem={({ item }) => {
              const product =
                mapProduct(item);

              return (
                <ProductCard
                  variant="pooja"
                  id={product.id}
                  title={`${product.title
                    } Ceremony`}
                  description="Trusted spiritual services chosen regularly by the community."
                  price={Number(
                    product.price.replace(
                      "₹ ",
                      ""
                    )
                  )}
                  image={
                    product.image
                  }
                />
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  tabsContainer: {
    flexDirection: "row",
    position: "relative",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    flexDirection: "row",
    gap: 8,
  },

  tabText: {
    fontSize: 16,
    color: "#0D0D0D",
    fontFamily: "SatoshiBold",

  },

  activeTabText: {
    color: "#0D0D0D",
    fontFamily: "SatoshiBold",
  },

  animatedIndicator: {
    position: "absolute",
    bottom: 0,
    height: 4,
    backgroundColor: "#D4AF37",
  },
});