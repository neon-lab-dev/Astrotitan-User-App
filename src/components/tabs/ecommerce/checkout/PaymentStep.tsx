import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import SectionTitle from "../../../reusable/SectionTitle/SectionTitle";
import { SansText } from "../../../reusable/Text/SansText";

interface Props {
  value: any;
  setValue: (data: any) => void;
}

const PaymentStep = ({ value, setValue }: Props) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);


  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );


  const shipping = cartItems.length > 0 ? 100 : 0;

  const total = subtotal + shipping;


  return (
    <View
      style={{
        paddingTop: 12,
      }}
    >
      {/* PRICE SUMMARY */}
      <View style={styles.summaryCard}>
        <SectionTitle title="Price Summary" titleFontSize={16} />

        <View
          style={{
            marginTop: 14,
            gap: 10,
          }}
        >
          <Row label="Subtotal" value={`₹ ${subtotal}/-`} />

          <Row label="Shipping Charges" value={`₹ ${shipping}/-`} />

          {/* <Row label="Discount Applied" value="NA" /> */}

          <View style={styles.divider} />

          <Row label="Total" value={`₹ ${total}/-`} />
        </View>
      </View>


    </View>
  );
};

export default PaymentStep;



const Row = ({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <View style={styles.row}>
    <SansText style={bold ? styles.bold : styles.normal}>{label}</SansText>

    <SansText style={styles.bold}>{value}</SansText>
  </View>
);

/* ------------------------- */
/* STYLES */
/* ------------------------- */

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#FBF7EB",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6D18B",
  },

  divider: {
    height: 1,

    backgroundColor: "#E6D18B",

    marginVertical: 4,
  },

  row: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  bold: {
    fontFamily: "Satoshi-Bold",

    fontSize: 16,
  },

  normal: {
    color: "#444",
  },

  optionCard: {
    backgroundColor: "#FBF7EB",

    borderRadius: 16,

    padding: 24,

    borderWidth: 1,

    borderColor: "#D4AF37",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  activeOption: {
    borderColor: "#D4AF37",

    backgroundColor: "#FFF8E1",
  },

  optionText: {
    fontSize: 14,

    fontFamily: "Satoshi-Medium",
  },

  radio: {
    width: 18,

    height: 18,

    borderRadius: 999,

    borderWidth: 1.5,

    borderColor: "#D4AF37",
  },

  radioActive: {
    backgroundColor: "#D4AF37",
  },
});
