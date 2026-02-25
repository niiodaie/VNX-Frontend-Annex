import React, { useState } from 'react';
import { useArtistSyncs, useRefreshArtistSync } from '@/hooks/use-artist-syncs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtistSync } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface RowProps {
  sync: ArtistSync;
  onManualRefresh: (id: number) => void;
  onViewDetails: (sync: ArtistSync) => void;
}

// Format the timestamp into a readable format
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Component for each row in the sync table
const SyncRow: React.FC<RowProps> = ({ sync, onManualRefresh, onViewDetails }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{sync.id}</TableCell>
      <TableCell>
        <Badge variant={sync.source === 'spotify' ? 'default' : 'outline'}>
          {sync.source}
        </Badge>
      </TableCell>
      <TableCell>{sync.sourceId.split(':').pop()}</TableCell>
      <TableCell>{sync.mentorId || '-'}</TableCell>
      <TableCell>
        <span className="flex items-center">
          {sync.syncStatus === 'success' && (
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
          )}
          {sync.syncStatus === 'pending' && (
            <Clock className="h-4 w-4 text-amber-500 mr-2" />
          )}
          {sync.syncStatus === 'failed' && (
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          )}
          {sync.syncStatus}
        </span>
      </TableCell>
      <TableCell>{formatTimestamp(sync.lastSynced)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => onManualRefresh(sync.id)}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => onViewDetails(sync)}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Details</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Loading skeleton for table rows
const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
  </TableRow>
);

// Main component
const ArtistSyncStatus: React.FC = () => {
  const [selectedSync, setSelectedSync] = useState<ArtistSync | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch all syncs
  const { data: syncs, isLoading, error, refetch } = useArtistSyncs();
  const { toast } = useToast();
  const refreshMutation = useRefreshArtistSync();

  // Handle manual refresh of a specific sync
  const handleManualRefresh = async (id: number) => {
    try {
      await refreshMutation.mutateAsync(id);
      toast({
        title: "Refresh triggered",
        description: "Artist sync refresh has been queued",
      });
    } catch (error: any) {
      console.error('Failed to refresh sync:', error);
      toast({
        title: "Refresh failed",
        description: error.message || "Could not refresh artist sync",
        variant: "destructive",
      });
    }
  };

  // Open the details dialog
  const handleViewDetails = (sync: ArtistSync) => {
    setSelectedSync(sync);
    setIsDetailsOpen(true);
  };

  // Filter syncs based on active tab
  const getFilteredSyncs = () => {
    if (!syncs || !Array.isArray(syncs)) return [];
    if (activeTab === "all") return syncs;
    return syncs.filter((sync: ArtistSync) => sync.syncStatus === activeTab);
  };

  // Check if there are any failed syncs
  const hasFailedSyncs = syncs && Array.isArray(syncs) && syncs.some((sync: ArtistSync) => sync.syncStatus === 'failed');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Artist Data Sync Status</h2>
        <Button onClick={() => refetch()} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {hasFailedSyncs && (
        <div className="p-4 mb-4 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
            <p className="text-sm text-amber-700 dark:text-amber-200">
              Some sync operations have failed. Check the details and try manual refresh.
            </p>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {error ? (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-200">
                Failed to load sync data. Please try again.
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>List of artist data sync operations</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Source ID</TableHead>
                  <TableHead>Mentor ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Show loading skeletons
                  Array(5).fill(0).map((_, index) => <SkeletonRow key={index} />)
                ) : getFilteredSyncs().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No sync operations found
                    </TableCell>
                  </TableRow>
                ) : (
                  // Render actual data
                  getFilteredSyncs().map((sync: ArtistSync) => (
                    <SyncRow 
                      key={sync.id} 
                      sync={sync} 
                      onManualRefresh={handleManualRefresh}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sync Details - ID: {selectedSync?.id}</DialogTitle>
            <DialogDescription>
              {selectedSync?.source} source for ID: {selectedSync?.sourceId}
            </DialogDescription>
          </DialogHeader>

          {selectedSync && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <Badge 
                    className={
                      selectedSync.syncStatus === 'success' ? 'bg-green-500' : 
                      selectedSync.syncStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  >
                    {selectedSync.syncStatus}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Priority</h4>
                  <span>{selectedSync.priority}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Sync Interval</h4>
                  <span>{selectedSync.syncInterval}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Last Synced</h4>
                  <span>{formatTimestamp(selectedSync.lastSynced)}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Created At</h4>
                  <span>{formatTimestamp(selectedSync.createdAt)}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Linked Mentor</h4>
                  <span>{selectedSync.mentorId || 'Not linked'}</span>
                </div>
              </div>
              
              {selectedSync.syncError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <h4 className="text-sm font-medium mb-1 text-red-700 dark:text-red-300">Error</h4>
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {selectedSync.syncError}
                  </p>
                </div>
              )}
              
              {selectedSync.rawData && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Raw API Data</h4>
                  <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(JSON.parse(selectedSync.rawData), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {selectedSync && (
              <Button 
                onClick={() => handleManualRefresh(selectedSync.id)}
                className="mr-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Manual Refresh
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistSyncStatus;