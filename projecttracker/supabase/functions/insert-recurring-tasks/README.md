# Insert Recurring Tasks Edge Function

This Supabase Edge Function automatically creates daily standup tasks for all users in the system.

## Deployment

1. Install Supabase CLI if not already installed:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Deploy the function:
```bash
supabase functions deploy insert-recurring-tasks
```

## Environment Variables

The function requires these environment variables to be set in your Supabase project:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (not anon key)

## Usage

### Manual Trigger
```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/insert-recurring-tasks' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

### Scheduled Execution
Set up a cron job or use Supabase's cron extension to run daily:

```sql
-- Run daily at 6 AM UTC
SELECT cron.schedule('daily-task-creation', '0 6 * * *', 'SELECT net.http_post(url:=''https://your-project.supabase.co/functions/v1/insert-recurring-tasks'', headers:=''{"Authorization": "Bearer YOUR_ANON_KEY"}'')');
```

## Function Behavior

- Fetches all users with role "user"
- Creates a "Daily Standup" task for each user
- Sets due date to tomorrow
- Marks tasks as recurring with daily pattern
- Returns count of successfully created tasks

## Response Format

```json
{
  "message": "Recurring tasks inserted successfully",
  "tasksCreated": 5,
  "totalUsers": 5
}
```