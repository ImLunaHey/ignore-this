'use server';
import { getRequestContext } from '@cloudflare/next-on-pages';

const doesUserExist = async (username: string) => {
  const env = getRequestContext().env;
  const query = env.db.prepare('SELECT * FROM users WHERE username = $1');
  const result = await query.bind(username).first<{ username: string }>();
  return result?.username;
};

export const signIn = async (username: string, password: string) => {
  const env = getRequestContext().env;

  const userExists = await doesUserExist(username);
  if (!userExists) {
    return new Response('invalid credentials', { status: 401 });
  }

  // Check if the password is correct
  const query = env.db.prepare('SELECT * FROM users WHERE username = $1');
  const result = await query.bind(username).first<{ password: string }>();
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  // @ts-expect-error - TS doesn't know about timingSafeEqual
  const isPasswordCorrect = crypto.subtle.timingSafeEqual(result?.password, hash);
  if (isPasswordCorrect) {
    return new Response('invalid credentials', { status: 401 });
  }

  // Create a new response with a redirect to the home page
  const response = new Response(null, { status: 302, headers: { Location: '/' } });
  const sessionId = crypto.randomUUID();

  // Save the session id in the database
  await env.db.prepare('INSERT INTO sessions (id, user_id) VALUES ($1, $2)').bind(sessionId, userExists).run();

  // Set cookie to remember the user
  response.headers.append('Set-Cookie', `sessionId=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict`);

  // Return the response
  return response;
};

export const signUp = async (username: string, password: string) => {
  const env = getRequestContext().env;
  const userExists = await doesUserExist(username);
  if (userExists) {
    return new Response('username already exists', { status: 409 });
  }

  // Hash the password
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));

  // Create the user
  const id = crypto.randomUUID();
  const info = await env.db
    .prepare('INSERT INTO users (id, username, password) VALUES ($1, $2, $3)')
    .bind(id, username, hash)
    .run()
    .catch((e) => {
      return {
        success: false,
        error: e.message,
      };
    });

  // Check if the query was successful
  if (info.success === false) {
    return new Response('failed to create user', { status: 500 });
  }

  // Return the id of the new user
  return new Response(JSON.stringify({ id }), { status: 201 });
};

export const signOut = async () => {
  const response = new Response(null, { status: 302, headers: { Location: '/' } });
  response.headers.append('Set-Cookie', `sessionId=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
  return response;
};
