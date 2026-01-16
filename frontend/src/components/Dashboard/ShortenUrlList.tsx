import React from 'react';
import { motion } from 'framer-motion';
import ShortenItem from './ShortenItem';

export interface ShortenUrlItem {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
}

interface ShortenUrlListProps {
  data: ShortenUrlItem[];
  onDelete: (id: number) => void; // ✅ delete callback
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 }
  }
};

const ShortenUrlList: React.FC<ShortenUrlListProps> = ({ data, onDelete }) => {
  return (
    <motion.div
      className='my-8 flex flex-col gap-5'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {data.map((item) => (
        <motion.div key={item.id} variants={itemVariants} layout>
          <ShortenItem {...item} onDelete={onDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ShortenUrlList;