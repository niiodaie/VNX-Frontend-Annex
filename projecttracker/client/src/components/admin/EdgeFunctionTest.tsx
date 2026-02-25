import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function EdgeFunctionTest() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testEdgeFunction = async () => {
    setLoading(true);
    try {
      // Call the Edge Function directly
      const { data, error } = await supabase.functions.invoke('insert-recurring-tasks', {
        body: {},
        method: 'POST'
      });

      if (error) {
        console.error('Edge Function error:', error);
        toast.error('Edge Function failed to execute');
        setResults({ error: error.message });
      } else {
        console.log('Edge Function success:', data);
        toast.success(`Edge Function executed! Created ${data.tasksCreated} tasks`);
        setResults(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to call Edge Function');
      setResults({ error: 'Network or configuration error' });
    } finally {
      setLoading(false);
    }
  };

  const testTaskCreation = async () => {
    setLoading(true);
    try {
      // Create a test task manually to verify schema
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.from('tasks').insert({
        title: 'Test Daily Standup',
        description: 'Manual test task with recurring pattern',
        status: 'pending',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_recurring: true,
        recurrence_pattern: 'daily',
        owner_id: user.user?.id
      }).select().single();

      if (error) {
        console.error('Task creation error:', error);
        toast.error('Failed to create test task');
        setResults({ error: error.message });
      } else {
        toast.success('Test task created successfully!');
        setResults({ testTask: data });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to create test task');
      setResults({ error: 'Task creation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Edge Function Testing</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Test Edge Function</h3>
          <p className="text-sm text-gray-600 mb-3">
            This will call the insert-recurring-tasks Edge Function to create daily standup tasks for all users.
          </p>
          <button
            onClick={testEdgeFunction}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-3"
            disabled={loading}
          >
            {loading ? "Testing..." : "Test Edge Function"}
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Test Task Schema</h3>
          <p className="text-sm text-gray-600 mb-3">
            This will create a test recurring task to verify the database schema is working.
          </p>
          <button
            onClick={testTaskCreation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Test Task"}
          </button>
        </div>
      </div>

      {results && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Results:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Deployment Instructions:</h3>
        <ol className="text-sm text-gray-700 space-y-1">
          <li>1. Install Supabase CLI: <code className="bg-gray-200 px-1 rounded">npm install -g supabase</code></li>
          <li>2. Login to Supabase: <code className="bg-gray-200 px-1 rounded">supabase login</code></li>
          <li>3. Deploy function: <code className="bg-gray-200 px-1 rounded">supabase functions deploy insert-recurring-tasks</code></li>
          <li>4. Set up cron job in Supabase SQL Editor for daily execution</li>
        </ol>
      </div>
    </div>
  );
}