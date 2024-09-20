import { Response } from 'fets';
import { router } from '../lib/server.js';

const WIDTH = 20;
const HEIGHT = 20;
let canvas: string[][] = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('#f7f7f7'));

router.route({
  path: '/canvas',
  method: 'GET',
  schemas: {
    responses: {
      200: {
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      } as const
    }
  },
  handler() {
    return Response.json(canvas);
  }
});


router.route({
    path: '/update-color',
    method: 'POST',
    async handler(req) {
        const body = await req.json();

        if (typeof body.row !== 'number' || typeof body.col !== 'number' || typeof body.color !== 'string') {
            return Response.json({ success: false, message: 'Invalid parameters' });
        }
        if (body.row < 0 || body.row >= HEIGHT || body.col < 0 || body.col >= WIDTH || !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
            return Response.json({ success: false });
        }

        canvas[body.row][body.col] = body.color;

        return Response.json({ success: true });
    }
});