import React from 'react';
import Modal from '@mui/material/Modal';
import { Backdrop, Fade } from '@mui/material';
import CreateNewShorten from './CreateNewShorten';
import { ShortUrl } from '../../hooks/useQuery';

interface ShortenPopUpProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated: (newUrl: ShortUrl) => void; // ✅ callback for new URL
}

const ShortenPopUp: React.FC<ShortenPopUpProps> = ({ open, setOpen, onCreated }) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-shorturl-modal"
      aria-describedby="modal-to-create-new-short-url"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          style: { backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }
        },
      }}
    >
      <Fade in={open}>
        <div className='flex justify-center items-center h-full w-full p-4 outline-none'>
          <div className="outline-none focus:outline-none w-full max-w-md">
            <CreateNewShorten setOpen={setOpen} onCreated={onCreated} />
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ShortenPopUp;