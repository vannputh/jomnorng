const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://refgdyhvqesyuqdgsanx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZmdkeWh2cWVzeXVxZGdzYW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMTc1NTYsImV4cCI6MjA4MTc5MzU1Nn0._wjfb_41QtUX5VwgTgWNMN7uaAX2BEF9mcjq82KIoWU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmail() {
    console.log('Attempting to send magic link to vannputhikasuon@gmail.com...');
    const { data, error } = await supabase.auth.signInWithOtp({
        email: 'vannputhikasuon@gmail.com',
        options: {
            emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
    });

    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent successfully!', data);
    }
}

testEmail();
