import { useQuery, type UseQueryResult } from "react-query";
import { AxiosError } from "axios";
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

// Helper function to get date strings
const getDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Last 30 days

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export const useFetchMyShortUrls = (
  token: string | null,
  onError: ErrorCallback
): UseQueryResult<ShortUrl[], AxiosError> => {
  return useQuery<ShortUrl[], AxiosError>(
    "myShortUrls",
    async () => {
      const response = await api.get("/api/urls/myurls", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("📊 Fetched URLs:", response.data);
      return response.data;
    },
    {
      enabled: !!token,
      onError,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    }
  );
};

export const useFetchTotalClicks = (
  token: string | null,
  onError: ErrorCallback
): UseQueryResult<TotalClickItem[], AxiosError> => {
  const { startDate, endDate } = getDateRange();

  return useQuery<TotalClicksResponse, AxiosError, TotalClickItem[]>(
    ["totalClicks", startDate, endDate], // Include dates in query key for proper caching
    async () => {
      const url = `/api/urls/totalClicks?startDate=${startDate}&endDate=${endDate}`;
      console.log("📈 Fetching total clicks:", url);
      
      const response = await api.get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      
      console.log("📈 Total clicks raw response:", response.data);
      return response.data;
    },
    {
      enabled: !!token,
      onError,
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      select: (data) => {
        // Handle empty or null response
        if (!data || Object.keys(data).length === 0) {
          console.log("📈 No click data found");
          return [];
        }

        const transformed = Object.keys(data)
          .map((key) => ({
            clickDate: key,
            count: data[key],
          }))
          .sort((a, b) => new Date(a.clickDate).getTime() - new Date(b.clickDate).getTime());

        console.log("📈 Transformed click data:", transformed);
        return transformed;
      },
    }
  );
};