import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { urlAPI } from '../utils/api';

const COLORS = ['#1a472a', '#2d8659', '#4caf50', '#81c784', '#a5d6a7'];

const Analytics = () => {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => urlAPI.getUserStats().then((res) => res.data),
  });

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

  const totalUrls = userStats?.total_urls || 0;
  const totalActiveUrls = userStats?.total_active_urls || 0;
  const totalVisits = userStats?.total_visits || 0;
  const quotaUsed = userStats?.quota_used || 0;
  const quotaLimit = userStats?.quota_limit || 100;

  // Calculate derived metrics
  const inactiveUrls = totalUrls - totalActiveUrls;
  const averageVisitsPerUrl = totalUrls > 0 ? (totalVisits / totalUrls).toFixed(1) : 0;
  const quotaUsagePercentage = quotaLimit > 0 ? (quotaUsed / quotaLimit) * 100 : 0;
  const remainingQuota = quotaLimit - quotaUsed;

  // Data for charts
  const urlStatusData = [
    { name: 'Active URLs', value: totalActiveUrls, color: '#4caf50' },
    { name: 'Inactive URLs', value: inactiveUrls, color: '#ff9800' },
  ];

  const quotaData = [
    { name: 'Used', value: quotaUsed, color: '#2d8659' },
    { name: 'Remaining', value: remainingQuota, color: '#e0e0e0' },
  ];

  const statsData = [
    { name: 'Total URLs', value: totalUrls },
    { name: 'Active URLs', value: totalActiveUrls },
    { name: 'Total Visits', value: totalVisits },
    { name: 'Quota Used', value: quotaUsed },
  ];

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
            sx={{ 
              fontWeight: 700,
              color: '#1a472a',
              mb: 4,
              textAlign: 'center'
            }}
          >
            Analytics Dashboard
          </Typography>

          {/* Main Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total URLs
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#1a472a', fontWeight: 700 }}>
                    {totalUrls}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Active URLs
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 700 }}>
                    {totalActiveUrls}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Visits
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#2d8659', fontWeight: 700 }}>
                    {totalVisits.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Visits/URL
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#1a472a', fontWeight: 700 }}>
                    {averageVisitsPerUrl}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quota Usage Card */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#1a472a', mb: 2 }}>
                    Quota Usage
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ color: '#2d8659', fontWeight: 600, mr: 2 }}>
                      {quotaUsed} / {quotaLimit}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      ({quotaUsagePercentage.toFixed(1)}% used)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={quotaUsagePercentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: quotaUsagePercentage > 80 ? '#f44336' : '#2d8659',
                        borderRadius: 5,
                      },
                    }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {remainingQuota} URLs remaining
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* URL Status Distribution */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  URL Status Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={urlStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {urlStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Quota Usage Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Quota Usage Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={quotaData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {quotaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Stats Overview Bar Chart */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a472a' }}>
                  Statistics Overview
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2d8659" />
                  </BarChart>
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
