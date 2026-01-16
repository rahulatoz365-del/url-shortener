import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Tooltip } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { MdLink } from 'react-icons/md';
import { ImSpinner8 } from 'react-icons/im';
import toast from 'react-hot-toast';

import { useStoreContext } from '../../contextApi/ContextApi';
import TextField from '../TextField';
import api from '../../api/api';
import { ShortUrl } from '../../hooks/useQuery';

interface CreateNewShortenProps {
  setOpen: (open: boolean) => void;
  onCreated: (newUrl: ShortUrl) => void; // ✅ callback
}

interface CreateUrlFormData {
  originalUrl: string;
}

interface CreateShortUrlResponse {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
  username: string;
}

const CreateNewShorten: React.FC<CreateNewShortenProps> = ({ setOpen, onCreated }) => {
  const { token } = useStoreContext();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUrlFormData>({
    defaultValues: {
      originalUrl: "",
    },
    mode: "onTouched",
  });

  const createShortUrlHandler: SubmitHandler<CreateUrlFormData> = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await api.post<CreateShortUrlResponse>("/api/urls/shorten", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const frontendUrl = import.meta.env.VITE_REACT_FRONT_END_URL;
      const shortenUrl = `${frontendUrl}/s/${res.shortUrl}`;

      await navigator.clipboard.writeText(shortenUrl);

      toast.success("Link created & copied!", {
        position: "bottom-center",
        className: "font-sans font-medium",
        duration: 3000,
      });

      // ✅ Build the ShortUrl object and pass it to the parent
      const newItem: ShortUrl = {
        id: res.id,
        originalUrl: res.originalUrl,
        shortUrl: res.shortUrl,
        clickCount: res.clickCount,
        createdDate: res.createdDate,
      };

      // ✅ Call the callback to add it to the dashboard list immediately
      onCreated(newItem);

      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 w-full max-w-md relative mx-4 shadow-xl border border-slate-100">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
        <MdLink className="text-2xl" />
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Shorten a new link
        </h1>
        <p className="text-slate-500 text-sm">
          Paste a long URL below to generate a trackable, short link instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit(createShortUrlHandler)} className="flex flex-col gap-6">
        <TextField
          label="Destination URL"
          required
          id="originalUrl"
          placeholder="https://example.com/your-long-url"
          type="url"
          message="Please enter a valid URL"
          register={register}
          errors={errors}
          className="w-full"
        />

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-slate-900 text-white font-medium text-lg py-3.5 rounded-xl hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <ImSpinner8 className="animate-spin text-xl" />
              <span>Creating...</span>
            </>
          ) : (
            "Create Short Link"
          )}
        </button>
      </form>

      {!loading && (
        <Tooltip title="Close">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors duration-200"
            type="button"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default CreateNewShorten;