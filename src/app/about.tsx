import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();
  const version = Constants.expoConfig?.version ?? "-";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>アプリについて</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="閉じる"
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* アプリの情報 */}
        <View style={styles.section}>
          <Text style={styles.appName}>movie-log</Text>
          <Text style={styles.body}>
            観た映画・観たい映画を記録して、評価や感想を残せるアプリです。
          </Text>
          <Text style={styles.meta}>バージョン {version}</Text>
        </View>

        {/* クレジット */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>クレジット</Text>
          <Image
            source={require("../../assets/images/tmdb-logo.svg")}
            style={styles.logo}
            contentFit="contain"
            accessibilityLabel="TMDB ロゴ"
            />
          <Text style={styles.body}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Text>
          <Text style={styles.meta}>
            映画の情報と画像は The Movie Database (TMDB) から提供されています。
          </Text>
          <Pressable
            onPress={() => Linking.openURL("https://www.themoviedb.org/")}
            style={styles.linkButton}
          >
            <Text style={styles.link}>themoviedb.org を開く</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 8,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    gap: 10,
  },
  appName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  sectionTitle: {
    color: colors.textSub,
    fontSize: 12,
    fontWeight: "700",
  },
  logo: {
    width: 120,
    height: 40,
  },
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  meta: {
    color: colors.textSub,
    fontSize: 13,
    lineHeight: 20,
  },
  linkButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    justifyContent: "center",
  },
  link: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});