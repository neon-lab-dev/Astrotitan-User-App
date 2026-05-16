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
import { INTENTS } from "@/data/intents";
import { useGetAllProductsQuery } from "@/redux/features/product/productsApi";
import { useGetAllPujasQuery } from "@/redux/features/puja/pujaApi";
import { RootState } from "@/redux/store";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet, View, } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

const Remedies = () => {
  const [activeTab, setActiveTab] = useState("store");
  const [containerWidth, setContainerWidth] = useState(0);

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const tabs = [
    {
      key: "store",
      label: "Store",
      icon: "StoreIcon",
    },
    {
      key: "pooja",
      label: "Pooja",
      icon: "firePitInactive",
    },
  ];

  const TAB_WIDTH =
    containerWidth / tabs.length;

  const translateX = useRef(
    new Animated.Value(0)
  ).current;

  const opacity = useRef(
    new Animated.Value(1)
  ).current;




  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery({
    limit: 20,
    skip: 0,
  });

  const {
    data: pujasResponse,
    isLoading: isPujasLoading,
    isError: isPujasError,
  } = useGetAllPujasQuery({
    limit: 20,
    skip: 0,
  });

  const pujas =
    pujasResponse?.data
      ?.pujas || [];

  const products =
    productsResponse?.data?.data || [];

  const recommendedProducts = products.slice(
    0,
    10
  );

  const expertRecommendedProducts =
    products.filter(
      (item: any) =>
        item.rating >= 4
    );

  const communityProducts = [
    ...products,
  ].sort(
    (a: any, b: any) =>
      b.reviews.length -
      a.reviews.length
  );

  const recentProducts = [
    ...products,
  ].sort(
    (a: any, b: any) =>
      new Date(
        b.createdAt
      ).getTime() -
      new Date(
        a.createdAt
      ).getTime()
  );

  const affordableProducts =
    products.filter(
      (item: any) =>
        item.discountedPrice < 1000
    );

  const premiumProducts =
    products.filter(
      (item: any) =>
        item.discountedPrice >= 2000
    );

  const malaProducts = products.filter(
    (item: any) =>
      item.category === "Mala"
  );

  const user = useSelector(
    (state: RootState) =>
      state.auth.user
  );

  const rawUserIntents =
    user?.profile?.intents || [];

  const parsedUserIntents =
    rawUserIntents.flatMap(
      (item: any) => {
        try {
          if (
            typeof item ===
            "string"
          ) {
            return JSON.parse(
              item
            );
          }

          return item;
        } catch {
          return [];
        }
      }
    );

  const normalizedUserIntents =
    parsedUserIntents.map(
      (intent: string) =>
        intent
          .trim()
          .toLowerCase()
    );

  const groupedIntentProducts =
    products.reduce(
      (
        acc: any,
        product: any
      ) => {
        const intent =
          product.intent;

        if (!intent) {
          return acc;
        }

        const normalizedIntent =
          intent
            .trim()
            .toLowerCase();

        if (
          !acc[
          normalizedIntent
          ]
        ) {
          acc[
            normalizedIntent
          ] = {
            title: intent,
            products: [],
          };
        }

        acc[
          normalizedIntent
        ].products.push(
          product
        );

        return acc;
      },
      {}
    );

  const personalizedIntentSections =
    Object.values(
      groupedIntentProducts
    ).filter(
      (section: any) =>
        normalizedUserIntents.includes(
          section.title
            .trim()
            .toLowerCase()
        )
    );
  const meta =
    productsResponse?.data?.meta;


  const recommendedPujas =
    pujas.slice(0, 10);

  const expertRecommendedPujas =
    pujas.filter(
      (item: any) =>
        item.rating >= 4
    );

  const communityPujas = [
    ...pujas,
  ].sort(
    (a: any, b: any) =>
      b.reviews.length -
      a.reviews.length
  );

  const recentPujas = [
    ...pujas,
  ].sort(
    (a: any, b: any) =>
      new Date(
        b.createdAt
      ).getTime() -
      new Date(
        a.createdAt
      ).getTime()
  );

  const affordablePujas =
    pujas.filter(
      (item: any) =>
        item.discountedPrice < 5000
    );

  const premiumPujas =
    pujas.filter(
      (item: any) =>
        item.discountedPrice >= 5000
    );

  const rudraPujas =
    pujas.filter(
      (item: any) =>
        item.category ===
        "Rudra"
    );


  const groupedIntentPujas =
    pujas.reduce(
      (
        acc: any,
        puja: any
      ) => {
        const intent =
          puja.intent;

        if (!intent) {
          return acc;
        }

        const normalizedIntent =
          intent
            .trim()
            .toLowerCase();

        if (
          !acc[
          normalizedIntent
          ]
        ) {
          acc[
            normalizedIntent
          ] = {
            title: intent,
            pujas: [],
          };
        }

        acc[
          normalizedIntent
        ].pujas.push(
          puja
        );

        return acc;
      },
      {}
    );

  const personalizedIntentPujas =
    Object.values(
      groupedIntentPujas
    ).filter(
      (section: any) =>
        normalizedUserIntents.includes(
          section.title
            .trim()
            .toLowerCase()
        )
    );
  const handleTabPress = (
    index: number,
    key: string
  ) => {
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
        return (
          <StoreContent
            recommendedProducts={
              recommendedProducts
            }
            expertRecommendedProducts={
              expertRecommendedProducts
            }
            communityProducts={
              communityProducts
            }
            recentProducts={
              recentProducts
            }
            affordableProducts={
              affordableProducts
            }
            premiumProducts={
              premiumProducts
            }
            malaProducts={
              malaProducts
            }
            personalizedIntentSections={
              personalizedIntentSections
            }
          />
        );

      case "pooja":
        return (
          <PoojaContent
            recommendedPujas={
              recommendedPujas
            }
            expertRecommendedPujas={
              expertRecommendedPujas
            }
            communityPujas={
              communityPujas
            }
            recentPujas={
              recentPujas
            }
            affordablePujas={
              affordablePujas
            }
            premiumPujas={
              premiumPujas
            }
            rudraPujas={
              rudraPujas
            }
            personalizedIntentPujas={
              personalizedIntentPujas
            }
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SansText>
          Loading products...
        </SansText>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SansText>
          Failed to load products
        </SansText>
      </View>
    );
  }

  return (
    <AnimatedScreen>
      <ScreenWrapper>
        <AppHeader showBack={false}>
          <SectionTitle title="Remedies">
            <IconButton
              Icon={CartIcon}
              iconColor="#0D0D0D"
              update={true}
              updateCount={cartCount}
              onPress={() => {
                router.push(
                  "/(tabs)/remedies/(ecommerce)/cart"
                );
              }}
            />
          </SectionTitle>

          <View
            style={styles.tabsContainer}
            onLayout={(e) =>
              setContainerWidth(
                e.nativeEvent.layout.width
              )
            }
          >
            {tabs.map((tab, index) => {
              const isActive =
                activeTab === tab.key;

              const Icon =
                ICONS[tab.icon];

              return (
                <Pressable
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() =>
                    handleTabPress(
                      index,
                      tab.key
                    )
                  }
                >
                  <Icon
                    width={22}
                    height={22}
                  />

                  <SansText
                    style={[
                      styles.tabText,
                      isActive &&
                      styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </SansText>
                </Pressable>
              );
            })}

            <Animated.View
              style={[
                styles.animatedIndicator,
                {
                  width: TAB_WIDTH,
                  transform: [
                    { translateX },
                  ],
                },
              ]}
            />
          </View>
        </AppHeader>

        <ScrollView>
          <Animated.View
            style={{
              flex: 1,
              opacity,
            }}
          >
            {renderContent()}
          </Animated.View>
        </ScrollView>
      </ScreenWrapper>
    </AnimatedScreen>
  );
};

export default Remedies;

const mapProduct = (item: any) => ({
  id: item._id,
  title: item.name,
  description: item.description,
  price: Number(
    item.discountedPrice ||
    item.basePrice ||
    0
  ),
  image:
    item.imageUrls?.[0] || "",
  rating: item.rating || 0,
  reviews: item.reviews || [],
  category: item.category,
  intent: item.intent,
  quantity: item.quantity,
});

const StoreContent = ({
  recommendedProducts,
  expertRecommendedProducts,
  communityProducts,
  recentProducts,
  affordableProducts,
  premiumProducts,
  malaProducts,
  personalizedIntentSections,
}: any) => {
  return (
    <View>
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}
      >
        <ECommerceFeatureCard
          image={require("@/assets/images/consmos1.png")}
          title="Find What Actually Works for You"
          description="Get remedy suggestions based on your birth chart and current planetary phase."
          ctaText="Start Analysis"
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
              "Explore remedies by intents"
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

        <ProductSection
          title="Recommended For You"
          description="Curated spiritual remedies based on your journey."
          products={recommendedProducts}
        />

        <ProductSection
          title="Expert Recommended"
          description="Highly rated remedies trusted by spiritual experts."
          products={
            expertRecommendedProducts
          }
        />

        <ProductSection
          title="Most Loved By Community"
          description="Frequently chosen and positively reviewed by users."
          products={communityProducts}
        />
        {personalizedIntentSections.map(
          (section: any) => (
            <ProductSection
              key={section.title}
              title={section.title}
              description={`Specially curated remedies for ${section.title.toLowerCase()}.`}
              products={
                section.products
              }
            />
          )
        )}

        <ProductSection
          title="Affordable Remedies"
          description="Powerful spiritual products at accessible prices."
          products={affordableProducts}
        />

        <ProductSection
          title="Premium Collection"
          description="Premium spiritual items crafted for deeper experiences."
          products={premiumProducts}
        />

        <ProductSection
          title="Recently Added"
          description="Fresh additions to the spiritual store."
          products={recentProducts}
        />

        <ProductSection
          title="Mala Collection"
          description="Sacred malas for meditation and spiritual growth."
          products={malaProducts}
        />

      </View>
    </View>
  );
};

