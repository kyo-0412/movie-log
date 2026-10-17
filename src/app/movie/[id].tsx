import { colors } from "@/constants/colors";
import { getMovieDetail, posterUrl } from "@/lib/tmdb";
import { TmdbMovieDetail } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMovieDetail(Number(id));
        setMovie(data);
      } catch (e) {
        setError("映画情報の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "映画が見つかりません。"}</Text>
      </View>
    );
  }

  const backdrop = posterUrl(movie.backdrop_path, "w780");
  const poster = posterUrl(movie.poster_path, "w342");
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "公開年不明";
  const runtime = movie.runtime ? ` · ${movie.runtime}分` : "";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {backdrop ? (
          <Image source={{ uri: backdrop }} style={styles.backdrop} />
        ) : (
          <View style={[styles.backdrop, styles.noImage]} />
        )}

        <View style={styles.header}>
          {poster ? (
            <Image source={{ uri: poster }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, styles.noImage]} />
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>
              {year}
              {runtime}
            </Text>
            <View style={styles.genres}>
              {movie.genres.map((g) => (
                <Text key={g.id} style={styles.genre}>
                  {g.name}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>あらすじ</Text>
          <Text style={styles.overview}>
            {movie.overview || "あらすじは登録されていません。"}
          </Text>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top + 8 }]}
        accessibilityLabel="戻る"
      >
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: colors.accent,
  },
  backdrop: {
    width: "100%",
    height: 220,
  },
  noImage: {
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
    marginTop: -60,
  },
  poster: {
    width: 110,
    height: 165,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 6,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  meta: {
    color: colors.textSub,
    fontSize: 13,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  genre: {
    color: colors.textSub,
    fontSize: 11,
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: "hidden",
  },
  section: {
    padding: 20,
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  overview: {
    color: colors.textSub,
    fontSize: 14,
    lineHeight: 24,
  },
  backButton: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});