import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { urlAPI } from '../utils/api';

const QRCodeModal = ({ open, onClose, shortUrl }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!shortUrl) return;
      
      setLoading(true);
      setError('');
      try {
        // Extract the short code from the URL
        const shortCode = shortUrl.split('/').pop();
        console.log('Fetching QR code for:', shortCode);

        // Make the API request
        const response = await urlAPI.getQRCode(shortCode);
        console.log('API Response:', response);

        // Check if response is valid
        if (!response || !response.data) {
          throw new Error('Invalid response from server');
        }

        // Create blob from response data
        const blob = new Blob([response.data], { type: 'image/png' });
        console.log('Created blob:', blob);

        // Create object URL from blob
        const imageUrl = URL.createObjectURL(blob);
        console.log('Created image URL:', imageUrl);
        
        setQrCode(imageUrl);
      } catch (err) {
        console.error('QR Code generation error:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        });
        setError(err.response?.data?.message || 'Failed to generate QR code. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchQRCode();
    }

    // Cleanup function to revoke the object URL when the component unmounts
    return () => {
      if (qrCode) {
        URL.revokeObjectURL(qrCode);
      }
    };
  }, [open, shortUrl]);

  const handleDownload = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qrcode-${shortUrl.split('/').pop()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
        color: 'white',
      }}>
        QR Code
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 3,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress sx={{ color: '#1a472a' }} />
              <Typography color="text.secondary">Generating QR Code...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', color: 'error.main' }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error
              </Typography>
              <Typography>{error}</Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setLoading(true);
                  setError('');
                  fetchQRCode();
                }}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ 
                    width: '200px', 
                    height: '200px',
                    display: 'block',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Scan this QR code to visit the shortened URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {shortUrl}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleCopy}
                  sx={{ 
                    color: copied ? '#2d8659' : 'text.secondary',
                    transition: 'color 0.2s',
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#1a472a',
            color: '#1a472a',
            '&:hover': {
              borderColor: '#2d8659',
              backgroundColor: 'rgba(26, 71, 42, 0.04)',
            },
          }}
        >
          Close
        </Button>
        {qrCode && (
          <Button 
            onClick={handleDownload} 
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{
              background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
              },
            }}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeModal; 