"use client";

import { Card, CardHeader, CardTitle, CardContent, LineChart, BarChart, PieChart, Typography } from 'intracom-ui';

const hourlyData = [
  { time: '00:00', chats: 12 },
  { time: '04:00', chats: 8 },
  { time: '08:00', chats: 45 },
  { time: '12:00', chats: 67 },
  { time: '16:00', chats: 54 },
  { time: '20:00', chats: 32 },
];

const categoryData = [
  { name: 'Support', value: 400 },
  { name: 'Sales', value: 300 },
  { name: 'Technical', value: 200 },
  { name: 'Billing', value: 100 },
];

const dailyData = [
  { day: 'Mon', active: 120, closed: 80 },
  { day: 'Tue', active: 150, closed: 90 },
  { day: 'Wed', active: 180, closed: 110 },
  { day: 'Thu', active: 140, closed: 70 },
  { day: 'Fri', active: 200, closed: 130 },
  { day: 'Sat', active: 90, closed: 40 },
  { day: 'Sun', active: 70, closed: 30 },
];

export function StatsView() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <Typography variant="h2" className="mb-2">Analytics Overview</Typography>
          <Typography variant="muted">Monitor your chat performance and user engagement</Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle>Chat Volume (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={hourlyData} dataKeyX="time" dataKeyY="chats" height={200} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle>Conversation Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={categoryData} nameKey="name" dataKey="value" height={200} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={dailyData} dataKeyX="day" dataKeyY="active" height={200} />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-0">
          <CardHeader>
            <CardTitle>Weekly Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={dailyData} dataKeyX="day" dataKeyY="active" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