const PoojaContent = ({
  recommendedPujas,
  expertRecommendedPujas,
  communityPujas,
  recentPujas,
  affordablePujas,
  premiumPujas,
  rudraPujas,
  personalizedIntentPujas,
}: any) => {
  return (
    <View>
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
                variant="pooja"
              />
            )}
          />
        </View>

        <PoojaSection
          title="Recommended Pujas"
          description="Curated spiritual rituals aligned with your current energy."
          products={
            recommendedPujas
          }
          suffix="Pooja"
        />

        <PoojaSection
          title="Expert Recommended"
          description="Highly trusted rituals suggested by experienced pandits."
          products={
            expertRecommendedPujas
          }
          suffix="Ritual"
        />

        <PoojaSection
          title="Most Booked"
          description="Popular spiritual ceremonies booked by the community."
          products={
            communityPujas
          }
          suffix="Ceremony"
        />

        {personalizedIntentPujas.map(
          (section: any) => (
            <PoojaSection
              key={section.title}
              title={section.title}
              description={`Specially curated rituals for ${section.title.toLowerCase()}.`}
              products={
                section.pujas
              }
              suffix="Pooja"
            />
          )
        )}

        <PoojaSection
          title="Affordable Pujas"
          description="Accessible spiritual rituals for daily guidance and healing."
          products={
            affordablePujas
          }
          suffix="Pooja"
        />

        <PoojaSection
          title="Premium Rituals"
          description="Advanced ceremonies performed with complete Vedic procedures."
          products={
            premiumPujas
          }
          suffix="Ritual"
        />

        <PoojaSection
          title="Recently Added"
          description="Freshly added spiritual ceremonies and rituals."
          products={
            recentPujas
          }
          suffix="Pooja"
        />

        <PoojaSection
          title="Rudra Pujas"
          description="Powerful Lord Shiva rituals for protection and healing."
          products={
            rudraPujas
          }
          suffix="Pooja"
        />
      </View>
    </View>
  );
};

const ProductSection = ({
  title,
  description,
  products,
}: any) => {
  return (
    <View>
      <ContentSection
        title={title}
        titleFontSize={24}
        sectionStyle={{
          paddingHorizontal: 16,
        }}
      >
        <SansText>
          {description}
        </SansText>
      </ContentSection>

      <FlatList
        data={products}
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
              id={product.id}
              title={product.title}
              description={
                product.description
              }
              price={product.price}
              image={product.image}
            />
          );
        }}
      />
    </View>
  );
};

const PoojaSection = ({
  title,
  description,
  products,
  suffix,
}: any) => {
  return (
    <View>
      <ContentSection
        title={title}
        titleFontSize={24}
        sectionStyle={{
          paddingHorizontal: 16,
        }}
      >
        <SansText>
          {description}
        </SansText>
      </ContentSection>

      <FlatList
        data={products}
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
              title={`${product.title} ${suffix}`}
              description="Performed by verified pandits with proper rituals and guidance."
              price={product.price}
              image={product.image}
            />
          );
        }}
      />
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