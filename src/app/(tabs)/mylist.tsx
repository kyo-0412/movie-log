import { Stars } from "@/components/Stars";
import { colors } from "@/constants/colors";
import { useMovies } from "@/context/MovieContext";
import { posterUrl } from "@/lib/tmdb";
import { SavedMovie, WatchStatus } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_OPTIONS: { value: WatchStatus; label: string }[] = [
  { value: "watched", label: "観た" },
  { value: "want", label: "観たい" },
  { value: "watching", label: "観てる" },
];

type ViewMode = "grid" | "list";

const COLUMNS = 3;
const H_PADDING = 20;
const GAP = 12;

// ★評価の表示（評価がなければ何も出さない）
// function Stars({ rating, size }: { rating?: number; size: number }) {
//   if (!rating) return null;
//   return (
//     <View style={styles.stars}>
//       {[1, 2, 3, 4, 5].map((i) => (
//         <Ionicons
//           key={i}
//           name="star"
//           size={size}
//           color={i <= rating ? colors.accent : colors.starOff}
//         />
//       ))}
//     </View>
//   );
// }

export default function MyListScreen() {
  const router = useRouter();
  const { movies, isLoaded } = useMovies();
  const { width } = useWindowDimensions();

  const [selectedStatus, setSelectedStatus] = useState<WatchStatus>("watched");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = movies.filter((m) => m.status === selectedStatus);
  const currentLabel = STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label;
  const itemWidth = (width - H_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  const openDetail = (id: number) => {
    router.push({ pathname: "/movie/[id]", params: { id: id.toString() } });
  };

  // グリッド表示の1件
  const renderGridItem = ({ item }: { item: SavedMovie }) => {
    const uri = posterUrl(item.posterPath);
    const posterStyle = [styles.gridPoster, { height: itemWidth * 1.5 }];
    return (
      <Pressable style={[styles.gridItem, { width: itemWidth }]} onPress={() => openDetail(item.id)}>
        {uri ? (
          <Image source={{ uri }} style={posterStyle} />
        ) : (
          <View style={[posterStyle, styles.noPoster]} />
        )}
        <Text style={styles.gridTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Stars rating={item.rating} size={11} />
      </Pressable>
    );
  };

  // リスト表示の1件
  const renderListItem = ({ item }: { item: SavedMovie }) => {
    const uri = posterUrl(item.posterPath);
    return (
      <Pressable style={styles.listRow} onPress={() => openDetail(item.id)}>
        {uri ? (
          <Image source={{ uri }} style={styles.listPoster} />
        ) : (
          <View style={[styles.listPoster, styles.noPoster]} />
        )}
        <View style={styles.listInfo}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Stars rating={item.rating} size={14} />
          {item.watchedAt ? (
            <Text style={styles.meta}>観た日 {item.watchedAt}</Text>
          ) : null}
          {item.memo ? (
            <Text style={styles.memo} numberOfLines={1}>
              {item.memo}
            </Text>
          ) : null}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 見出しと表示切り替え */}
      <View style={styles.header}>
        <Text style={styles.title}>マイリスト</Text>
        <View style={styles.toggle}>
          <Pressable
            accessibilityLabel="グリッド表示"
            onPress={() => setViewMode("grid")}
            style={[styles.toggleButton, viewMode === "grid" && styles.toggleButtonActive]}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={viewMode === "grid" ? colors.accent : colors.textMuted}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="リスト表示"
            onPress={() => setViewMode("list")}
            style={[styles.toggleButton, viewMode === "list" && styles.toggleButtonActive]}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === "list" ? colors.accent : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      {/* ステータスの絞り込み */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((opt) => {
          const active = selectedStatus === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setSelectedStatus(opt.value)}
              style={[styles.filterButton, active && styles.filterButtonActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 一覧 */}
      {isLoaded && (
        <FlatList
          key={viewMode}
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === "grid" ? COLUMNS : 1}
          columnWrapperStyle={viewMode === "grid" ? { gap: GAP } : undefined}
          renderItem={viewMode === "grid" ? renderGridItem : renderListItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>「{currentLabel}」の映画はまだありません</Text>
              <Pressable style={styles.emptyButton} onPress={() => router.navigate("/")}>
                <Text style={styles.emptyButtonText}>映画を探す</Text>
              </Pressable>
            </View>
          }
        />
      )}
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
    paddingHorizontal: H_PADDING,
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  toggle: {
    flexDirection: "row",
    gap: 4,
    padding: 2,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  toggleButton: {
    width: 44,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: colors.border,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: H_PADDING,
    marginBottom: 16,
  },
  filterButton: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.starOff,
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterText: {
    color: colors.textSub,
    fontSize: 14,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: H_PADDING,
    paddingBottom: 24,
  },
  // グリッド
  gridItem: {
    marginBottom: 16,
    gap: 6,
  },
  gridPoster: {
    width: "100%",
    borderRadius: 8,
  },
  gridTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  // リスト
  listRow: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  listPoster: {
    width: 64,
    height: 96,
    borderRadius: 6,
  },
  listInfo: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  listTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: colors.textSub,
    fontSize: 12,
  },
  memo: {
    color: colors.textSub,
    fontSize: 13,
  },
  // 共通
  noPoster: {
    backgroundColor: colors.surface,
  },
  // stars: {
  //   flexDirection: "row",
  //   gap: 2,
  // },
  empty: {
    alignItems: "center",
    gap: 16,
    paddingTop: 60,
  },
  emptyText: {
    color: colors.textSub,
    fontSize: 14,
  },
  emptyButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.accent,
    justifyContent: "center",
  },
  emptyButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
});