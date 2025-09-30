const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    try {
        if (event.httpMethod === 'GET') {
            const email = event.queryStringParameters?.email;
            if (!email) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email parameter is required' })
                };
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email);

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: error.message })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data })
            };
        }

        if (event.httpMethod === 'POST') {
            const { email, name, weight, height, age, activity_level, goals, profile_picture_url } = JSON.parse(event.body);

            if (!email) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email is required' })
                };
            }

            const { data, error } = await supabase
                .from('profiles')
                .upsert({
                    email,
                    name,
                    weight,
                    height,
                    age,
                    activity_level,
                    goals,
                    profile_picture_url,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'email'
                })
                .select();

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: error.message })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ data })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};