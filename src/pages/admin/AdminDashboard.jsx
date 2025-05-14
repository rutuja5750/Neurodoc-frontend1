import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, FileText, Settings, Activity, Shield, 
  BarChart3, Building2, Globe2, AlertTriangle,
  Clock, TrendingUp, CheckCircle2, XCircle,
  TrendingDown, Link, Plus, ClipboardList, FileSearch
} from 'lucide-react';
import StudyManagement from './studies/StudyManagement';
import UserManagement from './users/UserManagement';
import ComplianceDashboard from './compliance/ComplianceDashboard';
import SystemSettings from './settings/SystemSettings';
import SiteManagement from './SiteManagement';
import SiteAssignmentManagement from '../../components/sites/SiteAssignmentManagement';
import ClinicalTrialsPage from '../clinical-trials/ClinicalTrialsPage';
import TMF_Viewer from '../tmf_viewer/TMFViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard metrics
  const metrics = {
    users: {
      total: 1247,
      active: 892,
      pending: 156,
      deactivated: 199,
      growth: 12.5
    },
    studies: {
      total: 86,
      active: 45,
      completed: 28,
      draft: 13,
      compliance: 98.2
    },
    documents: {
      total: 15234,
      pending: 234,
      approved: 14789,
      rejected: 211,
      processingTime: 2.3
    },
    system: {
      uptime: 99.99,
      activeUsers: 127,
      pendingTasks: 45,
      alerts: 2
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Neurodoc Admin Console</h1>
          <p className="text-muted-foreground">
            Manage your organization's eTMF system and monitor key metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            System Status: Operational
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-9 gap-4 bg-transparent h-auto p-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="studies"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="w-4 h-4 mr-2" />
            Studies
          </TabsTrigger>
          <TabsTrigger
            value="clinical-trials"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Clinical Trials
          </TabsTrigger>
          <TabsTrigger
            value="tmf-viewer"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileSearch className="w-4 h-4 mr-2" />
            TMF Viewer
          </TabsTrigger>
          <TabsTrigger
            value="facilities"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Facilities
          </TabsTrigger>
          <TabsTrigger
            value="sites"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Link className="w-4 h-4 mr-2" />
            Sites
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="compliance"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Shield className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStatCard
              title="Total Users"
              value={metrics.users.total}
              change={metrics.users.growth}
              icon={<Users className="w-4 h-4" />}
              details={[
                { label: 'Active', value: metrics.users.active },
                { label: 'Pending', value: metrics.users.pending },
                { label: 'Deactivated', value: metrics.users.deactivated }
              ]}
            />
            <QuickStatCard
              title="Active Studies"
              value={metrics.studies.total}
              change={8.3}
              icon={<FileText className="w-4 h-4" />}
              details={[
                { label: 'In Progress', value: metrics.studies.active },
                { label: 'Completed', value: metrics.studies.completed },
                { label: 'Draft', value: metrics.studies.draft }
              ]}
            />
            <QuickStatCard
              title="Document Processing"
              value={`${metrics.documents.processingTime}d`}
              change={-0.5}
              icon={<Activity className="w-4 h-4" />}
              details={[
                { label: 'Pending', value: metrics.documents.pending },
                { label: 'Approved', value: metrics.documents.approved },
                { label: 'Rejected', value: metrics.documents.rejected }
              ]}
            />
            <QuickStatCard
              title="System Health"
              value={`${metrics.system.uptime}%`}
              change={0.01}
              icon={<Globe2 className="w-4 h-4" />}
              details={[
                { label: 'Active Users', value: metrics.system.activeUsers },
                { label: 'Pending Tasks', value: metrics.system.pendingTasks },
                { label: 'Alerts', value: metrics.system.alerts }
              ]}
            />
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <ActivityList />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">System Alerts</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <AlertsList />
              </CardContent>
            </Card>
          </div>

          {/* Compliance Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Compliance Overview</h3>
                <Button variant="outline">Export Report</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ComplianceMetric
                  title="Document Compliance"
                  percentage={98.2}
                  trend="up"
                />
                <ComplianceMetric
                  title="User Training Status"
                  percentage={94.5}
                  trend="up"
                />
                <ComplianceMetric
                  title="Audit Readiness"
                  percentage={96.7}
                  trend="stable"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="studies">
          <StudyManagement />
        </TabsContent>

        <TabsContent value="clinical-trials">
          <Card>
            <CardContent className="p-6">
              <ClinicalTrialsPage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tmf-viewer">
          <Card>
            <CardContent className="p-6">
              <TMF_Viewer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities">
          <SiteManagement />
        </TabsContent>

        <TabsContent value="sites">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Site Assignments</h2>
                  <p className="text-muted-foreground">
                    Manage study-specific assignments of facilities and users
                  </p>
                </div>
              </div>
              <SiteAssignmentManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceDashboard />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Components
const QuickStatCard = ({ title, value, change, icon, details }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className={`p-2 rounded-full ${change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-muted-foreground">vs last month</span>
      </div>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{detail.label}</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ActivityList = () => (
  <div className="space-y-4">
    {[
      {
        icon: <Users className="w-4 h-4" />,
        action: "New user registration",
        details: "John Doe (Research Coordinator)",
        time: "5 minutes ago"
      },
      {
        icon: <FileText className="w-4 h-4" />,
        action: "Study protocol updated",
        details: "STUDY-2024-001",
        time: "1 hour ago"
      },
      // Add more activities...
    ].map((activity, index) => (
      <div key={index} className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          {activity.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">{activity.action}</p>
          <p className="text-sm text-muted-foreground">{activity.details}</p>
        </div>
        <span className="text-sm text-muted-foreground">{activity.time}</span>
      </div>
    ))}
  </div>
);

const AlertsList = () => (
  <div className="space-y-4">
    {[
      {
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        title: "Storage Usage Warning",
        message: "Storage capacity at 85%",
        time: "10 minutes ago"
      },
      {
        icon: <Clock className="w-4 h-4 text-blue-500" />,
        title: "Scheduled Maintenance",
        message: "System update scheduled for tonight",
        time: "2 hours ago"
      },
      // Add more alerts...
    ].map((alert, index) => (
      <div key={index} className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          {alert.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">{alert.title}</p>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <span className="text-sm text-muted-foreground">{alert.time}</span>
      </div>
    ))}
  </div>
);

const ComplianceMetric = ({ title, percentage, trend }) => (
  <div className="p-4 border rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium">{title}</h4>
      {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
      {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
      {trend === 'stable' && <TrendingStable className="w-4 h-4 text-yellow-500" />}
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold">{percentage}%</span>
      <span className="text-sm text-muted-foreground mb-1">compliant</span>
    </div>
  </div>
);

const TrendingStable = ({ className }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default AdminDashboard; 