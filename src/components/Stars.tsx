import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  rating?: number;
  size: number;
};

export function Stars({ rating, size }: Props) {
  if (!rating) return null;
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={i <= rating ? colors.accent : colors.starOff}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    flexDirection: "row",
    gap: 2,
  },
});