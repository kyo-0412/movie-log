import { TmdbMovie, TmdbMovieDetail } from "@/types/movie";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type SearchResponse = {
  results: TmdbMovie[];
};

// タイトルで映画を検索する
export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const url =
    `${BASE_URL}/search/movie?api_key=${API_KEY}` +
    `&language=ja-JP&query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status}`);
  }
  const data: SearchResponse = await res.json();
  return data.results;
}

// 映画IDから詳細情報を取得する
export async function getMovieDetail(id: number): Promise<TmdbMovieDetail> {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ja-JP`;
  
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`TMDB error: ${res.status}`);
    }
    return res.json();
  }

// ポスター画像のURLを作る（画像がなければ null）
export function posterUrl(path: string | null, size = "w185"): string | null {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}