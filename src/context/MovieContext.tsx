import { SavedMovie, WatchStatus } from "@/types/movie";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "movies";

// 登録時に必要な映画の基本情報
type MovieInfo = Pick<SavedMovie, "id" | "title" | "posterPath">;
// 記録として更新できる項目
type RecordInput = Pick<SavedMovie, "rating" | "watchedAt" | "memo">;

// 掲示板に貼るもの（データと操作）の型
type MovieContextType = {
  movies: SavedMovie[];
  isLoaded: boolean;
  getMovie: (id: number) => SavedMovie | undefined;
  setStatus: (info: MovieInfo, status: WatchStatus) => void;
  removeMovie: (id: number) => void;
  updateRecord: (id: number, record: RecordInput) => void;
};

const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<SavedMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 起動時：保存データを読み込む
  useEffect(() => {
    const load = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setMovies(JSON.parse(json));
        }
      } catch (e) {
        console.error("読み込みに失敗しました", e);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  // movies が変わるたび：保存する
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies)).catch((e) =>
      console.error("保存に失敗しました", e)
    );
  }, [movies, isLoaded]);

  // IDで1件探す（なければ undefined）
  const getMovie = (id: number) => movies.find((m) => m.id === id);

  // ステータスを登録・変更する
  const setStatus = (info: MovieInfo, status: WatchStatus) => {
    setMovies((prev) => {
      const exists = prev.some((m) => m.id === info.id);
      if (exists) {
        return prev.map((m) => (m.id === info.id ? { ...m, status } : m));
      }
      return [...prev, { ...info, status }];
    });
  };

  // マイリストから外す
  const removeMovie = (id: number) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };
  // 評価・観た日・メモを更新する
  const updateRecord = (id: number, record: RecordInput) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...record } : m))
    );
  };

  return (
    <MovieContext.Provider value={{ movies, isLoaded, getMovie, setStatus, removeMovie, updateRecord }}>
      {children}
    </MovieContext.Provider>
  );
}

// 掲示板を見るためのフック
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies は MovieProvider の中で使ってください");
  }
  return context;
}