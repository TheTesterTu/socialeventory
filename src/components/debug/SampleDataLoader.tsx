
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Upload, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

export const SampleDataLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) {
      toast.error('Please select a CSV file and sign in');
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      return;
    }

    setIsUploading(true);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have headers and at least one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const events = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length < headers.length) continue;

        const event: any = { created_by: user.id };
        
        headers.forEach((header, index) => {
          const value = values[index];
          
          switch (header) {
            case 'category':
            case 'tags':
            case 'accessibility_languages':
              try {
                event[header === 'accessibility_languages' ? 'accessibility' : header] = 
                  header === 'accessibility_languages' 
                    ? { languages: JSON.parse(value), wheelchairAccessible: false, familyFriendly: true }
                    : JSON.parse(value);
              } catch {
                event[header] = [value];
              }
              break;
            case 'accessibility_wheelchairAccessible':
              event.accessibility = { 
                ...event.accessibility, 
                wheelchairAccessible: value.toLowerCase() === 'true' 
              };
              break;
            case 'accessibility_familyFriendly':
              event.accessibility = { 
                ...event.accessibility, 
                familyFriendly: value.toLowerCase() === 'true' 
              };
              break;
            case 'pricing_isFree':
              event.pricing = { 
                ...event.pricing, 
                isFree: value.toLowerCase() === 'true',
                currency: 'USD'
              };
              break;
            case 'pricing_currency':
              event.pricing = { ...event.pricing, currency: value };
              break;
            case 'pricing_priceRange_min':
            case 'pricing_priceRange_max':
              const isMin = header.includes('min');
              const currentRange = event.pricing?.priceRange || [0, 0];
              if (isMin) {
                currentRange[0] = parseFloat(value) || 0;
              } else {
                currentRange[1] = parseFloat(value) || 0;
              }
              event.pricing = { 
                ...event.pricing, 
                priceRange: currentRange,
                isFree: false
              };
              break;
            case 'coordinates':
              // Parse coordinates in format "(lat, lng)"
              const coordMatch = value.match(/\(([^,]+),\s*([^)]+)\)/);
              if (coordMatch) {
                const lat = parseFloat(coordMatch[1]);
                const lng = parseFloat(coordMatch[2]);
                event.coordinates = `(${lat}, ${lng})`;
              }
              break;
            case 'is_featured':
              event[header] = value.toLowerCase() === 'true';
              break;
            default:
              event[header] = value;
              break;
          }
        });

        // Ensure required fields
        if (!event.title || !event.location || !event.start_date || !event.end_date) {
          console.warn(`Skipping row ${i}: missing required fields`);
          continue;
        }

        // Set defaults if missing
        event.accessibility = event.accessibility || {
          languages: ['en'],
          wheelchairAccessible: false,
          familyFriendly: true
        };
        event.pricing = event.pricing || { isFree: true, currency: 'USD' };
        event.is_featured = event.is_featured || false;

        events.push(event);
      }

      if (events.length === 0) {
        throw new Error('No valid events found in CSV');
      }

      const { data, error } = await supabase
        .from('events')
        .insert(events)
        .select();

      if (error) throw error;

      toast.success(`Successfully loaded ${data.length} events from CSV!`);
      console.log('✅ CSV events loaded:', data);
    } catch (error: any) {
      console.error('❌ Error loading CSV:', error);
      toast.error(`Failed to load CSV: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const clearAllData = async () => {
    if (!user) {
      toast.error('Please sign in to clear data');
      return;
    }

    if (!confirm('Are you sure you want to delete ALL events? This cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('created_by', user.id);

      if (error) throw error;

      toast.success('All your events have been deleted');
    } catch (error: any) {
      console.error('❌ Error clearing data:', error);
      toast.error(`Failed to clear data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csvHeaders = [
      'title',
      'description',
      'location',
      'venue_name',
      'start_date',
      'end_date',
      'category',
      'tags',
      'coordinates',
      'accessibility_languages',
      'accessibility_wheelchairAccessible',
      'accessibility_familyFriendly',
      'pricing_isFree',
      'pricing_currency',
      'pricing_priceRange_min',
      'pricing_priceRange_max',
      'is_featured',
      'image_url'
    ];

    const csvExample = [
      'Tech Conference 2025',
      'Annual technology conference with industry leaders',
      'San Francisco, CA',
      'Convention Center',
      '2025-08-15T09:00:00Z',
      '2025-08-15T17:00:00Z',
      '["Technology","Business"]',
      '["tech","conference","networking"]',
      '(37.7749, -122.4194)',
      '["en"]',
      'true',
      'true',
      'false',
      'USD',
      '99',
      '299',
      'true',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    ];

    const csvContent = [
      csvHeaders.join(','),
      csvExample.join(','),
      // Add empty row for user to fill
      csvHeaders.map(() => '').join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'events_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV template downloaded!');
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-purple-200 bg-purple-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          CSV Event Data Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                disabled={isUploading || !user}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                id="csv-upload"
              />
              <Button
                disabled={isUploading || !user}
                className="flex items-center gap-2"
                asChild
              >
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'Uploading...' : 'Upload CSV Events'}
                </label>
              </Button>
            </div>
            
            <Button
              onClick={clearAllData}
              disabled={isLoading || !user}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Events
            </Button>

            <Button
              onClick={downloadCsvTemplate}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV Template
            </Button>
          </div>
          
          {!user && (
            <p className="text-sm text-muted-foreground">
              Please sign in to manage event data
            </p>
          )}

          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium text-sm mb-2">CSV Template Format:</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• <strong>dates:</strong> ISO format (2025-08-15T09:00:00Z)</p>
              <p>• <strong>category/tags:</strong> JSON arrays ["Technology","Business"]</p>
              <p>• <strong>coordinates:</strong> Point format (lat, lng)</p>
              <p>• <strong>pricing_priceRange:</strong> Use min/max columns for range</p>
              <p>• <strong>boolean fields:</strong> true/false</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
