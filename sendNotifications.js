const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const SUPABASE_URL = 'https://baturiecnalyujasvcsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdHVyaWVjbmFseXVqYXN2Y3N3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQ0MjcwNSwiZXhwIjoyMDY2MDE4NzA1fQ.RobxsBw0yR_ic7U3PnOXUh9jyaTOrP4yr6Kzoyv6y1w'; // Use a secure env var in production
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

async function sendPushNotification(token, title, body) {
  await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title,
      body,
    }),
  });
}

async function main() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // 1. Find tasks due today or tomorrow
  const { data: tasks } = await supabase
    .from('checklist_master_tasks')
    .select('*')
    .gte('due_date', today.toISOString().slice(0, 10))
    .lte('due_date', tomorrow.toISOString().slice(0, 10));

  for (const task of tasks) {
    // 2. Find users in the right grade
    const { data: users } = await supabase
      .from('profiles')
      .select('id, expo_push_token')
      .eq('grade', task.grade)
      .not('expo_push_token', 'is', null);

    for (const user of users) {
      // 3. Check if user has NOT completed the task
      const { data: completion } = await supabase
        .from('checklist_items')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('task_id', task.id)
        .single();

      if (!completion || !completion.is_completed) {
        // 4. Send notification
        await sendPushNotification(
          user.expo_push_token,
          'Task Due Soon!',
          `Don't forget: ${task.task_text} is due soon.`
        );
      }
    }
  }

  // 5. Re-notification logic (2 days after due date, re_notify = true)
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  const { data: reTasks } = await supabase
    .from('checklist_master_tasks')
    .select('*')
    .eq('re_notify', true)
    .eq('due_date', twoDaysAgo.toISOString().slice(0, 10));

  for (const task of reTasks) {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, expo_push_token')
      .eq('grade', task.grade)
      .not('expo_push_token', 'is', null);

    for (const user of users) {
      const { data: completion } = await supabase
        .from('checklist_items')
        .select('is_completed')
        .eq('user_id', user.id)
        .eq('task_id', task.id)
        .single();

      if (!completion || !completion.is_completed) {
        await sendPushNotification(
          user.expo_push_token,
          'Task Overdue!',
          `Reminder: ${task.task_text} is still not completed.`
        );
      }
    }
  }
}

main();
