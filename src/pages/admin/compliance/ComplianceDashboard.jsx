import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  FileCheck,
  Users,
  AlertTriangle,
  Download,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ComplianceDashboard = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Compliance & Audit</h2>
          <p className="text-muted-foreground">
            Monitor regulatory compliance and audit readiness
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-50">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Compliance</p>
                <h3 className="text-2xl font-bold">98.2%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Document Compliance</p>
                <h3 className="text-2xl font-bold">96.5%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-50">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Training Compliance</p>
                <h3 className="text-2xl font-bold">94.8%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Issues */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Compliance Issues</h3>
          <div className="space-y-4">
            {[
              {
                icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
                issue: "Missing signatures on Protocol v2.1",
                status: "Pending",
                priority: "High",
                dueDate: "2024-03-15"
              },
              {
                icon: <Clock className="w-4 h-4 text-blue-500" />,
                issue: "Training certificates expiring",
                status: "In Progress",
                priority: "Medium",
                dueDate: "2024-03-20"
              },
              {
                icon: <CheckCircle className="w-4 h-4 text-green-500" />,
                issue: "SOP review completion",
                status: "Resolved",
                priority: "Low",
                dueDate: "2024-03-10"
              }
            ].map((issue, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="p-2 rounded-full bg-primary/10">
                  {issue.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{issue.issue}</p>
                  <p className="text-sm text-muted-foreground">
                    Due: {issue.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    issue.status === 'Resolved' 
                      ? 'bg-green-100 text-green-800'
                      : issue.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {issue.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    issue.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : issue.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {issue.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audit Trail</h3>
          <div className="space-y-4">
            {[
              {
                action: "Document Access",
                user: "John Doe",
                timestamp: "2024-03-12 14:30",
                details: "Accessed Protocol v2.1"
              },
              {
                action: "Permission Change",
                user: "Admin",
                timestamp: "2024-03-12 13:15",
                details: "Updated user role permissions"
              },
              {
                action: "System Update",
                user: "System",
                timestamp: "2024-03-12 12:00",
                details: "Automated compliance check completed"
              }
            ].map((entry, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.details}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{entry.user}</p>
                  <p className="text-sm text-muted-foreground">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDashboard; 