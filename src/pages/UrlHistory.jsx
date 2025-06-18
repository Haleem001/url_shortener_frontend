import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  QrCode as QrCodeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { urlAPI } from '../utils/api';
import QRCodeModal from '../components/QRCodeModal';

const UrlHistory = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState({ original_url: '', custom_code: '' });
  const queryClient = useQueryClient();

  const { data: urls, isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: () => urlAPI.getUrls().then((res) => res.data),
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

  const updateMutation = useMutation({
    mutationFn: (data) => urlAPI.updateUrl(data.shortCode, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['urls']);
      setSuccess('URL updated successfully!');
      setEditDialog(false);
    },
    onError: (error) => {
      setError(error.response?.data?.detail || 'Failed to update URL');
    },
  });

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setSuccess('URL copied to clipboard!');
  };

  const handleDelete = (shortCode) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      deleteMutation.mutate(shortCode);
    }
  };

  const handleEdit = (url) => {
    setEditData({
      shortCode: url.short_code,
      original_url: url.original_url,
      custom_code: url.short_code,
    });
    setEditDialog(true);
  };

  const handleUpdate = () => {
    updateMutation.mutate(editData);
  };

  const handleShowQRCode = (url) => {
    setSelectedUrl(url);
    setShowQRCode(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a472a 0%, #2d8659 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontWeight: 700,
              color: '#1a472a',
            }}
          >
            URL History
          </Typography>

          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: '#1a472a' }}>Original URL</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a472a' }}>Short URL</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a472a' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1a472a' }}>Visits</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#1a472a' }}>Actions</TableCell>
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
                          sx={{ 
                            color: '#2d8659',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {url.original_url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component="a"
                            href={`${window.location.origin}/${url.short_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: '#2d8659',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {url.short_url}
                          </Typography>
                          <Tooltip title="Copy">
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(url.short_url)}
                              sx={{ color: '#2d8659' }}
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
                        <Tooltip title="QR Code">
                          <IconButton
                            size="small"
                            onClick={() => handleShowQRCode(url.short_url)}
                            sx={{ color: '#2d8659' }}
                          >
                            <QrCodeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(url)}
                            sx={{ color: '#2d8659' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(url.short_code)}
                            sx={{ color: '#2d8659' }}
                          >
                            <DeleteIcon fontSize="small" />
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

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle sx={{ color: '#1a472a', fontWeight: 600 }}>Edit URL</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              fullWidth
              label="Original URL"
              value={editData.original_url}
              onChange={(e) => setEditData({ ...editData, original_url: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2d8659',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Custom Code"
              value={editData.custom_code}
              onChange={(e) => setEditData({ ...editData, custom_code: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2d8659',
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setEditDialog(false)}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #1a472a 30%, #2d8659 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2d8659 30%, #1a472a 90%)',
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert 
            severity="success" 
            onClose={() => setSuccess('')}
            sx={{
              borderRadius: 2,
              backgroundColor: '#2d8659',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white',
              },
            }}
          >
            {success}
          </Alert>
        </Snackbar>

        {showQRCode && (
          <QRCodeModal
            open={showQRCode}
            onClose={() => setShowQRCode(false)}
           shortUrl={selectedUrl}
          />
        )}
      </Container>
    </Box>
  );
};

export default UrlHistory; 