// src/hooks/useQuery.ts
import { useQuery, UseQueryResult } from "react-query";
import { AxiosResponse, AxiosError } from "axios";
import api from "../api/api";

export interface ShortUrl {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
}

interface TotalClicksResponse {
  [date: string]: number;
}

export interface TotalClickItem {
  clickDate: string;
  count: number;
}

type ErrorCallback = (error: AxiosError) => void;

// Fetch all ShortUrl List
// src/hooks/useQuery.ts
export const useFetchMyShortUrls = (
  token: string | null,
  onError: ErrorCallback
): UseQueryResult<ShortUrl[], AxiosError> => {
  return useQuery<AxiosResponse<ShortUrl[]>, AxiosError, ShortUrl[]>(
    ["my-shortenurls", token],
    async () => {
      if (!token) {
        return { data: [] } as AxiosResponse<ShortUrl[]>;
      }
      return await api.get<ShortUrl[]>("/api/urls/myurls", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
    },
    {
      enabled: !!token,
      select: (data): ShortUrl[] => {
        // ✅ IMPORTANT: Create new array and new objects to break reference
        const sortedData = data.data
          .map(item => ({ ...item })) // Create new object for each item
          .sort((a, b) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          );
        return sortedData;
      },
      onError,
      staleTime: 0,
      cacheTime: 0,  // ✅ Add this to prevent caching issues
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );
};

// Fetch total clicks in last 30 days (leave mostly as you had)
export const useFetchTotalClicks = (
  token: string | null,
  onError: ErrorCallback
): UseQueryResult<TotalClickItem[], AxiosError> => {
  return useQuery<AxiosResponse<TotalClicksResponse>, AxiosError, TotalClickItem[]>(
    ["url-totalclick", token],
    async () => {
      if (!token) {
        return { data: {} } as AxiosResponse<TotalClicksResponse>;
      }
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const endDate = today.toISOString().split('T')[0];
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      return await api.get<TotalClicksResponse>(
        `/api/urls/totalClicks?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    },
    {
      select: (data): TotalClickItem[] => {
        const convertToArray: TotalClickItem[] = Object.keys(data.data).map(
          (key) => ({
            clickDate: key,
            count: data.data[key],
          })
        );
        return convertToArray;
      },
      enabled: !!token,
      onError,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    }
  );
};