import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { IoCopyOutline, IoCheckmark, IoStatsChart } from 'react-icons/io5';
import { MdOutlineAdsClick, MdCalendarToday, MdDeleteOutline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ImSpinner8 } from 'react-icons/im';
import toast from 'react-hot-toast';

import api from '../../api/api';
import { useStoreContext } from '../../contextApi/ContextApi';
import Graph from './Graph';

interface AnalyticsData {
  clickDate: string;
  count: number;
}

interface ShortenItemProps {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
  onDelete: (id: number) => void;
}

const ShortenItem: React.FC<ShortenItemProps> = ({
  id,
  originalUrl,
  shortUrl,
  clickCount,
  createdDate,
  onDelete,
}) => {
  const { token } = useStoreContext();
  const navigate = useNavigate();

  // All state variables
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [analyticToggle, setAnalyticToggle] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedUrl, setSelectedUrl] = useState<string>("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);

  const subDomain = (import.meta.env.VITE_REACT_FRONT_END_URL || window.location.origin).replace(/^https?:\/\//, "");

  // Toggle analytics and trigger fetch
  const analyticsHandler = (url: string) => {
    if (!analyticToggle) {
      setSelectedUrl(url);
    }
    setAnalyticToggle(!analyticToggle);
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoader(true);
    try {
      const endDate = dayjs().format("YYYY-MM-DDTHH:mm:ss");
      const startDate = dayjs().subtract(30, "day").format("YYYY-MM-DDTHH:mm:ss");

      const { data } = await api.get<AnalyticsData[]>(
        `/api/urls/analytics/${selectedUrl}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setAnalyticsData(data);
      setSelectedUrl("");
    } catch (error) {
      console.error(error);
      navigate("/error");
    } finally {
      setLoader(false);
    }
  };

  // Fetch analytics when selectedUrl changes
  useEffect(() => {
    if (selectedUrl) {
      fetchAnalytics();
    }
  }, [selectedUrl]);

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  // Handle delete
  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this short link? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/api/urls/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      onDelete(id);
      toast.success("Short URL deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete short URL");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative bg-slate-50 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-300 overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* LEFT: URL INFO */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Link
                target="_blank"
                to={`/s/${shortUrl}`}
                className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors flex items-center gap-2 group/link"
              >
                {subDomain}/s/{shortUrl}
                <FaExternalLinkAlt className="text-xs text-slate-400 group-hover/link:text-blue-500 transition-colors" />
              </Link>
            </div>

            <div className="mb-4">
              <p className="text-slate-500 text-sm truncate max-w-lg font-medium">
                {originalUrl}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <MdOutlineAdsClick className="text-blue-500 text-sm" />
                <span>{clickCount} clicks</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <MdCalendarToday className="text-slate-400" />
                <span>{dayjs(createdDate).format("MMM DD, YYYY")}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 self-start lg:self-center flex-wrap">
            {/* Copy */}
            <CopyToClipboard
              text={`${import.meta.env.VITE_REACT_FRONT_END_URL || window.location.origin}/s/${shortUrl}`}
              onCopy={() => setIsCopied(true)}
            >
              <button
                className={`h-10 px-4 rounded-xl text-sm font-semibold border shadow-sm transition-all duration-200 flex items-center gap-2
                  ${isCopied
                    ? "bg-green-500 border-green-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-black hover:shadow-md"
                  }`}
                disabled={deleting}
              >
                {isCopied ? <IoCheckmark className="text-lg" /> : <IoCopyOutline className="text-lg" />}
                {isCopied ? "Copied" : "Copy"}
              </button>
            </CopyToClipboard>

            {/* Analytics */}
            <button
              onClick={() => analyticsHandler(shortUrl)}
              className={`h-10 px-4 rounded-xl text-sm font-semibold border shadow-sm transition-all duration-200 flex items-center gap-2
                ${analyticToggle
                  ? "bg-blue-600 border-blue-700 text-white shadow-inner"
                  : "bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
                }`}
              disabled={deleting}
            >
              <IoStatsChart className="text-lg" />
              Analytics
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="h-10 px-3 rounded-xl text-sm font-semibold border shadow-sm flex items-center gap-1.5 bg-white border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={deleting}
            >
              {deleting ? (
                <ImSpinner8 className="animate-spin text-sm" />
              ) : (
                <MdDeleteOutline className="text-base" />
              )}
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Drawer */}
      <AnimatePresence>
        {analyticToggle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white border-t border-slate-200 shadow-inner"
          >
            <div className="p-6">
              {loader ? (
                <div className="h-56 flex flex-col justify-center items-center gap-3">
                  <ImSpinner8 className="animate-spin text-2xl text-blue-500" />
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    Loading Data
                  </span>
                </div>
              ) : (
                <>
                  {analyticsData.length === 0 ? (
                    <div className="h-56 flex flex-col justify-center items-center text-center opacity-60">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
                        <IoStatsChart className="text-xl text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">No activity recorded yet</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-100 p-2">
                      <Graph graphData={analyticsData} />
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShortenItem;