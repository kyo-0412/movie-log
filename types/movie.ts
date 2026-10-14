// 観た／観たい／観てる
export type WatchStatus = "watched" | "want" | "watching";

// TMDBの検索結果1件分
export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
};

// TMDBの詳細データ（検索結果＋上映時間・ジャンル）
export type TmdbMovieDetail = TmdbMovie & {
  runtime: number | null;
  genres: { id: number; name: string }[];
};

// 自分が保存する記録データ
export type SavedMovie = {
  id: number;
  title: string;
  posterPath: string | null;
  status: WatchStatus;
  rating?: number;
  watchedAt?: string;
  memo?: string;
};