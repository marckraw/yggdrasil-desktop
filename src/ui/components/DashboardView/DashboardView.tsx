import React from "react";

export const DashboardView = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Cards */}
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-2">Total Conversations</h3>
          <p className="text-3xl font-bold">24</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-2">Messages Today</h3>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-2">Active Models</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
};
