import { colors } from "@/constants/colors";
import { posterUrl, searchMovies } from "@/lib/tmdb";
import { TmdbMovie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const movies = await searchMovies(query.trim());
      setResults(movies);
    } catch (e) {
      setError("検索に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>検索</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholder="映画タイトルで検索"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
        />
      </View>

      {loading && <ActivityIndicator color={colors.accent} style={styles.loading} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const uri = posterUrl(item.poster_path);
          return (
            <Pressable
                style={styles.row}
                onPress={() =>
                    router.push({ pathname: "/movie/[id]", params: { id: item.id.toString() } })
                }
                >
              {uri ? (
                <Image source={{ uri }} style={styles.poster} />
              ) : (
                <View style={[styles.poster, styles.noPoster]} />
              )}
              <View style={styles.info}>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.meta}>
                  {item.release_date ? item.release_date.slice(0, 4) : "公開年不明"}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 16,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  loading: {
    marginTop: 24,
  },
  error: {
    color: colors.accent,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 10,
  },
  poster: {
    width: 56,
    height: 84,
    borderRadius: 6,
  },
  noPoster: {
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: colors.textSub,
    fontSize: 13,
  },
});