import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  TrendingUp,
  Filter,
  Search,
  Bell,
  Shield,
  Activity,
  GitBranch,
  MessageSquare,
  Star,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

function HomePage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const kpiMetrics = [
    {
      title: "Document Compliance",
      value: "98.5%",
      change: "+2.3%",
      trend: "up",
      description: "Documents meeting regulatory requirements",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
    },
    {
      title: "Review Time",
      value: "2.3 days",
      change: "-0.5 days",
      trend: "down",
      description: "Average document review time",
      icon: <Clock className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Active Trials",
      value: "12",
      change: "+2",
      trend: "up",
      description: "Currently managed trials",
      icon: <Users className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Document Volume",
      value: "2,458",
      change: "+156",
      trend: "up",
      description: "Total documents in system",
      icon: <FileText className="w-5 h-5 text-orange-500" />
    }
  ];

  const recentActivities = [
    {
      type: "Document Review",
      title: "Protocol Amendment v2.1",
      status: "Pending",
      time: "2 hours ago",
      user: "Dr. Sarah Johnson",
      priority: "High"
    },
    {
      type: "Document Upload",
      title: "Safety Report Q2 2024",
      status: "Completed",
      time: "4 hours ago",
      user: "John Smith",
      priority: "Medium"
    },
    {
      type: "Approval",
      title: "Informed Consent Form",
      status: "Approved",
      time: "1 day ago",
      user: "Dr. Michael Brown",
      priority: "Low"
    }
  ];

  const upcomingTasks = [
    {
      title: "Protocol Review",
      dueDate: "2024-03-25",
      priority: "High",
      status: "Pending",
      assignee: "Dr. Sarah Johnson"
    },
    {
      title: "Safety Report Submission",
      dueDate: "2024-03-28",
      priority: "Medium",
      status: "In Progress",
      assignee: "John Smith"
    },
    {
      title: "Regulatory Submission",
      dueDate: "2024-04-01",
      priority: "High",
      status: "Not Started",
      assignee: "Dr. Michael Brown"
    }
  ];

  const documentStatus = [
    { status: "Approved", count: 1250, color: "bg-green-500" },
    { status: "Pending Review", count: 450, color: "bg-yellow-500" },
    { status: "In Revision", count: 280, color: "bg-blue-500" },
    { status: "Rejected", count: 120, color: "bg-red-500" }
  ];

  const documentHealthScores = [
    { category: "Compliance", score: 95, trend: "up", details: "All regulatory requirements met" },
    { category: "Completeness", score: 88, trend: "down", details: "Missing 2 required sections" },
    { category: "Accuracy", score: 92, trend: "up", details: "Data validation passed" },
    { category: "Timeliness", score: 85, trend: "up", details: "On track with deadlines" }
  ];

  const teamCollaboration = {
    activeUsers: 12,
    pendingReviews: 8,
    completedReviews: 45,
    averageResponseTime: "2.3 hours",
    topContributors: [
      { name: "Dr. Sarah Johnson", contributions: 28, role: "Lead Reviewer" },
      { name: "John Smith", contributions: 24, role: "Medical Writer" },
      { name: "Dr. Michael Brown", contributions: 21, role: "Clinical Lead" }
    ]
  };

  const complianceTrends = [
    { month: "Jan", compliance: 92, audits: 5 },
    { month: "Feb", compliance: 94, audits: 6 },
    { month: "Mar", compliance: 96, audits: 7 },
    { month: "Apr", compliance: 98, audits: 8 }
  ];

  const workflowStages = [
    { stage: "Draft", count: 45, status: "active" },
    { stage: "Review", count: 28, status: "active" },
    { stage: "Approval", count: 15, status: "active" },
    { stage: "Final", count: 32, status: "completed" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section with Search and Notifications */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back to NeuroDoc</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="flex gap-4">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">
                {metric.icon}
              </div>
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.title}</p>
            <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Document Health Score Section */}
      <Card className="mb-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Document Health Score</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {documentHealthScores.map((score, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{score.category}</h3>
                <span className={`text-sm ${
                  score.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {score.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{score.score}%</div>
              <p className="text-sm text-gray-600">{score.details}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow Status Timeline */}
      <Card className="mb-8 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Workflow Status</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200"></div>
          <div className="relative flex justify-between">
            {workflowStages.map((stage, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  stage.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <span className="text-lg font-bold">{stage.count}</span>
                </div>
                <span className="text-sm font-medium">{stage.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Grid with Enhanced Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Team Collaboration Overview */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Team Collaboration</h2>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4 mr-2" />
              View Team
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold">{teamCollaboration.activeUsers}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-xl font-bold">{teamCollaboration.pendingReviews}</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Top Contributors</h3>
              <div className="space-y-2">
                {teamCollaboration.topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-xs text-gray-600">{contributor.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{contributor.contributions}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Document Status */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Document Status</h2>
            <Button variant="ghost" size="sm">View Details</Button>
          </div>
          <div className="space-y-4">
            {documentStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm">{item.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.count}</span>
                  <span className="text-xs text-gray-500">
                    ({((item.count / 2100) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              {documentStatus.map((item, index) => (
                <div
                  key={index}
                  className={`h-full ${item.color}`}
                  style={{ width: `${(item.count / 2100) * 100}%` }}
                ></div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Compliance Trends</h2>
            <div className="flex gap-2">
              <Button 
                variant={selectedTimeRange === 'week' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedTimeRange('week')}
              >
                Week
              </Button>
              <Button 
                variant={selectedTimeRange === 'month' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedTimeRange('month')}
              >
                Month
              </Button>
              <Button 
                variant={selectedTimeRange === 'year' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSelectedTimeRange('year')}
              >
                Year
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-end gap-4">
            {complianceTrends.map((trend, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col gap-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(trend.compliance / 100) * 100}%` }}
                  ></div>
                  <div 
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${(trend.audits / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm mt-2">{trend.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Compliance %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Audits</span>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.type}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    activity.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <span>{activity.user}</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Tasks Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {upcomingTasks.map((task, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                <span>Assigned to: {task.assignee}</span>
                <span className={`${
                  task.status === 'Pending' ? 'text-yellow-600' :
                  task.status === 'In Progress' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default HomePage
