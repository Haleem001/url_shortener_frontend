import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { urlAPI } from '../utils/api';

const COLORS = ['#1a472a', '#2d8659', '#4caf50', '#81c784', '#a5d6a7'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => urlAPI.getAnalytics(timeRange).then((res) => res.data),
  });

  const totalClicks = analytics?.total_clicks || 0;
  const uniqueVisitors = analytics?.unique_visitors || 0;
  const averageClicks = analytics?.average_clicks || 0;
  const topUrls = analytics?.top_urls || [];
  const clicksByDay = analytics?.clicks_by_day || [];
  const clicksByCountry = analytics?.clicks_by_country || [];
  const clicksByDevice = analytics?.clicks_by_device || [];

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a472a 0%, #2d8659 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#1a472a',
              }}
            >
              Analytics Dashboard
            </Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2d8659',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a472a',
                  },
                }}
              >
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Clicks
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1a472a', fontWeight: 600 }}>
                    {totalClicks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Unique Visitors
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1a472a', fontWeight: 600 }}>
                    {uniqueVisitors}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Average Clicks per URL
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#1a472a', fontWeight: 600 }}>
                    {averageClicks.toFixed(1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Clicks Over Time
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clicksByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#2d8659"
                      strokeWidth={2}
                      dot={{ fill: '#1a472a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Top URLs
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topUrls}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="short_code" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#2d8659" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Clicks by Country
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clicksByCountry}
                      dataKey="clicks"
                      nameKey="country"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {clicksByCountry.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Clicks by Device
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clicksByDevice}
                      dataKey="clicks"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {clicksByDevice.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Analytics; 