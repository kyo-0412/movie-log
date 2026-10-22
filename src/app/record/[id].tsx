import { colors } from "@/constants/colors";
import { useMovies } from "@/context/MovieContext";
import { posterUrl } from "@/lib/tmdb";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 2026/10/22 の形式かどうか
const DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}$/;

// 今日の日付を 2026/10/22 の形式で返す
function today() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}/${mm}/${dd}`;
}

export default function RecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMovie, updateRecord } = useMovies();
  const saved = getMovie(Number(id));

  // 入力欄の初期値は、すでに保存されている記録（なければ空）
  const [rating, setRating] = useState(saved?.rating ?? 0);
  const [watchedAt, setWatchedAt] = useState(saved?.watchedAt ?? "");
  const [memo, setMemo] = useState(saved?.memo ?? "");
  const [error, setError] = useState<string | null>(null);

  if (!saved) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>マイリストに登録されていない映画です。</Text>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (watchedAt && !DATE_PATTERN.test(watchedAt)) {
      setError("観た日は 2026/10/22 の形式で入力してください");
      return;
    }
    updateRecord(saved.id, {
      rating: rating || undefined,
      watchedAt: watchedAt || undefined,
      memo: memo.trim() || undefined,
    });
    router.back();
  };

  const poster = posterUrl(saved.posterPath, "w92");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* 見出しと閉じるボタン */}
        <View style={styles.header}>
          <Text style={styles.title}>記録する</Text>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="閉じる"
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* 映画の情報 */}
          <View style={styles.movieRow}>
            {poster ? (
              <Image source={{ uri: poster }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.noPoster]} />
            )}
            <Text style={styles.movieTitle} numberOfLines={2}>
              {saved.title}
            </Text>
          </View>

          {/* 評価 */}
          <View style={styles.field}>
            <Text style={styles.label}>評価</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Pressable
                  key={i}
                  accessibilityLabel={`星${i}つ`}
                  onPress={() => setRating(i === rating ? 0 : i)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={i <= rating ? "star" : "star-outline"}
                    size={36}
                    color={i <= rating ? colors.accent : colors.starOff}
                  />
                </Pressable>
              ))}
            </View>
          </View>

          {/* 観た日 */}
          <View style={styles.field}>
            <Text style={styles.label}>観た日</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.input, styles.flex]}
                value={watchedAt}
                onChangeText={(text) => {
                  setWatchedAt(text);
                  setError(null);
                }}
                placeholder="2026/10/22"
                placeholderTextColor={colors.textMuted}
                keyboardType="numbers-and-punctuation"
              />
              <Pressable style={styles.todayButton} onPress={() => setWatchedAt(today())}>
                <Text style={styles.todayText}>今日</Text>
              </Pressable>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* 感想メモ */}
          <View style={styles.field}>
            <Text style={styles.label}>感想メモ</Text>
            <TextInput
              style={[styles.input, styles.memoInput]}
              value={memo}
              onChangeText={setMemo}
              placeholder="印象に残ったシーンや感想を書いておこう"
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* 保存ボタン */}
        <View style={styles.footer}>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>保存する</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    gap: 28,
  },
  movieRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  poster: {
    width: 44,
    height: 66,
    borderRadius: 4,
  },
  noPoster: {
    backgroundColor: colors.border,
  },
  movieTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  field: {
    gap: 10,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  starRow: {
    flexDirection: "row",
    gap: 4,
  },
  starButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 16,
  },
  todayButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.starOff,
    justifyContent: "center",
  },
  todayText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  memoInput: {
    minHeight: 140,
    paddingTop: 12,
    lineHeight: 24,
  },
  errorText: {
    color: colors.accent,
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  saveButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});