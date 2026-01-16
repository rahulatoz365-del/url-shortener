import React, { useState, useEffect } from 'react';
import { FaPlus, FaLink, FaChartBar, FaMousePointer } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Graph from './Graph';
import ShortenPopUp from './ShortenPopUp';
import ShortenUrlList from './ShortenUrlList';
import Loader from '../Loader';

import { useStoreContext } from '../../contextApi/ContextApi';
import { useFetchMyShortUrls, useFetchTotalClicks, type ShortUrl } from '../../hooks/useQuery';

const DashboardLayout: React.FC = () => {
  const { token } = useStoreContext();
  const navigate = useNavigate();
  const [shortenPopUp, setShortenPopUp] = useState<boolean>(false);

  // Local state to hold the displayed URLs
  const [displayUrls, setDisplayUrls] = useState<ShortUrl[]>([]);

  const onError = () => {
    navigate("/error");
  };

  const {
    isLoading: isLoadingMyUrls,
    data: myShortenUrls,
  } = useFetchMyShortUrls(token, onError);

  const {
    isLoading: isLoadingClicks,
    data: totalClicks,
  } = useFetchTotalClicks(token, onError);

  // Sync local state with React Query data
  useEffect(() => {
    if (myShortenUrls) {
      console.log("📦 Syncing displayUrls with", myShortenUrls.length, "items");
      setDisplayUrls([...myShortenUrls]);
    }
  }, [myShortenUrls]);

  // Function to add a new URL to the local list immediately
  const addNewUrl = (newUrl: ShortUrl) => {
    console.log("➕ Adding new URL to displayUrls:", newUrl);
    setDisplayUrls(prev => [newUrl, ...prev]);
  };

  // Function to remove a URL from the local list immediately
  const removeUrl = (id: number) => {
    console.log("🗑️ Removing URL from displayUrls:", id);
    setDisplayUrls(prev => prev.filter(url => url.id !== id));
  };

  // Calculate stats from displayUrls
  const totalUrlsCount = displayUrls.length;
  const totalClicksCount = displayUrls.reduce((sum, url) => sum + url.clickCount, 0);
  const avgClicksPerUrl = totalUrlsCount > 0 ? (totalClicksCount / totalUrlsCount).toFixed(1) : "0";

  return (
    <div className="bg-slate-50 min-h-screen pt-24 lg:px-14 sm:px-8 px-4 pb-10">
      {isLoadingClicks || isLoadingMyUrls ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader />
        </div>
      ) : (
        <div className="lg:w-[90%] w-full mx-auto">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8"
          >
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-2 text-sm sm:text-base">
                Visualize your data and manage your links.
              </p>
            </div>

            <button
              onClick={() => setShortenPopUp(true)}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 self-start sm:self-auto"
            >
              <FaPlus className="text-sm" />
              Create New Link
            </button>
          </motion.div>

          {/* STATS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {/* Total URLs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaLink className="text-xl text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total URLs</p>
                  <p className="text-2xl font-bold text-slate-800">{totalUrlsCount}</p>
                </div>
              </div>
            </div>

            {/* Total Clicks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FaMousePointer className="text-xl text-green-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Clicks</p>
                  <p className="text-2xl font-bold text-slate-800">{totalClicksCount}</p>
                </div>
              </div>
            </div>

            {/* Average Clicks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FaChartBar className="text-xl text-purple-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Avg. Clicks/URL</p>
                  <p className="text-2xl font-bold text-slate-800">{avgClicksPerUrl}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GRAPH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Click Analytics (Last 30 Days)
            </h2>

            {totalClicks && totalClicks.length > 0 ? (
              <div className="h-[350px] w-full">
                <Graph graphData={totalClicks} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FaChartBar className="text-5xl mb-4 opacity-30" />
                <p className="text-lg font-medium text-slate-600">No click data yet</p>
                <p className="text-sm text-slate-400">
                  Analytics will appear here once your links start getting clicks
                </p>
              </div>
            )}
          </motion.div>

          {/* LIST */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Links</h2>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {displayUrls.length}
              </span>
            </div>

            {displayUrls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <FaLink className="text-slate-300 text-2xl" />
                </div>
                <h3 className="text-slate-800 font-semibold text-lg mb-2">
                  No links created yet
                </h3>
                <p className="text-slate-500 text-center max-w-sm mb-6 text-sm">
                  Create your first shortened URL to start tracking clicks and engagement.
                </p>
                <button
                  onClick={() => setShortenPopUp(true)}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  + Create your first link
                </button>
              </div>
            ) : (
              <ShortenUrlList data={displayUrls} onDelete={removeUrl} />
            )}
          </motion.div>
        </div>
      )}

      {/* Modal for creating new links */}
      <ShortenPopUp
        open={shortenPopUp}
        setOpen={setShortenPopUp}
        onCreated={addNewUrl}
      />
    </div>
  );
};

export default DashboardLayout;