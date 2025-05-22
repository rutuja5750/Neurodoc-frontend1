import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Shield,
  Mail,
  Database,
  Cloud,
  Bell,
  Key
} from 'lucide-react';

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all users
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password Expiry</p>
                  <p className="text-sm text-muted-foreground">
                    Force password reset every 90 days
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Email Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1.5">SMTP Server</p>
                <Input placeholder="smtp.example.com" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1.5">SMTP Port</p>
                <Input placeholder="587" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Backup & Recovery</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automated Backups</p>
                  <p className="text-sm text-muted-foreground">
                    Daily system backup at 00:00 UTC
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <Button variant="outline" className="w-full">
                Manual Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Integrations</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Access</p>
                  <p className="text-sm text-muted-foreground">
                    Enable external API access
                  </p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <Button variant="outline" className="w-full">
                Manage API Keys
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings; 