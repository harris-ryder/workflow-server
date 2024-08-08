import http, { IncomingMessage, ServerResponse } from 'http';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const allowedDomain = '*';
  res.setHeader('Access-Control-Allow-Origin', allowedDomain);
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const searchParams = url.searchParams;
  const query = searchParams.get('query');
  const location = searchParams.get('location');

  if (!query) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Query parameter is missing' }));
    return;
  }

  getJson({
    engine: 'google_images',
    api_key: process.env.SERPAPI_API_KEY as string,
    q: query,
    location: location,
  }, (json) => {
    try {

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ images_results: json["images_results"] }));
    } catch (error: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
});
