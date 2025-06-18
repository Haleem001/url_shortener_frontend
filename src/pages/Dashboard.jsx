import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Grid,
  Chip,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { urlAPI } from '../utils/api';
import QRCodeModal from '../components/QRCodeModal';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const queryClient = useQueryClient();

  const { data: urls, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: () => urlAPI.getUrls().then((res) => res.data),
  });

  const shortenMutation = useMutation({
    mutationFn: (data) => urlAPI.shorten(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['urls']);
      setShortenedUrl(response.data.short_url); // This should match LandingPage
      setUrl('');
      setCustomCode('');
      setError('');
      setSuccess('URL shortened successfully!');
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to shorten URL');
      setShortenedUrl('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (shortCode) => urlAPI.deleteUrl(shortCode),
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      setSuccess('URL deleted successfully!');
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to delete URL');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl(''); // Clear previous result

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    shortenMutation.mutate({
      original_url: url,
      custom_code: customCode || undefined,
    });
  };

  const handleCopy = (shortUrl = shortenedUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setSuccess('URL copied to clipboard!');
  };

  const handleDelete = (shortCode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteMutation.mutate(shortCode);
    }
  };

  const handleShowQRCode = (url) => {
    setSelectedUrl(url);
    setShowQRCode(true);
  };

  return (
    <Box>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Shorten a URL
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={!!error}
                helperText={error}
                required
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Custom Code (optional)"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="Enter custom code"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={shortenMutation.isLoading}
                sx={{ height: '56px' }}
              >
                {shortenMutation.isLoading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </Grid>
          </Grid>

          {/* Shortened URL display - moved inside the form Paper */}
          {shortenedUrl && (
            <Box 
              sx={{ 
                mt: 3, 
                p: 3, 
                bgcolor: 'rgba(45, 134, 89, 0.1)', 
                borderRadius: 2, 
                width: '100%',
                border: '1px solid rgba(45, 134, 89, 0.2)',
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#1a472a', fontWeight: 600 }}>
                Your shortened URL:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  component="a"
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    flexGrow: 1, 
                    color: '#2d8659', 
                    textDecoration: 'none', 
                    wordBreak: 'break-all',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {shortenedUrl}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={() => handleCopy(shortenedUrl)} size="small" sx={{ color: '#2d8659' }}>
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="QR Code">
                  <IconButton onClick={() => handleShowQRCode(shortenedUrl)} size="small" sx={{ color: '#2d8659' }}>
                    <QrCodeIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Your URLs
        </Typography>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Visits</TableCell>
                  <TableCell align="right">View QR code</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls?.map((url) => (
                  <TableRow key={url.short_code}>
                    <TableCell>
                      <Typography
                        component="a"
                        href={url.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                      >
                        {url.original_url}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          component="a"
                          href={url.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: 'primary.main', textDecoration: 'none' }}
                        >
                          {url.short_url}
                        </Typography>
                        <Tooltip title="Copy">
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(url.short_url)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(url.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                     {url.visit_count}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Analytics">
                       
                      </Tooltip>
                      <Tooltip title="QR Code">
                        <IconButton
                          size="small"
                          onClick={() => handleShowQRCode(url.short_url)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                     
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <QRCodeModal
        open={showQRCode}
        onClose={() => setShowQRCode(false)}
        shortUrl={selectedUrl}
      />
    </Box>
  );
};

export default Dashboard;
